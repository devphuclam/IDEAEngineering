import 'dart:convert';
import 'dart:io';

import 'api/api_client.dart';
import 'models.dart';
import 'workspace/workspace_client_base.dart';

Future<void> runAutomatedSmokeIfRequested(
  Q15Api api,
  WorkspaceClient workspace,
) async {
  final reportPath = Platform.environment['IDEA_Q15_AUTOMATED_SMOKE_REPORT'];
  if (!Platform.isWindows || reportPath == null || reportPath.isEmpty) return;
  final clock = Stopwatch()..start();
  final report = <String, dynamic>{
    'candidate': 'option-b',
    'surface': 'Flutter Windows',
    'directDartFfi': true,
    'cppShimOrPlugin': true,
    'nativeShim': 'q15_io_shim (runner export; direct Dart FFI remains the caller ABI)',
    'startedAtUtc': DateTime.now().toUtc().toIso8601String(),
  };
  try {
    final kind = Platform.environment['IDEA_Q15_SMOKE_KIND'] ?? 'full-flow';
    report['kind'] = kind;
    if (kind == 'startup') {
      final workspaceResult = await workspace.send(
        'GetWorkspaceStatus',
        const {},
      );
      clock.stop();
      report.addAll({
        'result': workspaceResult.status == 'Accepted' ? 'PASS' : 'FAIL',
        'workspaceStatus': workspaceResult.status,
        'workspaceCode': workspaceResult.code,
        'preservesLocalCandidate': workspaceResult.preservesLocalCandidate,
        'startupToWorkspaceRoundTripMs': clock.elapsedMicroseconds / 1000,
      });
      await File(
        reportPath,
      ).writeAsString(const JsonEncoder.withIndent('  ').convert(report));
      api.close();
      exit(workspaceResult.status == 'Accepted' ? 0 : 2);
    }
    final session = await api.login('engineer', 'q15-engineer-only');
    final page = await api.search('pump', FixtureProfile.large, 0);
    if (page.total != 100000 ||
        page.columns.length != 20 ||
        page.items.isEmpty) {
      throw StateError('LARGE_FIXTURE_MISMATCH');
    }
    final detail = await api.document(page.items.first.documentId);
    final checkout = await api.checkout(detail, 'success');
    if (checkout.status != 'Committed' || checkout.reservationId == null) {
      throw StateError('CHECKOUT_NOT_COMMITTED');
    }
    final workspaceResult = await workspace.send('OpenDocument', {
      'documentId': detail.documentId,
      'generationId': detail.generationId,
    });
    final digest = workspaceResult.payload['digest'] as String?;
    if (workspaceResult.status != 'Accepted' || digest == null) {
      throw StateError('WORKSPACE_OPEN_NOT_ACCEPTED');
    }
    final checkin = await api.checkin(
      detail,
      checkout.reservationId!,
      digest,
      'success',
    );
    if (checkin.status != 'Committed') {
      throw StateError('CHECKIN_NOT_COMMITTED');
    }
    clock.stop();
    report.addAll({
      'result': 'PASS',
      'actorDisplayName': session.displayName,
      'rows': page.total,
      'columns': page.columns.length,
      'documentId': detail.documentId,
      'checkoutStatus': checkout.status,
      'workspaceStatus': workspaceResult.status,
      'workspaceCode': workspaceResult.code,
      'checkinStatus': checkin.status,
      'preservesLocalCandidate': checkin.preservedLocalCandidate,
      'elapsedMs': clock.elapsedMicroseconds / 1000,
    });
    await File(
      reportPath,
    ).writeAsString(const JsonEncoder.withIndent('  ').convert(report));
    api.close();
    exit(0);
  } catch (error, stack) {
    clock.stop();
    report.addAll({
      'result': 'FAIL',
      'error': '$error',
      'stack': '$stack',
      'elapsedMs': clock.elapsedMicroseconds / 1000,
    });
    await File(
      reportPath,
    ).writeAsString(const JsonEncoder.withIndent('  ').convert(report));
    api.close();
    exit(2);
  }
}

Future<void> reportUiReadyIfRequested() async {
  final reportPath = Platform.environment['IDEA_Q15_UI_READY_REPORT'];
  if (!Platform.isWindows || reportPath == null || reportPath.isEmpty) return;
  final report = <String, dynamic>{
    'candidate': 'option-b',
    'surface': 'Flutter Windows',
    'q15UiReady': true,
    'loginVisible': true,
    'loginEnabled': true,
    'bridgeAvailabilityKnown':
        Platform.environment['IDEA_Q15_WORKSPACE_SECRET']?.isNotEmpty == true,
    'readyAtUtc': DateTime.now().toUtc().toIso8601String(),
  };
  await File(
    reportPath,
  ).writeAsString(const JsonEncoder.withIndent('  ').convert(report));
  if (Platform.environment['IDEA_Q15_UI_READY_EXIT'] == '1') exit(0);
}
