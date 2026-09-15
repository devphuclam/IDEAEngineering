#pragma once

#include <stdint.h>

// Qualification-only, named-pipe-specific ABI. Every Win32 call and its
// GetLastError observation happen on the native side of the FFI boundary.

enum IdeaQ15ConnectState : int32_t {
  IDEA_Q15_CONNECT_SUCCESS = 1,
  IDEA_Q15_CONNECT_FAILURE = 2,
};

enum IdeaQ15IoStartState : int32_t {
  IDEA_Q15_IO_IMMEDIATE_SUCCESS = 1,
  IDEA_Q15_IO_PENDING = 2,
  IDEA_Q15_IO_IMMEDIATE_FAILURE = 3,
};

enum IdeaQ15IoCompletionState : int32_t {
  IDEA_Q15_IO_TERMINAL_SUCCESS = 1,
  IDEA_Q15_IO_TERMINAL_FAILURE = 2,
  IDEA_Q15_IO_WAIT_TIMEOUT = 3,
  IDEA_Q15_IO_STILL_PENDING = 4,
};

enum IdeaQ15CancelState : int32_t {
  IDEA_Q15_CANCEL_REQUESTED = 1,
  IDEA_Q15_CANCEL_NOT_FOUND = 2,
  IDEA_Q15_CANCEL_FAILURE = 3,
};

struct IdeaQ15ConnectResult {
  int32_t state;
  uint32_t error_code;
  intptr_t pipe_handle;
};

struct IdeaQ15IoStartResult {
  int32_t state;
  uint32_t error_code;
  uintptr_t operation;
  uint32_t bytes_transferred;
  uint32_t reserved;
};

struct IdeaQ15IoCompletionResult {
  int32_t state;
  uint32_t error_code;
  uint32_t bytes_transferred;
  uint32_t reserved;
};

struct IdeaQ15CancelResult {
  int32_t state;
  uint32_t error_code;
};

struct IdeaQ15IoDiagnostics {
  uint64_t active_operations;
  uint64_t immediate_read_success;
  uint64_t immediate_write_success;
  uint64_t immediate_failures;
  uint64_t pending_read;
  uint64_t pending_write;
  uint64_t terminal_success;
  uint64_t terminal_failure;
  uint64_t terminal_operation_aborted;
  uint64_t detached_cleanup_started;
  uint64_t detached_cleanup_completed;
  // Native read succeeded after ownership transfer; payload was not delivered.
  uint64_t detached_read_discarded_success;
};

extern "C" __declspec(dllexport) void idea_q15_open_named_pipe(
    const wchar_t* pipe_name,
    uint32_t timeout_ms,
    IdeaQ15ConnectResult* result);

extern "C" __declspec(dllexport) int32_t idea_q15_close_named_pipe(
    intptr_t pipe_handle);

// Native code owns the duplicated pipe handle, event, OVERLAPPED object and
// backing buffer for every pending operation. For reads, bytes are copied to
// caller_buffer only after terminal success is observed by wait.
extern "C" __declspec(dllexport) void idea_q15_start_overlapped_io(
    intptr_t pipe_handle,
    int32_t write,
    const void* caller_buffer,
    uint32_t length,
    IdeaQ15IoStartResult* result);

extern "C" __declspec(dllexport) void idea_q15_wait_overlapped_io(
    uintptr_t operation,
    uint32_t timeout_ms,
    void* caller_buffer,
    uint32_t caller_capacity,
    IdeaQ15IoCompletionResult* result);

extern "C" __declspec(dllexport) void idea_q15_cancel_overlapped_io(
    uintptr_t operation,
    IdeaQ15CancelResult* result);

// Release is deliberately rejected until wait has observed a terminal state.
extern "C" __declspec(dllexport) int32_t idea_q15_release_overlapped_io(
    uintptr_t operation);

// Transfers the still-pending operation to a native reaper. A successful
// detach invalidates the opaque operation value for the caller immediately.
extern "C" __declspec(dllexport) int32_t idea_q15_detach_overlapped_cleanup(
    uintptr_t operation,
    IdeaQ15IoCompletionResult* result);

extern "C" __declspec(dllexport) void idea_q15_get_io_diagnostics(
    IdeaQ15IoDiagnostics* result);

extern "C" __declspec(dllexport) int32_t idea_q15_reset_io_diagnostics();
