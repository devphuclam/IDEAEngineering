#include "q15_io_shim.h"

#include <windows.h>

#include <atomic>
#include <cstring>
#include <memory>
#include <new>
#include <thread>
#include <vector>

namespace {

struct Diagnostics {
  std::atomic<uint64_t> active_operations{0};
  std::atomic<uint64_t> immediate_read_success{0};
  std::atomic<uint64_t> immediate_write_success{0};
  std::atomic<uint64_t> immediate_failures{0};
  std::atomic<uint64_t> pending_read{0};
  std::atomic<uint64_t> pending_write{0};
  std::atomic<uint64_t> terminal_success{0};
  std::atomic<uint64_t> terminal_failure{0};
  std::atomic<uint64_t> terminal_operation_aborted{0};
  std::atomic<uint64_t> detached_cleanup_started{0};
  std::atomic<uint64_t> detached_cleanup_completed{0};
  std::atomic<uint64_t> detached_read_discarded_success{0};
};

Diagnostics diagnostics;

struct NativeOperation {
  HANDLE pipe = INVALID_HANDLE_VALUE;
  HANDLE event = nullptr;
  OVERLAPPED overlapped{};
  std::vector<uint8_t> buffer;
  bool write = false;
  bool terminal_observed = false;
  IdeaQ15IoCompletionResult terminal{};

  ~NativeOperation() {
    if (event != nullptr) CloseHandle(event);
    if (pipe != INVALID_HANDLE_VALUE) CloseHandle(pipe);
  }
};

NativeOperation* FromOpaque(uintptr_t operation) {
  return reinterpret_cast<NativeOperation*>(operation);
}

void InitializeCompletion(IdeaQ15IoCompletionResult* result) {
  if (result == nullptr) return;
  *result = {};
  result->state = IDEA_Q15_IO_STILL_PENDING;
  result->error_code = ERROR_IO_INCOMPLETE;
}

void RecordTerminal(NativeOperation* operation,
                    int32_t state,
                    DWORD error,
                    DWORD transferred) {
  operation->terminal_observed = true;
  operation->terminal.state = state;
  operation->terminal.error_code = error;
  operation->terminal.bytes_transferred = transferred;
  if (state == IDEA_Q15_IO_TERMINAL_SUCCESS) {
    ++diagnostics.terminal_success;
  } else {
    ++diagnostics.terminal_failure;
    if (error == ERROR_OPERATION_ABORTED) {
      ++diagnostics.terminal_operation_aborted;
    }
  }
}

void DeleteOperation(NativeOperation* operation) {
  delete operation;
  --diagnostics.active_operations;
}

void ObserveTerminal(NativeOperation* operation,
                     void* caller_buffer,
                     uint32_t caller_capacity,
                     IdeaQ15IoCompletionResult* result,
                     BOOL wait,
                     bool discard_read = false) {
  if (operation->terminal_observed) {
    *result = operation->terminal;
    return;
  }

  DWORD transferred = 0;
  const BOOL ok = GetOverlappedResult(operation->pipe, &operation->overlapped,
                                      &transferred, wait);
  const DWORD error = ok ? ERROR_SUCCESS : GetLastError();
  if (!ok && error == ERROR_IO_INCOMPLETE) {
    result->state = IDEA_Q15_IO_STILL_PENDING;
    result->error_code = error;
    return;
  }

  if (ok && !operation->write) {
    if (discard_read) {
      ++diagnostics.detached_read_discarded_success;
    } else if (transferred > 0 &&
               (caller_buffer == nullptr || caller_capacity < transferred)) {
      RecordTerminal(operation, IDEA_Q15_IO_TERMINAL_FAILURE,
                     ERROR_INSUFFICIENT_BUFFER, transferred);
      *result = operation->terminal;
      return;
    } else if (transferred > 0) {
      std::memcpy(caller_buffer, operation->buffer.data(), transferred);
    }
  }

  RecordTerminal(operation,
                 ok ? IDEA_Q15_IO_TERMINAL_SUCCESS
                    : IDEA_Q15_IO_TERMINAL_FAILURE,
                 error, transferred);
  *result = operation->terminal;
}

void ResetCounter(std::atomic<uint64_t>& value) { value.store(0); }

}  // namespace

extern "C" __declspec(dllexport) void idea_q15_open_named_pipe(
    const wchar_t* pipe_name,
    uint32_t timeout_ms,
    IdeaQ15ConnectResult* result) {
  if (result == nullptr) return;
  *result = {};
  result->state = IDEA_Q15_CONNECT_FAILURE;
  result->pipe_handle = reinterpret_cast<intptr_t>(INVALID_HANDLE_VALUE);
  if (pipe_name == nullptr || pipe_name[0] == L'\0') {
    result->error_code = ERROR_INVALID_PARAMETER;
    return;
  }

  if (!WaitNamedPipeW(pipe_name, timeout_ms)) {
    result->error_code = GetLastError();
    return;
  }
  const HANDLE handle = CreateFileW(
      pipe_name, GENERIC_READ | GENERIC_WRITE, 0, nullptr, OPEN_EXISTING,
      FILE_FLAG_OVERLAPPED, nullptr);
  if (handle == INVALID_HANDLE_VALUE) {
    result->error_code = GetLastError();
    return;
  }
  result->state = IDEA_Q15_CONNECT_SUCCESS;
  result->error_code = ERROR_SUCCESS;
  result->pipe_handle = reinterpret_cast<intptr_t>(handle);
}

extern "C" __declspec(dllexport) int32_t idea_q15_close_named_pipe(
    intptr_t pipe_handle) {
  const HANDLE handle = reinterpret_cast<HANDLE>(pipe_handle);
  if (handle == nullptr || handle == INVALID_HANDLE_VALUE) return 0;
  return CloseHandle(handle) ? 1 : 0;
}

extern "C" __declspec(dllexport) void idea_q15_start_overlapped_io(
    intptr_t pipe_handle,
    int32_t write,
    const void* caller_buffer,
    uint32_t length,
    IdeaQ15IoStartResult* result) {
  if (result == nullptr) return;
  *result = {};
  result->state = IDEA_Q15_IO_IMMEDIATE_FAILURE;
  const HANDLE source = reinterpret_cast<HANDLE>(pipe_handle);
  if (source == nullptr || source == INVALID_HANDLE_VALUE || length == 0 ||
      caller_buffer == nullptr || (write != 0 && write != 1)) {
    result->error_code = ERROR_INVALID_PARAMETER;
    ++diagnostics.immediate_failures;
    return;
  }

  try {
    auto operation = std::make_unique<NativeOperation>();
    operation->write = write != 0;
    operation->buffer.resize(length);
    if (operation->write) {
      std::memcpy(operation->buffer.data(), caller_buffer, length);
    }
    if (!DuplicateHandle(GetCurrentProcess(), source, GetCurrentProcess(),
                         &operation->pipe, 0, FALSE, DUPLICATE_SAME_ACCESS)) {
      result->error_code = GetLastError();
      ++diagnostics.immediate_failures;
      return;
    }
    operation->event = CreateEventW(nullptr, TRUE, FALSE, nullptr);
    if (operation->event == nullptr) {
      result->error_code = GetLastError();
      ++diagnostics.immediate_failures;
      return;
    }
    operation->overlapped.hEvent = operation->event;

    DWORD transferred = 0;
    const BOOL ok = operation->write
                        ? WriteFile(operation->pipe, operation->buffer.data(),
                                    length, &transferred,
                                    &operation->overlapped)
                        : ReadFile(operation->pipe, operation->buffer.data(),
                                   length, &transferred,
                                   &operation->overlapped);
    const DWORD error = ok ? ERROR_SUCCESS : GetLastError();
    if (ok) {
      if (!operation->write && transferred > 0) {
        std::memcpy(const_cast<void*>(caller_buffer), operation->buffer.data(),
                    transferred);
      }
      result->state = IDEA_Q15_IO_IMMEDIATE_SUCCESS;
      result->error_code = ERROR_SUCCESS;
      result->bytes_transferred = transferred;
      if (operation->write) {
        ++diagnostics.immediate_write_success;
      } else {
        ++diagnostics.immediate_read_success;
      }
      return;
    }

    if (error != ERROR_IO_PENDING) {
      result->error_code = error;
      ++diagnostics.immediate_failures;
      return;
    }

    result->state = IDEA_Q15_IO_PENDING;
    result->error_code = ERROR_IO_PENDING;
    result->operation = reinterpret_cast<uintptr_t>(operation.release());
    ++diagnostics.active_operations;
    if (write != 0) {
      ++diagnostics.pending_write;
    } else {
      ++diagnostics.pending_read;
    }
  } catch (const std::bad_alloc&) {
    result->error_code = ERROR_NOT_ENOUGH_MEMORY;
    ++diagnostics.immediate_failures;
  } catch (...) {
    result->error_code = ERROR_UNHANDLED_EXCEPTION;
    ++diagnostics.immediate_failures;
  }
}

extern "C" __declspec(dllexport) void idea_q15_wait_overlapped_io(
    uintptr_t operation_value,
    uint32_t timeout_ms,
    void* caller_buffer,
    uint32_t caller_capacity,
    IdeaQ15IoCompletionResult* result) {
  InitializeCompletion(result);
  if (result == nullptr) return;
  NativeOperation* operation = FromOpaque(operation_value);
  if (operation == nullptr) {
    result->state = IDEA_Q15_IO_TERMINAL_FAILURE;
    result->error_code = ERROR_INVALID_PARAMETER;
    return;
  }
  if (operation->terminal_observed) {
    *result = operation->terminal;
    return;
  }

  const DWORD wait_result = WaitForSingleObject(operation->event, timeout_ms);
  if (wait_result == WAIT_TIMEOUT) {
    result->state = IDEA_Q15_IO_WAIT_TIMEOUT;
    result->error_code = WAIT_TIMEOUT;
    return;
  }
  if (wait_result != WAIT_OBJECT_0) {
    result->state = IDEA_Q15_IO_STILL_PENDING;
    result->error_code = wait_result == WAIT_FAILED ? GetLastError()
                                                    : ERROR_INVALID_STATE;
    return;
  }
  ObserveTerminal(operation, caller_buffer, caller_capacity, result, FALSE);
}

extern "C" __declspec(dllexport) void idea_q15_cancel_overlapped_io(
    uintptr_t operation_value,
    IdeaQ15CancelResult* result) {
  if (result == nullptr) return;
  *result = {};
  NativeOperation* operation = FromOpaque(operation_value);
  if (operation == nullptr || operation->terminal_observed) {
    result->state = IDEA_Q15_CANCEL_FAILURE;
    result->error_code = ERROR_INVALID_PARAMETER;
    return;
  }
  if (CancelIoEx(operation->pipe, &operation->overlapped)) {
    result->state = IDEA_Q15_CANCEL_REQUESTED;
    result->error_code = ERROR_SUCCESS;
    return;
  }
  result->error_code = GetLastError();
  result->state = result->error_code == ERROR_NOT_FOUND
                      ? IDEA_Q15_CANCEL_NOT_FOUND
                      : IDEA_Q15_CANCEL_FAILURE;
}

extern "C" __declspec(dllexport) int32_t idea_q15_release_overlapped_io(
    uintptr_t operation_value) {
  NativeOperation* operation = FromOpaque(operation_value);
  if (operation == nullptr || !operation->terminal_observed) return 0;
  DeleteOperation(operation);
  return 1;
}

extern "C" __declspec(dllexport) int32_t idea_q15_detach_overlapped_cleanup(
    uintptr_t operation_value,
    IdeaQ15IoCompletionResult* result) {
  InitializeCompletion(result);
  if (result == nullptr) return 0;
  NativeOperation* operation = FromOpaque(operation_value);
  if (operation == nullptr || operation->terminal_observed) {
    result->state = IDEA_Q15_IO_TERMINAL_FAILURE;
    result->error_code = ERROR_INVALID_PARAMETER;
    return 0;
  }
  try {
    std::thread([operation]() {
      IdeaQ15IoCompletionResult ignored{};
      ObserveTerminal(operation, nullptr, 0, &ignored, TRUE, true);
      DeleteOperation(operation);
      ++diagnostics.detached_cleanup_completed;
    }).detach();
    ++diagnostics.detached_cleanup_started;
    result->state = IDEA_Q15_IO_STILL_PENDING;
    result->error_code = ERROR_IO_PENDING;
    return 1;
  } catch (...) {
    result->state = IDEA_Q15_IO_STILL_PENDING;
    result->error_code = ERROR_NOT_ENOUGH_MEMORY;
    return 0;
  }
}

extern "C" __declspec(dllexport) void idea_q15_get_io_diagnostics(
    IdeaQ15IoDiagnostics* result) {
  if (result == nullptr) return;
  result->active_operations = diagnostics.active_operations.load();
  result->immediate_read_success =
      diagnostics.immediate_read_success.load();
  result->immediate_write_success =
      diagnostics.immediate_write_success.load();
  result->immediate_failures = diagnostics.immediate_failures.load();
  result->pending_read = diagnostics.pending_read.load();
  result->pending_write = diagnostics.pending_write.load();
  result->terminal_success = diagnostics.terminal_success.load();
  result->terminal_failure = diagnostics.terminal_failure.load();
  result->terminal_operation_aborted =
      diagnostics.terminal_operation_aborted.load();
  result->detached_cleanup_started =
      diagnostics.detached_cleanup_started.load();
  result->detached_cleanup_completed =
      diagnostics.detached_cleanup_completed.load();
  result->detached_read_discarded_success =
      diagnostics.detached_read_discarded_success.load();
}

extern "C" __declspec(dllexport) int32_t idea_q15_reset_io_diagnostics() {
  if (diagnostics.active_operations.load() != 0) return 0;
  ResetCounter(diagnostics.immediate_read_success);
  ResetCounter(diagnostics.immediate_write_success);
  ResetCounter(diagnostics.immediate_failures);
  ResetCounter(diagnostics.pending_read);
  ResetCounter(diagnostics.pending_write);
  ResetCounter(diagnostics.terminal_success);
  ResetCounter(diagnostics.terminal_failure);
  ResetCounter(diagnostics.terminal_operation_aborted);
  ResetCounter(diagnostics.detached_cleanup_started);
  ResetCounter(diagnostics.detached_cleanup_completed);
  ResetCounter(diagnostics.detached_read_discarded_success);
  return 1;
}
