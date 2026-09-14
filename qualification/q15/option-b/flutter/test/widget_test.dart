import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:idea_q15_option_b/api/api_client.dart';
import 'package:idea_q15_option_b/i18n.dart';
import 'package:idea_q15_option_b/models.dart';
import 'package:idea_q15_option_b/ui/paged_grid.dart';
import 'package:idea_q15_option_b/ui/q15_app.dart';
import 'package:idea_q15_option_b/workspace/workspace_client_base.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('shared critical flow reaches committed check-in', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1600, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final api = FakeApi();
    await tester.pumpWidget(
      Q15Bootstrap(
        messages: messages,
        api: api,
        workspace: const FakeWorkspace(),
      ),
    );

    await tester.enterText(
      find.byKey(const Key('password')),
      'q15-engineer-only',
    );
    await tester.tap(find.byKey(const Key('login')));
    await tester.pumpAndSettle();
    expect(find.text('Tìm tài liệu được kiểm soát'), findsWidgets);

    await tester.tap(find.byKey(const Key('search')));
    await tester.pumpAndSettle();
    expect(find.textContaining('100000 dòng × 20 cột'), findsOneWidget);
    expect(find.text('Pump assembly 000001 — Cụm bơm'), findsOneWidget);

    final firstRow = find.text('Pump assembly 000001 — Cụm bơm');
    await tester.tap(firstRow);
    await tester.pump(const Duration(milliseconds: 80));
    await tester.tap(firstRow);
    await tester.pumpAndSettle();
    expect(find.text('GEN-Q15-000001-V001'), findsOneWidget);

    await tester.tap(find.byKey(const Key('checkout')));
    await tester.pumpAndSettle();
    expect(api.checkoutCalls, 1);
    await tester.tap(find.byKey(const Key('open-workspace')));
    await tester.pumpAndSettle();
    expect(find.textContaining('WORKSPACE_OPENED'), findsOneWidget);
    await tester.tap(find.byKey(const Key('checkin')));
    await tester.pumpAndSettle();
    expect(api.checkinCalls, 1);
    expect(find.text('Committed'), findsOneWidget);
  });

  testWidgets('runtime locale switches to Japanese', (tester) async {
    tester.view.physicalSize = const Size(1000, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      Q15Bootstrap(
        messages: messages,
        api: FakeApi(),
        workspace: const FakeWorkspace(),
      ),
    );
    await tester.tap(find.byKey(const Key('locale')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('日本語').last);
    await tester.pumpAndSettle();
    expect(find.text('サインイン'), findsOneWidget);
    expect(find.text('ユーザー名'), findsOneWidget);
  });

  testWidgets(
    '100k grid remains lazy and supports keyboard edit with IME text',
    (tester) async {
      tester.view.physicalSize = const Size(1200, 700);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      var selected = -1;
      var opened = -1;
      final row = fixtureRow(0);
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SizedBox(
              height: 500,
              child: PagedDocumentGrid(
                total: 100000,
                columns: List.generate(20, (index) => 'field${index + 1}'),
                rows: {0: row},
                selected: selected,
                onNeedRow: (_) {},
                onSelect: (value) => selected = value,
                onOpen: (value) => opened = value,
                label: 'Controlled document results',
                editLabel: 'Edit title',
                menuLabel: 'Document actions',
              ),
            ),
          ),
        ),
      );
      expect(find.byType(Text), findsWidgets);
      expect(find.byType(Text).evaluate().length, lessThan(100));
      await tester.tap(find.text(row.title));
      await tester.pump(const Duration(milliseconds: 400));
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      expect(selected, 1);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowUp);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      expect(opened, 0);
      await tester.sendKeyEvent(LogicalKeyboardKey.f2);
      await tester.pump();
      expect(find.byKey(const Key('inline-editor')), findsOneWidget);
      await tester.enterText(
        find.byKey(const Key('inline-editor')),
        '設計変更・Cụm bơm',
      );
      expect(find.text('設計変更・Cụm bơm'), findsOneWidget);
    },
  );
}

final messages = Q15Messages.fromCatalog({
  'en': {
    'appTitle': 'IDEA Engineering Q-15',
    'login': 'Sign in',
    'username': 'Username',
    'password': 'Password',
    'search': 'Search controlled documents',
    'searchAction': 'Search',
    'browser': 'Document browser',
    'detail': 'Document detail',
    'checkout': 'Checkout',
    'openWorkspace': 'Open in Workspace',
    'checkinStatus': 'Check-in status',
    'startCheckin': 'Start check-in',
    'loading': 'Loading',
    'empty': 'No permitted documents found',
    'error': 'Error',
    'success': 'Committed by server',
    'uncertain': 'Checking operation',
    'preserved': 'Local candidate is preserved',
    'locale': 'Language',
    'tree': 'Product hierarchy',
    'grid': 'Controlled document results',
    'readOnly': 'Read-only',
    'inlineEdit': 'Edit title',
    'contextMenu': 'Document actions',
    'rows': 'rows',
    'columns': 'columns',
    'selectDocument': 'Select a document',
    'bridgeUnavailable': 'Unavailable',
    'signInHint': 'Synthetic qualification account',
  },
  'vi': {
    'appTitle': 'IDEA Engineering Q-15',
    'login': 'Đăng nhập',
    'username': 'Tên đăng nhập',
    'password': 'Mật khẩu',
    'search': 'Tìm tài liệu được kiểm soát',
    'searchAction': 'Tìm kiếm',
    'browser': 'Trình duyệt tài liệu',
    'detail': 'Chi tiết tài liệu',
    'checkout': 'Lấy ra để sửa',
    'openWorkspace': 'Mở trong Workspace',
    'checkinStatus': 'Trạng thái ghi nhận',
    'startCheckin': 'Bắt đầu ghi nhận',
    'loading': 'Đang tải',
    'empty': 'Không có dữ liệu',
    'error': 'Lỗi',
    'success': 'Server đã ghi nhận',
    'uncertain': 'Đang kiểm tra',
    'preserved': 'Bản ứng viên trên máy vẫn được giữ an toàn',
    'locale': 'Ngôn ngữ',
    'tree': 'Cấu trúc sản phẩm',
    'grid': 'Kết quả tài liệu được kiểm soát',
    'readOnly': 'Chỉ đọc',
    'inlineEdit': 'Sửa tiêu đề',
    'contextMenu': 'Thao tác tài liệu',
    'rows': 'dòng',
    'columns': 'cột',
    'selectDocument': 'Chọn một tài liệu để xem',
    'bridgeUnavailable': 'Không có bridge',
    'signInHint': 'Tài khoản qualification tổng hợp',
  },
  'ja': {
    'appTitle': 'IDEA Engineering Q-15',
    'login': 'サインイン',
    'username': 'ユーザー名',
    'password': 'パスワード',
    'search': '管理対象ドキュメントを検索',
    'searchAction': '検索',
    'browser': 'ドキュメントブラウザー',
    'detail': 'ドキュメント詳細',
    'checkout': 'チェックアウト',
    'openWorkspace': 'Workspace で開く',
    'checkinStatus': 'チェックイン状態',
    'startCheckin': 'チェックイン開始',
    'loading': '読み込み中',
    'empty': 'データなし',
    'error': 'エラー',
    'success': 'コミット済み',
    'uncertain': '確認中',
    'preserved': '保持済み',
    'locale': '言語',
    'tree': '製品階層',
    'grid': '管理対象ドキュメントの結果',
    'readOnly': '読み取り専用',
    'inlineEdit': 'タイトルを編集',
    'contextMenu': 'ドキュメント操作',
    'rows': '行',
    'columns': '列',
    'selectDocument': '選択してください',
    'bridgeUnavailable': '利用できません',
    'signInHint': '合成資格試験アカウント',
  },
});

DocumentSummary fixtureRow(int index) => DocumentSummary(
  documentId: 'DOC-Q15-${(index + 1).toString().padLeft(6, '0')}',
  title: 'Pump assembly ${(index + 1).toString().padLeft(6, '0')} — Cụm bơm',
  revision: 'A',
  version: 1,
  generationId: 'GEN-Q15-${(index + 1).toString().padLeft(6, '0')}-V001',
  state: 'In Work',
  values: List.generate(20, (column) => 'R${index + 1}-C${column + 1}'),
);

class FakeApi implements Q15Api {
  int checkoutCalls = 0;
  int checkinCalls = 0;
  @override
  Future<SessionView> login(String username, String password) async =>
      SessionView(
        'Linh Nguyễn',
        LocaleCode.vi,
        DateTime.now().add(const Duration(minutes: 30)),
      );
  @override
  Future<SearchPage> search(
    String query,
    FixtureProfile profile,
    int offset, [
    int limit = 200,
  ]) async => SearchPage(
    100000,
    offset,
    limit,
    List.generate(
      20,
      (index) => 'field${(index + 1).toString().padLeft(2, '0')}',
    ),
    [fixtureRow(offset)],
  );
  @override
  Future<TreePage> tree(
    FixtureProfile profile,
    int offset, [
    int limit = 500,
  ]) async => TreePage(10000, 12, offset, limit, [
    TreeNodeModel('NODE-Q15-000000', null, 'Assembly 000000 — 組立品', 0, true),
  ]);
  @override
  Future<DocumentDetail> document(String id) async {
    final row = fixtureRow(0);
    return DocumentDetail(
      documentId: row.documentId,
      title: row.title,
      revision: row.revision,
      version: row.version,
      generationId: row.generationId,
      state: row.state,
      values: row.values,
      documentClass: 'CAD Product Definition',
      metadata: const {'owner': 'Linh Nguyễn'},
      allowedActions: const ['Checkout'],
      readOnly: false,
    );
  }

  @override
  Future<OperationStatus> checkout(
    DocumentDetail detail,
    String scenario,
  ) async {
    checkoutCalls++;
    return const OperationStatus(
      operationId: '11111111-1111-4111-8111-111111111111',
      kind: 'Checkout',
      status: 'Committed',
      documentId: 'DOC-Q15-000001',
      expectedGenerationId: 'GEN-Q15-000001-V001',
      reservationId: 'RES-Q15-1',
      preservedLocalCandidate: true,
    );
  }

  @override
  Future<OperationStatus> checkin(
    DocumentDetail detail,
    String reservationId,
    String digest,
    String scenario,
  ) async {
    checkinCalls++;
    return const OperationStatus(
      operationId: '22222222-2222-4222-8222-222222222222',
      kind: 'Checkin',
      status: 'Committed',
      documentId: 'DOC-Q15-000001',
      expectedGenerationId: 'GEN-Q15-000001-V001',
      reservationId: 'RES-Q15-1',
      preservedLocalCandidate: true,
    );
  }

  @override
  Future<OperationStatus> operation(String id) =>
      checkout(documentValue, 'success');
  @override
  void close() {}
  DocumentDetail get documentValue => DocumentDetail(
    documentId: fixtureRow(0).documentId,
    title: fixtureRow(0).title,
    revision: 'A',
    version: 1,
    generationId: fixtureRow(0).generationId,
    state: 'In Work',
    values: fixtureRow(0).values,
    documentClass: 'CAD',
    metadata: const {},
    allowedActions: const [],
    readOnly: false,
  );
}

class FakeWorkspace implements WorkspaceClient {
  const FakeWorkspace();
  @override
  bool get available => true;
  @override
  Future<WorkspaceResult> send(
    String operation,
    Map<String, String> payload, {
    Duration timeout = const Duration(seconds: 8),
  }) async => const WorkspaceResult(
    requestId: '33333333-3333-4333-8333-333333333333',
    status: 'Accepted',
    code: 'WORKSPACE_OPENED',
    payload: {
      'digest':
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    preservesLocalCandidate: true,
  );
}
