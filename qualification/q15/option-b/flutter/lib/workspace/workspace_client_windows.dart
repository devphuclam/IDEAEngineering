import 'dart:async';
import 'dart:collection';
import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'dart:math';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';
import 'package:ffi/ffi.dart';

import '../models.dart';
import 'workspace_client_base.dart';

WorkspaceClient createWorkspaceClient() =>
    DirectFfiWorkspaceClient.fromEnvironment();

class DirectFfiWorkspaceClient implements WorkspaceClient {
  DirectFfiWorkspaceClient._(this._config);
  DirectFfiWorkspaceClient.forTesting({
    required String pipeName,
    required String workspaceId,
    required String sessionId,
    required String encodedSecret,
  }) : _config = _NativeConfig(
         pipeName: pipeName,
         workspaceId: workspaceId,
         sessionId: sessionId,
         encodedSecret: encodedSecret,
       );
  factory DirectFfiWorkspaceClient.fromEnvironment() =>
      DirectFfiWorkspaceClient._(
        _NativeConfig(
          pipeName:
              Platform.environment['IDEA_Q15_PIPE_NAME'] ??
              'idea-q15-workspace-v1',
          workspaceId:
              Platform.environment['IDEA_Q15_WORKSPACE_ID'] ?? 'WS-Q15-001',
          sessionId:
              Platform.environment['IDEA_Q15_WORKSPACE_SESSION'] ??
              'SESSION-Q15-001',
          encodedSecret:
              Platform.environment['IDEA_Q15_WORKSPACE_SECRET'] ?? '',
        ),
      );
  final _NativeConfig _config;
  int _sequence = 0;

  @override
  bool get available => Platform.isWindows && _config.encodedSecret.isNotEmpty;

  @override
  Future<WorkspaceResult> send(
    String operation,
    Map<String, String> payload, {
    Duration timeout = const Duration(seconds: 8),
  }) async {
    if (!available) throw StateError('WORKSPACE_CONFIGURATION');
    _validateIntent(operation, payload);
    final requestId = _uuid();
    final request = <String, dynamic>{
      'protocolVersion': '1.0',
      'requestId': requestId,
      'workspaceId': _config.workspaceId,
      'sessionId': _config.sessionId,
      'sequence': ++_sequence,
      'issuedAtUnixMs': DateTime.now().toUtc().millisecondsSinceEpoch,
      'operation': operation,
      'payload': payload,
    };
    request['mac'] = _requestMac(request, _decodeSecret(_config.encodedSecret));
    final bytes = Uint8List.fromList(utf8.encode(jsonEncode(request)));
    final responseBytes = await Isolate.run(
      () => _roundTrip(_config.pipeName, bytes, timeout.inMilliseconds),
    );
    final dynamic decoded;
    try {
      decoded = jsonDecode(utf8.decode(responseBytes));
    } on Object catch (error) {
      throw WorkspaceProtocolException('MALFORMED_RESPONSE', cause: error);
    }
    if (decoded is! Map) {
      throw const WorkspaceProtocolException('MALFORMED_RESPONSE');
    }
    final response = decoded.cast<String, dynamic>();
    if (response['requestId'] != requestId) {
      throw const WorkspaceProtocolException('RESPONSE_REQUEST_ID_MISMATCH');
    }
    try {
      if (!_verifyResponse(response, _decodeSecret(_config.encodedSecret))) {
        throw const WorkspaceProtocolException('INVALID_RESPONSE_MAC');
      }
      return WorkspaceResult.fromJson(response);
    } on WorkspaceProtocolException {
      rethrow;
    } on Object catch (error) {
      throw WorkspaceProtocolException('INVALID_RESPONSE', cause: error);
    }
  }
}

void _validateIntent(String operation, Map<String, String> payload) {
  const fields = <String, List<String>>{
    'GetWorkspaceStatus': [],
    'OpenDocument': ['documentId', 'generationId'],
    'OpenFolder': ['documentId'],
    'SelectFile': ['documentId', 'artifactRole'],
    'LaunchApprovedApplication': [
      'documentId',
      'generationId',
      'applicationCode',
    ],
  };
  final expected = fields[operation];
  if (expected == null) {
    throw ArgumentError.value(operation, 'operation', 'UNKNOWN_OPERATION');
  }
  if (payload.length != expected.length ||
      payload.keys.any((key) => !expected.contains(key))) {
    throw const WorkspaceProtocolException('PAYLOAD_SCHEMA');
  }
  if (payload.keys.any(
    (key) => RegExp(r'path|command|shell', caseSensitive: false).hasMatch(key),
  )) {
    throw const WorkspaceProtocolException('FORBIDDEN_PROXY');
  }
  if (payload.values.any((value) => value.isEmpty || value.length > 128)) {
    throw const WorkspaceProtocolException('PAYLOAD_BOUNDS');
  }
}

String _requestMac(JsonMap request, List<int> secret) {
  final payloadHash = _base64Url(
    sha256.convert(utf8.encode(_canonicalJson(request['payload']))).bytes,
  );
  final text = [
    request['protocolVersion'],
    request['requestId'],
    request['workspaceId'],
    request['sessionId'],
    request['sequence'],
    request['issuedAtUnixMs'],
    request['operation'],
    payloadHash,
  ].join('\n');
  return _base64Url(Hmac(sha256, secret).convert(utf8.encode(text)).bytes);
}

bool _verifyResponse(JsonMap response, List<int> secret) {
  final payloadHash = _base64Url(
    sha256.convert(utf8.encode(_canonicalJson(response['payload']))).bytes,
  );
  final text = [
    response['protocolVersion'],
    response['requestId'],
    response['status'],
    response['code'],
    response['preservesLocalCandidate'] == true ? 'true' : 'false',
    payloadHash,
  ].join('\n');
  final expected = Hmac(sha256, secret).convert(utf8.encode(text)).bytes;
  final actual = _decodeSecret(response['mac'] as String);
  if (expected.length != actual.length) return false;
  var difference = 0;
  for (var index = 0; index < expected.length; index++) {
    difference |= expected[index] ^ actual[index];
  }
  return difference == 0;
}

dynamic _canonical(dynamic value) {
  if (value is Map) {
    final sorted = SplayTreeMap<String, dynamic>();
    for (final entry in value.entries) {
      sorted[entry.key as String] = _canonical(entry.value);
    }
    return sorted;
  }
  if (value is List) return value.map(_canonical).toList();
  return value;
}

String _canonicalJson(dynamic value) => jsonEncode(_canonical(value));
String _base64Url(List<int> value) =>
    base64Url.encode(value).replaceAll('=', '');
List<int> _decodeSecret(String value) => base64Url.decode(
  value.padRight(value.length + ((4 - value.length % 4) % 4), '='),
);

String _uuid() {
  final bytes = List<int>.generate(16, (_) => Random.secure().nextInt(256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  String part(int start, int length) => bytes
      .skip(start)
      .take(length)
      .map((value) => value.toRadixString(16).padLeft(2, '0'))
      .join();
  return '${part(0, 4)}-${part(4, 2)}-${part(6, 2)}-${part(8, 2)}-${part(10, 6)}';
}

class _NativeConfig {
  const _NativeConfig({
    required this.pipeName,
    required this.workspaceId,
    required this.sessionId,
    required this.encodedSecret,
  });
  final String pipeName;
  final String workspaceId;
  final String sessionId;
  final String encodedSecret;
}

final class _ConnectResult extends Struct {
  @Int32()
  external int state;

  @Uint32()
  external int errorCode;

  @IntPtr()
  external int pipeHandle;
}

final class _IoStartResult extends Struct {
  @Int32()
  external int state;

  @Uint32()
  external int errorCode;

  @UintPtr()
  external int operation;

  @Uint32()
  external int bytesTransferred;

  @Uint32()
  external int reserved;
}

final class _IoCompletionResult extends Struct {
  @Int32()
  external int state;

  @Uint32()
  external int errorCode;

  @Uint32()
  external int bytesTransferred;

  @Uint32()
  external int reserved;
}

final class _CancelResult extends Struct {
  @Int32()
  external int state;

  @Uint32()
  external int errorCode;
}

final class _IoDiagnostics extends Struct {
  @Uint64()
  external int activeOperations;

  @Uint64()
  external int immediateReadSuccess;

  @Uint64()
  external int immediateWriteSuccess;

  @Uint64()
  external int immediateFailures;

  @Uint64()
  external int pendingRead;

  @Uint64()
  external int pendingWrite;

  @Uint64()
  external int terminalSuccess;

  @Uint64()
  external int terminalFailure;

  @Uint64()
  external int terminalOperationAborted;

  @Uint64()
  external int detachedCleanupStarted;

  @Uint64()
  external int detachedCleanupCompleted;
}

typedef _OpenPipeNative = Void Function(
  Pointer<Utf16>,
  Uint32,
  Pointer<_ConnectResult>,
);
typedef _OpenPipeDart = void Function(
  Pointer<Utf16>,
  int,
  Pointer<_ConnectResult>,
);
typedef _ClosePipeNative = Int32 Function(IntPtr);
typedef _ClosePipeDart = int Function(int);
typedef _StartIoNative = Void Function(
  IntPtr,
  Int32,
  Pointer<Void>,
  Uint32,
  Pointer<_IoStartResult>,
);
typedef _StartIoDart = void Function(
  int,
  int,
  Pointer<Void>,
  int,
  Pointer<_IoStartResult>,
);
typedef _WaitIoNative = Void Function(
  UintPtr,
  Uint32,
  Pointer<Void>,
  Uint32,
  Pointer<_IoCompletionResult>,
);
typedef _WaitIoDart = void Function(
  int,
  int,
  Pointer<Void>,
  int,
  Pointer<_IoCompletionResult>,
);
typedef _CancelIoNative = Void Function(UintPtr, Pointer<_CancelResult>);
typedef _CancelIoDart = void Function(int, Pointer<_CancelResult>);
typedef _ReleaseIoNative = Int32 Function(UintPtr);
typedef _ReleaseIoDart = int Function(int);
typedef _DetachIoNative = Int32 Function(UintPtr, Pointer<_IoCompletionResult>);
typedef _DetachIoDart = int Function(int, Pointer<_IoCompletionResult>);
typedef _GetDiagnosticsNative = Void Function(Pointer<_IoDiagnostics>);
typedef _GetDiagnosticsDart = void Function(Pointer<_IoDiagnostics>);

class _NativeBindings {
  _NativeBindings._(DynamicLibrary library)
    : openPipe = library.lookupFunction<_OpenPipeNative, _OpenPipeDart>(
        'idea_q15_open_named_pipe',
      ),
      closePipe = library.lookupFunction<_ClosePipeNative, _ClosePipeDart>(
        'idea_q15_close_named_pipe',
      ),
      startIo = library.lookupFunction<_StartIoNative, _StartIoDart>(
        'idea_q15_start_overlapped_io',
      ),
      waitIo = library.lookupFunction<_WaitIoNative, _WaitIoDart>(
        'idea_q15_wait_overlapped_io',
      ),
      cancelIo = library.lookupFunction<_CancelIoNative, _CancelIoDart>(
        'idea_q15_cancel_overlapped_io',
      ),
      releaseIo = library.lookupFunction<_ReleaseIoNative, _ReleaseIoDart>(
        'idea_q15_release_overlapped_io',
      ),
      detachIo = library.lookupFunction<_DetachIoNative, _DetachIoDart>(
        'idea_q15_detach_overlapped_cleanup',
      ),
      getDiagnostics = library
          .lookupFunction<_GetDiagnosticsNative, _GetDiagnosticsDart>(
            'idea_q15_get_io_diagnostics',
          );

  factory _NativeBindings.load() {
    try {
      return _NativeBindings._(DynamicLibrary.executable());
    } on Object catch (error) {
      throw WorkspaceProtocolException('NATIVE_SHIM_UNAVAILABLE', cause: error);
    }
  }

  final _OpenPipeDart openPipe;
  final _ClosePipeDart closePipe;
  final _StartIoDart startIo;
  final _WaitIoDart waitIo;
  final _CancelIoDart cancelIo;
  final _ReleaseIoDart releaseIo;
  final _DetachIoDart detachIo;
  final _GetDiagnosticsDart getDiagnostics;
}

class NativeIoDiagnostics {
  const NativeIoDiagnostics({
    required this.activeOperations,
    required this.immediateReadSuccess,
    required this.immediateWriteSuccess,
    required this.immediateFailures,
    required this.pendingRead,
    required this.pendingWrite,
    required this.terminalSuccess,
    required this.terminalFailure,
    required this.terminalOperationAborted,
    required this.detachedCleanupStarted,
    required this.detachedCleanupCompleted,
  });

  final int activeOperations;
  final int immediateReadSuccess;
  final int immediateWriteSuccess;
  final int immediateFailures;
  final int pendingRead;
  final int pendingWrite;
  final int terminalSuccess;
  final int terminalFailure;
  final int terminalOperationAborted;
  final int detachedCleanupStarted;
  final int detachedCleanupCompleted;
}

NativeIoDiagnostics readNativeIoDiagnostics() {
  if (!Platform.isWindows) {
    throw UnsupportedError('Q-15 native I/O diagnostics require Windows.');
  }
  final result = calloc<_IoDiagnostics>();
  try {
    _NativeBindings.load().getDiagnostics(result);
    return NativeIoDiagnostics(
      activeOperations: result.ref.activeOperations,
      immediateReadSuccess: result.ref.immediateReadSuccess,
      immediateWriteSuccess: result.ref.immediateWriteSuccess,
      immediateFailures: result.ref.immediateFailures,
      pendingRead: result.ref.pendingRead,
      pendingWrite: result.ref.pendingWrite,
      terminalSuccess: result.ref.terminalSuccess,
      terminalFailure: result.ref.terminalFailure,
      terminalOperationAborted: result.ref.terminalOperationAborted,
      detachedCleanupStarted: result.ref.detachedCleanupStarted,
      detachedCleanupCompleted: result.ref.detachedCleanupCompleted,
    );
  } finally {
    calloc.free(result);
  }
}

Uint8List _roundTrip(String pipeName, Uint8List payload, int timeoutMs) {
  const maximumFrame = 65536;
  if (payload.isEmpty || payload.length > maximumFrame) {
    throw const WorkspaceProtocolException('FRAME_SIZE');
  }
  final bindings = _NativeBindings.load();
  final fullName = r'\\.\pipe\' + pipeName;
  final name = fullName.toNativeUtf16();
  final connect = calloc<_ConnectResult>();
  var handle = -1;
  try {
    bindings.openPipe(name, timeoutMs, connect);
    if (connect.ref.state != _connectSuccess) {
      throw WindowsException('OpenNamedPipe', connect.ref.errorCode);
    }
    handle = connect.ref.pipeHandle;
    final frame = Uint8List(4 + payload.length);
    ByteData.sublistView(frame).setUint32(0, payload.length, Endian.little);
    frame.setRange(4, frame.length, payload);
    _writeAll(bindings, handle, frame, timeoutMs);
    final header = _readExactly(bindings, handle, 4, timeoutMs);
    final length = ByteData.sublistView(header).getUint32(0, Endian.little);
    if (length == 0 || length > maximumFrame) {
      throw const WorkspaceProtocolException('OVERSIZED_RESPONSE');
    }
    return _readExactly(bindings, handle, length, timeoutMs);
  } finally {
    calloc.free(name);
    calloc.free(connect);
    if (handle != -1) bindings.closePipe(handle);
  }
}

void _writeAll(
  _NativeBindings bindings,
  int handle,
  Uint8List bytes,
  int timeoutMs,
) {
  final buffer = calloc<Uint8>(bytes.length);
  buffer.asTypedList(bytes.length).setAll(0, bytes);
  try {
    var offset = 0;
    while (offset < bytes.length) {
      final transferred = _overlappedIo(
        bindings,
        true,
        handle,
        (buffer + offset).cast(),
        bytes.length - offset,
        timeoutMs,
      );
      if (transferred <= 0) {
        throw const WorkspaceProtocolException('ZERO_BYTE_WRITE');
      }
      offset += transferred;
    }
  } finally {
    calloc.free(buffer);
  }
}

Uint8List _readExactly(
  _NativeBindings bindings,
  int handle,
  int length,
  int timeoutMs,
) {
  final buffer = calloc<Uint8>(length);
  try {
    var offset = 0;
    while (offset < length) {
      final transferred = _overlappedIo(
        bindings,
        false,
        handle,
        (buffer + offset).cast(),
        length - offset,
        timeoutMs,
      );
      if (transferred <= 0) {
        throw const WorkspaceProtocolException('TRUNCATED_FRAME');
      }
      offset += transferred;
    }
    return Uint8List.fromList(buffer.asTypedList(length));
  } finally {
    calloc.free(buffer);
  }
}

int _overlappedIo(
  _NativeBindings bindings,
  bool write,
  int handle,
  Pointer<Void> buffer,
  int length,
  int timeoutMs,
) {
  final start = calloc<_IoStartResult>();
  final completion = calloc<_IoCompletionResult>();
  final cancel = calloc<_CancelResult>();
  final operationName = write ? 'WriteFile' : 'ReadFile';
  var ownsOperation = false;
  var operation = 0;
  try {
    bindings.startIo(handle, write ? 1 : 0, buffer, length, start);
    if (start.ref.state == _ioImmediateSuccess) {
      return start.ref.bytesTransferred;
    }
    if (start.ref.state == _ioImmediateFailure) {
      throw WindowsException(operationName, start.ref.errorCode);
    }
    if (start.ref.state != _ioPending || start.ref.operation == 0) {
      throw const WorkspaceProtocolException('NATIVE_IO_START_STATE');
    }
    operation = start.ref.operation;
    ownsOperation = true;

    bindings.waitIo(operation, timeoutMs, buffer, length, completion);
    if (completion.ref.state == _ioTerminalSuccess) {
      final transferred = completion.ref.bytesTransferred;
      _releaseTerminal(bindings, operation);
      ownsOperation = false;
      return transferred;
    }
    if (completion.ref.state == _ioTerminalFailure) {
      final errorCode = completion.ref.errorCode;
      _releaseTerminal(bindings, operation);
      ownsOperation = false;
      throw WindowsException(operationName, errorCode);
    }

    final timedOut = completion.ref.state == _ioWaitTimeout;
    bindings.cancelIo(operation, cancel);
    bindings.waitIo(operation, _cancelGraceMs, buffer, length, completion);
    if (completion.ref.state == _ioTerminalSuccess ||
        completion.ref.state == _ioTerminalFailure) {
      _releaseTerminal(bindings, operation);
      ownsOperation = false;
    } else if (bindings.detachIo(operation, completion) == 1) {
      // Native now owns every resource until GetOverlappedResult is terminal.
      ownsOperation = false;
    } else {
      // Detach allocation failure is rare; blocking this worker isolate is the
      // only safe fallback because caller memory must never outlive native I/O.
      bindings.waitIo(operation, _infinite, buffer, length, completion);
      _releaseTerminal(bindings, operation);
      ownsOperation = false;
    }
    if (timedOut) {
      throw TimeoutException('$operationName timed out after ${timeoutMs}ms.');
    }
    throw WindowsException(
      'WaitForSingleObject($operationName)',
      completion.ref.errorCode,
    );
  } finally {
    if (ownsOperation) {
      bindings.cancelIo(operation, cancel);
      bindings.waitIo(operation, _infinite, buffer, length, completion);
      _releaseTerminal(bindings, operation);
    }
    calloc.free(start);
    calloc.free(completion);
    calloc.free(cancel);
  }
}

void _releaseTerminal(_NativeBindings bindings, int operation) {
  if (bindings.releaseIo(operation) != 1) {
    throw const WorkspaceProtocolException('NATIVE_IO_RELEASE_STATE');
  }
}

const _connectSuccess = 1;
const _ioImmediateSuccess = 1;
const _ioPending = 2;
const _ioImmediateFailure = 3;
const _ioTerminalSuccess = 1;
const _ioTerminalFailure = 2;
const _ioWaitTimeout = 3;
const _cancelGraceMs = 250;
const _infinite = 0xffffffff;

class WindowsException implements Exception {
  const WindowsException(this.operation, this.code);
  final String operation;
  final int code;

  String get classification => operation == 'WaitNamedPipeW' && code == 0
      ? 'PIPE_UNAVAILABLE'
      : switch (code) {
          2 || 231 || 121 => 'PIPE_UNAVAILABLE',
          109 => 'PIPE_BROKEN',
          5 => 'ACCESS_DENIED',
          995 => 'CANCELLED',
          258 => 'TIMEOUT',
          _ => 'NATIVE_FAILURE',
        };

  @override
  String toString() =>
      '$operation failed with Win32 error $code ($classification)';
}

class WorkspaceProtocolException implements Exception {
  const WorkspaceProtocolException(this.code, {this.cause});
  final String code;
  final Object? cause;

  @override
  String toString() => 'Workspace protocol error: $code';
}
