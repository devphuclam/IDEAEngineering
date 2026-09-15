#include "q15_io_shim.h"

#include <windows.h>
#include <psapi.h>
#include <tlhelp32.h>

#include <atomic>
#include <chrono>
#include <cstdint>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>

namespace {

using namespace std::chrono_literals;

struct PipePair {
  HANDLE server = INVALID_HANDLE_VALUE;
  intptr_t client = reinterpret_cast<intptr_t>(INVALID_HANDLE_VALUE);

  PipePair() = default;
  PipePair(const PipePair&) = delete;
  PipePair& operator=(const PipePair&) = delete;
  PipePair(PipePair&& other) noexcept
      : server(other.server), client(other.client) {
    other.server = INVALID_HANDLE_VALUE;
    other.client = reinterpret_cast<intptr_t>(INVALID_HANDLE_VALUE);
  }
  PipePair& operator=(PipePair&&) = delete;

  ~PipePair() {
    if (client != reinterpret_cast<intptr_t>(INVALID_HANDLE_VALUE)) {
      idea_q15_close_named_pipe(client);
    }
    if (server != INVALID_HANDLE_VALUE) CloseHandle(server);
  }
};

void Require(bool condition, const char* message) {
  if (!condition) throw std::runtime_error(message);
}

std::wstring UniquePipeName() {
  static std::atomic<uint64_t> sequence{0};
  return L"\\\\.\\pipe\\idea-q15-shim-test-" +
         std::to_wstring(GetCurrentProcessId()) + L"-" +
         std::to_wstring(GetTickCount64()) + L"-" +
         std::to_wstring(++sequence);
}

PipePair Connect(uint32_t inbound_buffer = 4096,
                 uint32_t outbound_buffer = 4096) {
  const std::wstring name = UniquePipeName();
  PipePair pair;
  pair.server = CreateNamedPipeW(
      name.c_str(), PIPE_ACCESS_DUPLEX, PIPE_TYPE_BYTE | PIPE_READMODE_BYTE,
      1, outbound_buffer, inbound_buffer, 0, nullptr);
  Require(pair.server != INVALID_HANDLE_VALUE, "CreateNamedPipeW failed");

  DWORD connector_error = ERROR_SUCCESS;
  std::thread connector([&pair, &connector_error]() {
    const BOOL connected = ConnectNamedPipe(pair.server, nullptr);
    connector_error = connected ? ERROR_SUCCESS : GetLastError();
  });

  IdeaQ15ConnectResult result{};
  idea_q15_open_named_pipe(name.c_str(), 2000, &result);
  connector.join();
  Require(connector_error == ERROR_SUCCESS ||
              connector_error == ERROR_PIPE_CONNECTED,
          "ConnectNamedPipe failed");
  Require(result.state == IDEA_Q15_CONNECT_SUCCESS,
          "typed named-pipe open did not succeed");
  Require(result.error_code == ERROR_SUCCESS,
          "successful named-pipe open retained an error");
  pair.client = result.pipe_handle;
  return pair;
}

void CompleteAndRelease(uintptr_t operation,
                        void* read_buffer,
                        uint32_t read_capacity,
                        DWORD expected_error = ERROR_SUCCESS) {
  IdeaQ15IoCompletionResult completion{};
  idea_q15_wait_overlapped_io(operation, 2000, read_buffer, read_capacity,
                              &completion);
  Require(completion.state ==
              (expected_error == ERROR_SUCCESS ? IDEA_Q15_IO_TERMINAL_SUCCESS
                                               : IDEA_Q15_IO_TERMINAL_FAILURE),
          "operation did not reach the expected terminal state");
  Require(completion.error_code == expected_error,
          "operation returned the wrong terminal error");
  Require(idea_q15_release_overlapped_io(operation) == 1,
          "terminal operation was not releasable");
}

void TestImmediateRead() {
  auto pair = Connect();
  const std::vector<uint8_t> expected{'r', 'e', 'a', 'd'};
  DWORD written = 0;
  Require(WriteFile(pair.server, expected.data(),
                    static_cast<DWORD>(expected.size()), &written, nullptr),
          "server pre-write failed");
  std::vector<uint8_t> actual(expected.size());
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 0, actual.data(),
                               static_cast<uint32_t>(actual.size()), &start);
  Require(start.state == IDEA_Q15_IO_IMMEDIATE_SUCCESS,
          "buffered read was not classified immediate-success");
  Require(start.operation == 0, "immediate read leaked an operation handle");
  Require(start.bytes_transferred == expected.size(),
          "immediate read returned the wrong byte count");
  Require(actual == expected, "immediate read did not copy the bytes");
}

void TestImmediateWrite() {
  auto pair = Connect();
  const std::vector<uint8_t> bytes{'w', 'r', 'i', 't', 'e'};
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 1, bytes.data(),
                               static_cast<uint32_t>(bytes.size()), &start);
  Require(start.state == IDEA_Q15_IO_IMMEDIATE_SUCCESS,
          "small buffered write was not classified immediate-success");
  Require(start.operation == 0, "immediate write leaked an operation handle");
  Require(start.bytes_transferred == bytes.size(),
          "immediate write returned the wrong byte count");
  std::vector<uint8_t> actual(bytes.size());
  DWORD read = 0;
  Require(ReadFile(pair.server, actual.data(), static_cast<DWORD>(actual.size()),
                   &read, nullptr),
          "server read failed");
  Require(actual == bytes, "immediate write sent the wrong bytes");
}

void TestPendingReadAndAbort() {
  auto pair = Connect();
  std::vector<uint8_t> buffer(8);
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 0, buffer.data(),
                               static_cast<uint32_t>(buffer.size()), &start);
  Require(start.state == IDEA_Q15_IO_PENDING,
          "empty pipe read was not classified pending");
  Require(start.error_code == ERROR_IO_PENDING && start.operation != 0,
          "pending read did not return its typed operation");

  IdeaQ15IoCompletionResult timeout{};
  idea_q15_wait_overlapped_io(start.operation, 5, buffer.data(),
                              static_cast<uint32_t>(buffer.size()), &timeout);
  Require(timeout.state == IDEA_Q15_IO_WAIT_TIMEOUT,
          "pending read did not expose a wait timeout");
  Require(idea_q15_release_overlapped_io(start.operation) == 0,
          "nonterminal operation was released");

  IdeaQ15CancelResult cancel{};
  idea_q15_cancel_overlapped_io(start.operation, &cancel);
  Require(cancel.state == IDEA_Q15_CANCEL_REQUESTED ||
              cancel.state == IDEA_Q15_CANCEL_NOT_FOUND,
          "targeted cancel returned an unexpected state");
  CompleteAndRelease(start.operation, buffer.data(),
                     static_cast<uint32_t>(buffer.size()),
                     ERROR_OPERATION_ABORTED);
}

void TestPendingWriteAndAbort() {
  auto pair = Connect(1, 1);
  std::vector<uint8_t> bytes(1024 * 1024, 0x5a);
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 1, bytes.data(),
                               static_cast<uint32_t>(bytes.size()), &start);
  Require(start.state == IDEA_Q15_IO_PENDING,
          "back-pressured write was not classified pending");
  IdeaQ15CancelResult cancel{};
  idea_q15_cancel_overlapped_io(start.operation, &cancel);
  Require(cancel.state == IDEA_Q15_CANCEL_REQUESTED ||
              cancel.state == IDEA_Q15_CANCEL_NOT_FOUND,
          "pending write cancellation was not classified");
  CompleteAndRelease(start.operation, nullptr, 0, ERROR_OPERATION_ABORTED);
}

void TestImmediatePeerCloseFailures() {
  for (const bool write : {false, true}) {
    auto pair = Connect();
    CloseHandle(pair.server);
    pair.server = INVALID_HANDLE_VALUE;
    std::this_thread::sleep_for(10ms);
    std::vector<uint8_t> bytes(8, 0x2a);
    IdeaQ15IoStartResult start{};
    idea_q15_start_overlapped_io(pair.client, write ? 1 : 0, bytes.data(),
                                 static_cast<uint32_t>(bytes.size()), &start);
    Require(start.state == IDEA_Q15_IO_IMMEDIATE_FAILURE,
            write ? "peer-close write was not immediate failure"
                  : "peer-close read was not immediate failure");
    Require(start.operation == 0 && start.error_code != ERROR_IO_PENDING,
            "immediate failure returned a live operation");
  }
}

void TestCancelRaceHasTerminalOutcome() {
  auto pair = Connect();
  std::vector<uint8_t> buffer(4);
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 0, buffer.data(),
                               static_cast<uint32_t>(buffer.size()), &start);
  Require(start.state == IDEA_Q15_IO_PENDING,
          "cancel-race read did not start pending");
  std::thread writer([server = pair.server]() {
    std::this_thread::sleep_for(1ms);
    const uint8_t bytes[] = {1, 2, 3, 4};
    DWORD written = 0;
    WriteFile(server, bytes, sizeof(bytes), &written, nullptr);
  });
  IdeaQ15CancelResult cancel{};
  idea_q15_cancel_overlapped_io(start.operation, &cancel);
  IdeaQ15IoCompletionResult completion{};
  idea_q15_wait_overlapped_io(start.operation, 2000, buffer.data(),
                              static_cast<uint32_t>(buffer.size()),
                              &completion);
  writer.join();
  Require(completion.state == IDEA_Q15_IO_TERMINAL_SUCCESS ||
              completion.state == IDEA_Q15_IO_TERMINAL_FAILURE,
          "cancel race did not reach terminal completion");
  Require(completion.error_code == ERROR_SUCCESS ||
              completion.error_code == ERROR_OPERATION_ABORTED,
          "cancel race returned an unsupported final outcome");
  Require(idea_q15_release_overlapped_io(start.operation) == 1,
          "cancel-race terminal operation was not released");
}

void TestDetachedCleanupRetainsResources() {
  auto pair = Connect();
  std::vector<uint8_t> buffer(4);
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 0, buffer.data(),
                               static_cast<uint32_t>(buffer.size()), &start);
  Require(start.state == IDEA_Q15_IO_PENDING,
          "detach test did not start pending");
  IdeaQ15CancelResult cancel{};
  idea_q15_cancel_overlapped_io(start.operation, &cancel);
  IdeaQ15IoCompletionResult detached{};
  Require(idea_q15_detach_overlapped_cleanup(start.operation, &detached) == 1,
          "native cleanup ownership was not transferred");
  Require(detached.state == IDEA_Q15_IO_STILL_PENDING,
          "detached cleanup did not report retained ownership");

  IdeaQ15IoDiagnostics diagnostics{};
  for (int attempt = 0; attempt < 200; ++attempt) {
    idea_q15_get_io_diagnostics(&diagnostics);
    if (diagnostics.active_operations == 0 &&
        diagnostics.detached_cleanup_started ==
            diagnostics.detached_cleanup_completed) {
      break;
    }
    std::this_thread::sleep_for(5ms);
  }
  Require(diagnostics.active_operations == 0,
          "detached cleanup left a live operation");
  Require(diagnostics.detached_cleanup_started ==
              diagnostics.detached_cleanup_completed,
          "detached cleanup did not reach terminal completion");
}

void TestDetachedSuccessfulReadIsNotBufferFailure() {
  auto pair = Connect();
  uint8_t buffer[4]{};
  IdeaQ15IoDiagnostics before{};
  idea_q15_get_io_diagnostics(&before);
  IdeaQ15IoStartResult start{};
  idea_q15_start_overlapped_io(pair.client, 0, buffer, sizeof(buffer), &start);
  Require(start.state == IDEA_Q15_IO_PENDING, "late read did not start pending");
  const uint8_t bytes[] = {1, 2, 3, 4};
  DWORD written = 0;
  Require(WriteFile(pair.server, bytes, sizeof(bytes), &written, nullptr),
          "late server write failed");
  // Completion won before the caller requested cancellation. The native
  // cleanup owner has no caller buffer, but the I/O itself succeeded.
  IdeaQ15CancelResult cancel{};
  idea_q15_cancel_overlapped_io(start.operation, &cancel);
  IdeaQ15IoCompletionResult detached{};
  Require(idea_q15_detach_overlapped_cleanup(start.operation, &detached) == 1,
          "successful late read did not transfer ownership");
  IdeaQ15IoDiagnostics after{};
  for (int attempt = 0; attempt < 200; ++attempt) {
    idea_q15_get_io_diagnostics(&after);
    if (after.detached_cleanup_completed > before.detached_cleanup_completed) break;
    std::this_thread::sleep_for(5ms);
  }
  Require(after.detached_cleanup_completed == before.detached_cleanup_completed + 1,
          "successful late read cleanup did not complete");
  Require(after.terminal_failure == before.terminal_failure,
          "successful detached read was misclassified as buffer failure");
  Require(after.terminal_success == before.terminal_success + 1,
          "successful detached read lost native success outcome");
  Require(after.detached_read_discarded_success ==
              before.detached_read_discarded_success + 1,
          "successful detached read did not record discarded payload");
}

struct ResourceSnapshot {
  DWORD handles = 0;
  SIZE_T private_bytes = 0;
  SIZE_T working_set = 0;
  DWORD threads = 0;
  bool available = false;
};

ResourceSnapshot Resources() {
  ResourceSnapshot result{};
  PROCESS_MEMORY_COUNTERS_EX memory{};
  memory.cb = sizeof(memory);
  const bool handles_ok = GetProcessHandleCount(GetCurrentProcess(), &result.handles) != 0;
  const bool memory_ok = GetProcessMemoryInfo(
      GetCurrentProcess(), reinterpret_cast<PROCESS_MEMORY_COUNTERS*>(&memory),
      sizeof(memory)) != 0;
  result.private_bytes = memory.PrivateUsage;
  result.working_set = memory.WorkingSetSize;
  const HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
  if (snapshot == INVALID_HANDLE_VALUE) return result;
  THREADENTRY32 entry{};
  entry.dwSize = sizeof(entry);
  const bool threads_ok = Thread32First(snapshot, &entry) != 0;
  if (threads_ok) {
    do {
      if (entry.th32OwnerProcessID == GetCurrentProcessId()) ++result.threads;
    } while (Thread32Next(snapshot, &entry));
  }
  CloseHandle(snapshot);
  result.available = handles_ok && memory_ok && threads_ok;
  return result;
}

void PrintResources(const ResourceSnapshot& value) {
  std::cout << "{\"status\":\"" << (value.available ? "PASS" : "BLOCKED")
            << "\",\"handles\":" << value.handles
            << ",\"privateBytes\":" << value.private_bytes
            << ",\"workingSet\":" << value.working_set
            << ",\"threads\":" << value.threads << "}";
}

void PrintDiagnostics(const IdeaQ15IoDiagnostics& value) {
  std::cout << "{\"activeOperations\":" << value.active_operations
            << ",\"immediateReadSuccess\":" << value.immediate_read_success
            << ",\"immediateWriteSuccess\":" << value.immediate_write_success
            << ",\"immediateFailures\":" << value.immediate_failures
            << ",\"pendingRead\":" << value.pending_read
            << ",\"pendingWrite\":" << value.pending_write
            << ",\"terminalSuccess\":" << value.terminal_success
            << ",\"terminalFailure\":" << value.terminal_failure
            << ",\"terminalOperationAborted\":" << value.terminal_operation_aborted
            << ",\"detachedCleanupStarted\":" << value.detached_cleanup_started
            << ",\"detachedCleanupCompleted\":" << value.detached_cleanup_completed
            << ",\"detachedReadDiscardedSuccess\":" << value.detached_read_discarded_success
            << "}";
}

IdeaQ15IoDiagnostics DiagnosticDelta(const IdeaQ15IoDiagnostics& before,
                                     const IdeaQ15IoDiagnostics& after) {
  return {
    after.active_operations - before.active_operations,
    after.immediate_read_success - before.immediate_read_success,
    after.immediate_write_success - before.immediate_write_success,
    after.immediate_failures - before.immediate_failures,
    after.pending_read - before.pending_read,
    after.pending_write - before.pending_write,
    after.terminal_success - before.terminal_success,
    after.terminal_failure - before.terminal_failure,
    after.terminal_operation_aborted - before.terminal_operation_aborted,
    after.detached_cleanup_started - before.detached_cleanup_started,
    after.detached_cleanup_completed - before.detached_cleanup_completed,
    after.detached_read_discarded_success - before.detached_read_discarded_success,
  };
}

void TestRepeatedTimeoutCancelReconnect() {
  for (int cycle = 1; cycle <= 100; ++cycle) {
    const auto resources_before = Resources();
    IdeaQ15IoDiagnostics before{};
    idea_q15_get_io_diagnostics(&before);
    IdeaQ15CancelResult cancel{};
    IdeaQ15IoCompletionResult completion{};
    const bool detach = cycle % 2 == 0;
    DWORD writer_error = ERROR_SUCCESS;
    {
      auto pair = Connect();
      uint8_t buffer[4]{};
      IdeaQ15IoStartResult start{};
      idea_q15_start_overlapped_io(pair.client, 0, buffer, sizeof(buffer), &start);
      Require(start.state == IDEA_Q15_IO_PENDING, "cycle read was not pending");
      idea_q15_wait_overlapped_io(start.operation, 1, buffer, sizeof(buffer), &completion);
      Require(completion.state == IDEA_Q15_IO_WAIT_TIMEOUT, "cycle did not time out");
      std::thread writer([&pair, &writer_error, cycle]() {
        if (cycle % 3 == 0) std::this_thread::sleep_for(1ms);
        const uint8_t bytes[] = {1, 2, 3, 4};
        DWORD written = 0;
        const BOOL ok = WriteFile(pair.server, bytes, sizeof(bytes), &written, nullptr);
        writer_error = ok ? ERROR_SUCCESS : GetLastError();
      });
      // Deliberately vary scheduling. Never require either race winner.
      if (cycle % 3 == 1) std::this_thread::yield();
      idea_q15_cancel_overlapped_io(start.operation, &cancel);
      if (detach) {
        const auto transferred = idea_q15_detach_overlapped_cleanup(start.operation, &completion);
        writer.join();
        Require(transferred == 1, "cycle ownership transfer failed");
      } else {
        idea_q15_wait_overlapped_io(start.operation, 2000, buffer, sizeof(buffer), &completion);
        writer.join();
        Require(idea_q15_release_overlapped_io(start.operation) == 1,
                "cycle terminal operation could not be released");
      }
    }
    IdeaQ15IoDiagnostics after{};
    for (int attempt = 0; attempt < 400; ++attempt) {
      idea_q15_get_io_diagnostics(&after);
      if (after.active_operations == 0 &&
          after.detached_cleanup_started == after.detached_cleanup_completed) break;
      std::this_thread::sleep_for(5ms);
    }
    const auto success = after.terminal_success - before.terminal_success;
    const auto failure = after.terminal_failure - before.terminal_failure;
    const auto aborted = after.terminal_operation_aborted - before.terminal_operation_aborted;
    // A fresh pipe session must still transfer exact bytes after cancellation.
    TestImmediateWrite();
    idea_q15_get_io_diagnostics(&after);
    const auto resources_after = Resources();
    std::cout << "Q15_NATIVE_CYCLE {\"cycle\":" << cycle
              << ",\"waitOutcome\":\"TIMEOUT\",\"cancelState\":" << cancel.state
              << ",\"cancelError\":" << cancel.error_code
              << ",\"detached\":" << (detach ? "true" : "false")
              << ",\"writerError\":" << writer_error
              << ",\"terminalOutcome\":\""
              << (success == 1 ? "SUCCESS" : aborted == 1 ? "CANCELLED" : "QUALIFICATION-UNKNOWN")
              << "\",\"reconnect\":\"PASS\",\"nativeBefore\":";
    PrintDiagnostics(before);
    std::cout << ",\"nativeAfter\":";
    PrintDiagnostics(after);
    std::cout << ",\"nativeDelta\":";
    PrintDiagnostics(DiagnosticDelta(before, after));
    std::cout << ",\"resourcesBefore\":";
    PrintResources(resources_before);
    std::cout << ",\"resourcesAfter\":";
    PrintResources(resources_after);
    std::cout << ",\"resourceDelta\":{\"handles\":"
              << static_cast<int64_t>(resources_after.handles) - resources_before.handles
              << ",\"privateBytes\":"
              << static_cast<int64_t>(resources_after.private_bytes) -
                     static_cast<int64_t>(resources_before.private_bytes)
              << ",\"workingSet\":"
              << static_cast<int64_t>(resources_after.working_set) -
                     static_cast<int64_t>(resources_before.working_set)
              << ",\"threads\":"
              << static_cast<int64_t>(resources_after.threads) - resources_before.threads
              << "}}" << std::endl;
    Require(after.active_operations == 0 &&
                after.detached_cleanup_started == after.detached_cleanup_completed,
            "cycle cleanup remained nonterminal after observation budget");
    Require(success + failure == 1 && failure == aborted,
            "cycle produced an unexpected native terminal outcome");
  }
}

}  // namespace

int main() {
  try {
    Require(idea_q15_reset_io_diagnostics() == 1,
            "diagnostic reset failed at test start");
    TestImmediateRead();
    TestImmediateWrite();
    TestPendingReadAndAbort();
    TestPendingWriteAndAbort();
    TestImmediatePeerCloseFailures();
    TestCancelRaceHasTerminalOutcome();
    TestDetachedCleanupRetainsResources();
    TestDetachedSuccessfulReadIsNotBufferFailure();
    TestRepeatedTimeoutCancelReconnect();
    IdeaQ15IoDiagnostics diagnostics{};
    idea_q15_get_io_diagnostics(&diagnostics);
    Require(diagnostics.active_operations == 0,
            "native suite ended with live operations");
    std::cout << "Q15_NATIVE_IO_PASS immediate_read="
              << diagnostics.immediate_read_success
              << " immediate_write=" << diagnostics.immediate_write_success
              << " pending_read=" << diagnostics.pending_read
              << " pending_write=" << diagnostics.pending_write
              << " aborted=" << diagnostics.terminal_operation_aborted
              << " detached=" << diagnostics.detached_cleanup_completed
              << " discarded_success=" << diagnostics.detached_read_discarded_success
              << " active=" << diagnostics.active_operations
              << std::endl;
    return 0;
  } catch (const std::exception& error) {
    std::cerr << "Q15_NATIVE_IO_FAIL " << error.what() << std::endl;
    return 1;
  }
}
