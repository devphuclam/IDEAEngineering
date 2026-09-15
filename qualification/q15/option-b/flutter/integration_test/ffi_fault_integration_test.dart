import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:idea_q15_option_b/workspace/workspace_client_windows.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('direct FFI classifies the controlled failure path', (_) async {
    if (Platform.environment['IDEA_Q15_FAULT_CASE'] == 'repeated-cycles') {
      await _repeatedCycles();
      return;
    }
    final encodedSecret =
        Platform.environment['IDEA_Q15_WORKSPACE_SECRET'] ?? '';
    final client = DirectFfiWorkspaceClient.forTesting(
      pipeName:
          Platform.environment['IDEA_Q15_PIPE_NAME'] ?? 'idea-q15-fault-v1',
      workspaceId:
          Platform.environment['IDEA_Q15_WORKSPACE_ID'] ?? 'WS-Q15-001',
      sessionId:
          Platform.environment['IDEA_Q15_WORKSPACE_SESSION'] ??
          'SESSION-Q15-001',
      encodedSecret: encodedSecret,
    );
    final faultCase =
        Platform.environment['IDEA_Q15_FAULT_CASE'] ?? 'pipe-unavailable';
    final expected = Platform.environment['IDEA_Q15_FAULT_EXPECTED'] ?? '';
    try {
      final result = await client.send(
        'GetWorkspaceStatus',
        const {},
        timeout: const Duration(milliseconds: 900),
      );
      if (expected == 'SIGNED_REFUSAL') {
        expect(result.status, 'Refused', reason: faultCase);
        return;
      }
      fail(
        'fault case $faultCase unexpectedly returned ${result.status}/${result.code}',
      );
    } on WorkspaceProtocolException catch (error) {
      expect(error.code, expected, reason: faultCase);
    } on WindowsException catch (error) {
      expect(error.classification, expected, reason: '$faultCase: $error');
    } on TimeoutException {
      expect(expected, 'TIMEOUT', reason: faultCase);
    }
  }, timeout: const Timeout(Duration(minutes: 20)));
}

Map<String, int> _delta(Map<String, int> before, Map<String, int> after) => {
  for (final key in before.keys) key: after[key]! - before[key]!,
};

Future<Map<String, dynamic>> _resources() async {
  // Qualification harness only: sample this Flutter process through PowerShell.
  // No process/filesystem authority is added to the native transport ABI.
  final targetPid = pid;
  try {
    final snapshot = await Process.run('powershell.exe', [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      '\$p = Get-Process -Id $targetPid -ErrorAction Stop; '
          '\$p.Refresh(); '
          '@{ handles = \$p.HandleCount; privateBytes = \$p.PrivateMemorySize64; '
          'workingSet = \$p.WorkingSet64; threads = \$p.Threads.Count } '
          '| ConvertTo-Json -Compress',
    ]);
    if (snapshot.exitCode != 0) {
      return {
        'status': 'BLOCKED',
        'pid': targetPid,
        'reason': 'PowerShell process snapshot failed',
      };
    }
    return {
      'status': 'PASS',
      'pid': targetPid,
      'counters': (jsonDecode(snapshot.stdout as String) as Map)
          .cast<String, int>(),
    };
  } on Object catch (error) {
    return {'status': 'BLOCKED', 'pid': targetPid, 'reason': '$error'};
  }
}

Future<Map<String, int>> _settleNativeCleanup() async {
  final deadline = DateTime.now().add(const Duration(seconds: 3));
  var snapshot = readNativeIoDiagnostics().toJson();
  while ((snapshot['activeOperations'] != 0 ||
          snapshot['detachedCleanupStarted'] != snapshot['detachedCleanupCompleted']) &&
      DateTime.now().isBefore(deadline)) {
    await Future<void>.delayed(const Duration(milliseconds: 10));
    snapshot = readNativeIoDiagnostics().toJson();
  }
  return snapshot;
}

Future<Map<String, dynamic>> _sendOutcome(
  DirectFfiWorkspaceClient client,
  Duration timeout,
) async {
  try {
    final result = await client.send('GetWorkspaceStatus', const {}, timeout: timeout);
    return {'classification': 'SUCCESS', 'status': result.status, 'code': result.code};
  } on WorkspaceProtocolException catch (error) {
    return {'classification': error.code};
  } on WindowsException catch (error) {
    return {'classification': error.classification, 'win32Error': error.code};
  } on TimeoutException {
    return {'classification': 'TIMEOUT'};
  } on Object catch (error) {
    return {'classification': 'UNEXPECTED_ERROR', 'error': '$error'};
  }
}

Future<Map<String, dynamic>> _withFaultServer(
  String mode,
  String pipeName,
  File serverLog,
  Future<Map<String, dynamic>> Function() run,
) async {
  final assembly = Platform.environment['IDEA_Q15_FAULT_SERVER_DLL']!;
  final process = await Process.start('dotnet', [assembly], environment: {
    'IDEA_Q15_PIPE_NAME': pipeName,
    'IDEA_Q15_FAULT_MODE': mode,
    'IDEA_Q15_FAULT_READY_FILE': '',
  });
  final ready = Completer<void>();
  final output = serverLog.openWrite(mode: FileMode.append);
  final stdoutDone = process.stdout.transform(utf8.decoder).transform(const LineSplitter())
      .listen((line) {
        output.writeln(line);
        if (line.contains('Q15_FAULT_SERVER_READY') && !ready.isCompleted) ready.complete();
      }).asFuture<void>();
  final stderrDone = process.stderr.transform(utf8.decoder).listen(output.write).asFuture<void>();
  try {
    await ready.future.timeout(const Duration(seconds: 10));
    return await run();
  } finally {
    process.kill();
    await process.exitCode.timeout(const Duration(seconds: 10));
    await Future.wait([stdoutDone, stderrDone]);
    await output.close();
  }
}

Future<void> _repeatedCycles() async {
  final count = int.parse(Platform.environment['IDEA_Q15_FAULT_CYCLES'] ?? '100');
  expect(count, greaterThanOrEqualTo(100));
  final directory = Directory(Platform.environment['IDEA_Q15_FAULT_OUTPUT']!);
  final records = File('${directory.path}/repeated-cycles.jsonl');
  final basePipe = Platform.environment['IDEA_Q15_PIPE_NAME']!;
  final runBefore = await _resources();
  for (var cycle = 1; cycle <= count; cycle++) {
    final pipeName = '$basePipe-cycle-$cycle';
    final client = DirectFfiWorkspaceClient.forTesting(
      pipeName: pipeName,
      workspaceId: Platform.environment['IDEA_Q15_WORKSPACE_ID']!,
      sessionId: Platform.environment['IDEA_Q15_WORKSPACE_SESSION']!,
      encodedSecret: Platform.environment['IDEA_Q15_WORKSPACE_SECRET']!,
    );
    final before = await _settleNativeCleanup();
    final resourcesBefore = await _resources();
    final outcomes = <String, dynamic>{};
    var status = 'FAIL';
    try {
      outcomes['timeout'] = await _withFaultServer(
        'timeout', pipeName, File('${directory.path}/cycle-$cycle-timeout-server.log'),
        () => _sendOutcome(client, const Duration(milliseconds: 80)),
      );
      final afterTimeout = await _settleNativeCleanup();
      outcomes['timeoutNativeDelta'] = _delta(before, afterTimeout);
      // A signed response races the short caller deadline; both real outcomes
      // remain in evidence. Neither branch is manufactured or required to occur.
      outcomes['race'] = await _withFaultServer(
        'normal', pipeName, File('${directory.path}/cycle-$cycle-race-server.log'),
        () => _sendOutcome(client, const Duration(milliseconds: 1)),
      );
      final afterRace = await _settleNativeCleanup();
      outcomes['raceNativeDelta'] = _delta(afterTimeout, afterRace);
      outcomes['reconnect'] = await _withFaultServer(
        'normal', pipeName, File('${directory.path}/cycle-$cycle-reconnect-server.log'),
        () => _sendOutcome(client, const Duration(milliseconds: 900)),
      );
      expect(outcomes['timeout']['classification'], 'TIMEOUT');
      expect(outcomes['timeoutNativeDelta']['pendingRead'], greaterThan(0));
      expect(outcomes['race']['classification'], isIn(['SUCCESS', 'TIMEOUT']));
      for (final phase in ['race', 'reconnect']) {
        if (outcomes[phase]['classification'] == 'SUCCESS') {
          expect(outcomes[phase]['status'], 'Accepted');
          expect(outcomes[phase]['code'], 'WORKSPACE_READY');
        }
      }
      expect(outcomes['reconnect']['classification'], 'SUCCESS');
      status = 'PASS';
    } finally {
      final after = await _settleNativeCleanup();
      final resourcesAfter = await _resources();
      final cleanupSettled = after['activeOperations'] == 0 &&
          after['detachedCleanupStarted'] == after['detachedCleanupCompleted'];
      final record = {
        'cycle': cycle,
        'pid': pid,
        'result': cleanupSettled ? status : 'QUALIFICATION-UNKNOWN',
        'outcomes': outcomes,
        'nativeBefore': before,
        'nativeAfter': after,
        'nativeDelta': _delta(before, after),
        'cleanupSettled': cleanupSettled,
        'resourcesBefore': resourcesBefore,
        'resourcesAfter': resourcesAfter,
        'resourceDelta': resourcesBefore['status'] == 'PASS' && resourcesAfter['status'] == 'PASS'
            ? _delta(resourcesBefore['counters'] as Map<String, int>,
                resourcesAfter['counters'] as Map<String, int>)
            : null,
        'resourceInterpretation': 'Diagnostic observation; not proof of no leak.',
      };
      await records.writeAsString('${jsonEncode(record)}\n', mode: FileMode.append, flush: true);
      // ignore: avoid_print
      print('Q15_FFI_CYCLE ${jsonEncode(record)}');
      expect(cleanupSettled, isTrue, reason: 'Native cleanup exceeded observation budget');
    }
  }
  await File('${directory.path}/repeated-process-resources.json').writeAsString(jsonEncode({
    'before': runBefore,
    'after': await _resources(),
    'interpretation': 'Same Flutter process; includes Dart VM/isolate overhead; not proof of no leak.',
  }), flush: true);
}
