import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:idea_q15_option_b/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  String noticeText(WidgetTester tester) =>
      tester.widget<Text>(find.byKey(const Key('notice'))).data ?? '';

  testWidgets('critical surface uses the frozen large fixture', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('username')), 'engineer');
    await tester.enterText(
      find.byKey(const Key('password')),
      'q15-engineer-only',
    );
    await tester.tap(find.byKey(const Key('login')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('search-query')), findsOneWidget);

    await tester.tap(find.byKey(const Key('search')));
    await tester.pumpAndSettle();
    expect(find.textContaining('100000 dòng × 20 cột'), findsOneWidget);
    final firstRow = find.text('Pump assembly 000001 — Cụm bơm').first;
    expect(firstRow, findsOneWidget);
    await tester.tap(firstRow);
    await tester.pump(const Duration(milliseconds: 80));
    await tester.tap(firstRow);
    await tester.pumpAndSettle();
    expect(find.text('GEN-Q15-000001-V001'), findsOneWidget);

    await tester.tap(find.byKey(const Key('checkout')));
    await tester.pumpAndSettle();
    expect(find.text('Committed'), findsOneWidget);
    await tester.ensureVisible(find.byKey(const Key('open-workspace')));
    await tester.tap(find.byKey(const Key('open-workspace')));
    await tester.pumpAndSettle();
    if (kIsWeb) {
      expect(
        find.textContaining('Bridge Workspace native không có'),
        findsOneWidget,
      );
    } else {
      expect(noticeText(tester), contains('DOCUMENT_MATERIALIZED'));
      await tester.ensureVisible(find.byKey(const Key('checkin')));
      await tester.tap(find.byKey(const Key('checkin')));
      await tester.pumpAndSettle();
      expect(find.text('Committed'), findsOneWidget);
    }

    await tester.tap(find.byKey(const Key('locale')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('日本語').last);
    await tester.pumpAndSettle();
    expect(find.text('管理対象ドキュメントを検索'), findsWidgets);

    await tester.tap(firstRow);
    await tester.pump(const Duration(milliseconds: 400));
    await tester.sendKeyEvent(LogicalKeyboardKey.f2);
    await tester.pumpAndSettle();
    if (find.byKey(const Key('inline-editor')).evaluate().isNotEmpty) {
      await tester.enterText(
        find.byKey(const Key('inline-editor')),
        '設計変更・Cụm bơm',
      );
      expect(find.text('設計変更・Cụm bơm'), findsOneWidget);
    }
  });
}
