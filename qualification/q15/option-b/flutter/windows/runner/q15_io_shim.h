#pragma once

#include <stdint.h>

// Narrow ABI used by the qualification client. The native function captures
// GetLastError in the same call as ReadFile/WriteFile so Dart never has to
// infer ERROR_IO_PENDING across an FFI boundary.
extern "C" __declspec(dllexport) int32_t idea_q15_start_overlapped_io(
    void* handle,
    int32_t write,
    void* buffer,
    uint32_t length,
    void* overlapped,
    uint32_t* error_code);

extern "C" __declspec(dllexport) int32_t idea_q15_finish_overlapped_io(
    void* handle,
    void* overlapped,
    uint32_t* transferred,
    int32_t wait,
    uint32_t* error_code);
