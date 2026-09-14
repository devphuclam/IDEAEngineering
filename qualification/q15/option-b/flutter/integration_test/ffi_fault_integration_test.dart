import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:idea_q15_option_b/workspace/workspace_client_windows.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('direct FFI classifies the controlled failure path', (_) async {
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
  });
}
