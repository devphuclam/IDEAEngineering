#include "q15_io_shim.h"

#include <windows.h>

extern "C" __declspec(dllexport) int32_t idea_q15_start_overlapped_io(
    void* handle,
    int32_t write,
    void* buffer,
    uint32_t length,
    void* overlapped,
    uint32_t* error_code) {
  if (error_code == nullptr) {
    return 0;
  }
  const BOOL ok = write != 0
                      ? WriteFile(static_cast<HANDLE>(handle), buffer, length,
                                  nullptr, static_cast<OVERLAPPED*>(overlapped))
                      : ReadFile(static_cast<HANDLE>(handle), buffer, length,
                                 nullptr, static_cast<OVERLAPPED*>(overlapped));
  *error_code = ok ? ERROR_SUCCESS : GetLastError();
  return ok ? 1 : 0;
}

extern "C" __declspec(dllexport) int32_t idea_q15_finish_overlapped_io(
    void* handle,
    void* overlapped,
    uint32_t* transferred,
    int32_t wait,
    uint32_t* error_code) {
  if (transferred == nullptr || error_code == nullptr) {
    return 0;
  }
  DWORD bytes = 0;
  const BOOL ok = GetOverlappedResult(
      static_cast<HANDLE>(handle), static_cast<OVERLAPPED*>(overlapped), &bytes,
      wait != 0 ? TRUE : FALSE);
  *transferred = bytes;
  *error_code = ok ? ERROR_SUCCESS : GetLastError();
  return ok ? 1 : 0;
}
