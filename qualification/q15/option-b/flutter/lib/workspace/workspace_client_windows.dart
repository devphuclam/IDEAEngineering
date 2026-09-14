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
  String part(int start, int length) =>
      bytes
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

final class _Overlapped extends Struct {
  @UintPtr()
  external int internal;
  @UintPtr()
  external int internalHigh;
  @Uint32()
  external int offset;
  @Uint32()
  external int offsetHigh;
  external Pointer<Void> event;
}

typedef _WaitNamedPipeNative = Int32 Function(Pointer<Utf16>, Uint32);
typedef _WaitNamedPipeDart = int Function(Pointer<Utf16>, int);
typedef _CreateFileNative =
    IntPtr Function(
      Pointer<Utf16>,
      Uint32,
      Uint32,
      Pointer<Void>,
      Uint32,
      Uint32,
      IntPtr,
    );
typedef _CreateFileDart =
    int Function(Pointer<Utf16>, int, int, Pointer<Void>, int, int, int);
typedef _StartIoNative =
    Int32 Function(
      IntPtr,
      Int32,
      Pointer<Void>,
      Uint32,
      Pointer<_Overlapped>,
      Pointer<Uint32>,
    );
typedef _StartIoDart =
    int Function(
      int,
      int,
      Pointer<Void>,
      int,
      Pointer<_Overlapped>,
      Pointer<Uint32>,
    );
typedef _CreateEventNative =
    IntPtr Function(Pointer<Void>, Int32, Int32, Pointer<Utf16>);
typedef _CreateEventDart =
    int Function(Pointer<Void>, int, int, Pointer<Utf16>);
typedef _WaitNative = Uint32 Function(IntPtr, Uint32);
typedef _WaitDart = int Function(int, int);
typedef _CancelNative = Int32 Function(IntPtr, Pointer<_Overlapped>);
typedef _CancelDart = int Function(int, Pointer<_Overlapped>);
typedef _FinishIoNative =
    Int32 Function(
      IntPtr,
      Pointer<_Overlapped>,
      Pointer<Uint32>,
      Int32,
      Pointer<Uint32>,
    );
typedef _FinishIoDart =
    int Function(
      int,
      Pointer<_Overlapped>,
      Pointer<Uint32>,
      int,
      Pointer<Uint32>,
    );
typedef _CloseNative = Int32 Function(IntPtr);
typedef _CloseDart = int Function(int);
typedef _LastErrorNative = Uint32 Function();
typedef _LastErrorDart = int Function();

Uint8List _roundTrip(String pipeName, Uint8List payload, int timeoutMs) {
  const maximumFrame = 65536;
  if (payload.isEmpty || payload.length > maximumFrame) {
    throw const WorkspaceProtocolException('FRAME_SIZE');
  }
  final kernel = DynamicLibrary.open('kernel32.dll');
  final waitPipe = kernel
      .lookupFunction<_WaitNamedPipeNative, _WaitNamedPipeDart>(
        'WaitNamedPipeW',
      );
  final createFile = kernel.lookupFunction<_CreateFileNative, _CreateFileDart>(
    'CreateFileW',
  );
  final closeHandle = kernel.lookupFunction<_CloseNative, _CloseDart>(
    'CloseHandle',
  );
  final getLastError = kernel.lookupFunction<_LastErrorNative, _LastErrorDart>(
    'GetLastError',
  );
  final fullName = r'\\.\pipe\' + pipeName;
  final name = fullName.toNativeUtf16();
  var handle = -1;
  try {
    if (waitPipe(name, timeoutMs) == 0) {
      throw WindowsException('WaitNamedPipeW', getLastError());
    }
    handle = createFile(name, 0xc0000000, 0, nullptr, 3, 0x40000000, 0);
    if (handle == -1) throw WindowsException('CreateFileW', getLastError());
    final frame = Uint8List(4 + payload.length);
    ByteData.sublistView(frame).setUint32(0, payload.length, Endian.little);
    frame.setRange(4, frame.length, payload);
    _writeAll(kernel, handle, frame, timeoutMs, getLastError);
    final header = _readExactly(kernel, handle, 4, timeoutMs, getLastError);
    final length = ByteData.sublistView(header).getUint32(0, Endian.little);
    if (length == 0 || length > maximumFrame) {
      throw const WorkspaceProtocolException('OVERSIZED_RESPONSE');
    }
    return _readExactly(kernel, handle, length, timeoutMs, getLastError);
  } finally {
    calloc.free(name);
    if (handle != -1) closeHandle(handle);
  }
}

void _writeAll(
  DynamicLibrary kernel,
  int handle,
  Uint8List bytes,
  int timeoutMs,
  _LastErrorDart lastError,
) {
  final buffer = calloc<Uint8>(bytes.length);
  buffer.asTypedList(bytes.length).setAll(0, bytes);
  try {
    var offset = 0;
    while (offset < bytes.length) {
      final transferred = _overlappedIo(
        kernel,
        true,
        handle,
        (buffer + offset).cast(),
        bytes.length - offset,
        timeoutMs,
        lastError,
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
  DynamicLibrary kernel,
  int handle,
  int length,
  int timeoutMs,
  _LastErrorDart lastError,
) {
  final buffer = calloc<Uint8>(length);
  try {
    var offset = 0;
    while (offset < length) {
      final transferred = _overlappedIo(
        kernel,
        false,
        handle,
        (buffer + offset).cast(),
        length - offset,
        timeoutMs,
        lastError,
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
  DynamicLibrary kernel,
  bool write,
  int handle,
  Pointer<Void> buffer,
  int length,
  int timeoutMs,
  _LastErrorDart lastError,
) {
  const waitObject0 = 0;
  const waitTimeout = 258;
  const waitFailed = 0xffffffff;
  const errorIoPending = 997;
  const errorOperationAborted = 995;
  final createEvent = kernel
      .lookupFunction<_CreateEventNative, _CreateEventDart>('CreateEventW');
  final wait = kernel.lookupFunction<_WaitNative, _WaitDart>(
    'WaitForSingleObject',
  );
  final cancel = kernel.lookupFunction<_CancelNative, _CancelDart>(
    'CancelIoEx',
  );
  final close = kernel.lookupFunction<_CloseNative, _CloseDart>('CloseHandle');
  final shim = DynamicLibrary.executable();
  late final _StartIoDart start;
  late final _FinishIoDart finish;
  try {
    start = shim.lookupFunction<_StartIoNative, _StartIoDart>(
      'idea_q15_start_overlapped_io',
    );
    finish = shim.lookupFunction<_FinishIoNative, _FinishIoDart>(
      'idea_q15_finish_overlapped_io',
    );
  } on Object catch (error) {
    throw WorkspaceProtocolException('NATIVE_SHIM_UNAVAILABLE', cause: error);
  }
  final overlapped = calloc<_Overlapped>();
  final transferred = calloc<Uint32>();
  final error = calloc<Uint32>();
  final event = createEvent(nullptr, 1, 0, nullptr.cast());
  if (event == 0) {
    calloc.free(overlapped);
    calloc.free(transferred);
    calloc.free(error);
    throw WindowsException('CreateEventW', lastError());
  }
  overlapped.ref.event = Pointer<Void>.fromAddress(event);
  final operationName = write ? 'WriteFile' : 'ReadFile';
  try {
    final immediate = start(
      handle,
      write ? 1 : 0,
      buffer,
      length,
      overlapped,
      error,
    );
    if (immediate == 0 && error.value != errorIoPending) {
      throw WindowsException(operationName, error.value);
    }
    if (immediate == 0) {
      final waitResult = wait(event, timeoutMs);
      if (waitResult == waitTimeout) {
        cancel(handle, overlapped);
        final cancelWait = wait(event, 1000);
        if (cancelWait == waitTimeout) {
          throw TimeoutException(
            '$operationName timed out after ${timeoutMs}ms.',
          );
        }
        if (cancelWait != waitObject0) {
          throw WindowsException(
            'WaitForSingleObject($operationName)',
            lastError(),
          );
        }
        if (finish(handle, overlapped, transferred, 0, error) == 0 &&
            error.value != errorOperationAborted) {
          throw WindowsException(
            'GetOverlappedResult($operationName)',
            error.value,
          );
        }
        throw TimeoutException(
          '$operationName timed out after ${timeoutMs}ms.',
        );
      }
      if (waitResult == waitFailed || waitResult != waitObject0) {
        throw WindowsException(
          'WaitForSingleObject($operationName)',
          lastError(),
        );
      }
    }
    if (finish(handle, overlapped, transferred, 0, error) == 0) {
      throw WindowsException(
        'GetOverlappedResult($operationName)',
        error.value,
      );
    }
    return transferred.value;
  } finally {
    close(event);
    calloc.free(overlapped);
    calloc.free(transferred);
    calloc.free(error);
  }
}

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
