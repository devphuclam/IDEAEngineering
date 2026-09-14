import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../i18n.dart';
import '../models.dart';
import '../qualification_smoke.dart';
import '../workspace/workspace_client.dart';
import '../workspace/workspace_client_base.dart';
import 'paged_grid.dart';
import 'paged_tree.dart';

class Q15Bootstrap extends StatefulWidget {
  const Q15Bootstrap({super.key, this.messages, this.api, this.workspace});
  final Q15Messages? messages;
  final Q15Api? api;
  final WorkspaceClient? workspace;
  @override
  State<Q15Bootstrap> createState() => _Q15BootstrapState();
}

class _Q15BootstrapState extends State<Q15Bootstrap> {
  Q15Messages? _messages;
  late final Q15Api _api = widget.api ?? Q15ApiClient();
  late final WorkspaceClient _workspace =
      widget.workspace ?? createWorkspaceClient();

  @override
  void initState() {
    super.initState();
    _messages = widget.messages;
    if (_messages == null) {
      Q15Messages.load().then((value) {
        if (mounted) setState(() => _messages = value);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final messages = _messages;
    if (messages == null) {
      return const MaterialApp(
        home: Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }
    return Q15App(messages: messages, api: _api, workspace: _workspace);
  }
}

class Q15App extends StatefulWidget {
  const Q15App({
    super.key,
    required this.messages,
    required this.api,
    required this.workspace,
  });
  final Q15Messages messages;
  final Q15Api api;
  final WorkspaceClient workspace;
  @override
  State<Q15App> createState() => _Q15AppState();
}

class _Q15AppState extends State<Q15App> {
  final _username = TextEditingController(text: 'engineer');
  final _password = TextEditingController();
  final _query = TextEditingController(text: 'pump');
  LocaleCode _locale = LocaleCode.en;
  FixtureProfile _profile = FixtureProfile.large;
  SessionView? _session;
  final _rows = <int, DocumentSummary>{};
  final _nodes = <int, TreeNodeModel>{};
  List<String> _columns = List.generate(
    20,
    (index) => 'field${(index + 1).toString().padLeft(2, '0')}',
  );
  int _total = 0;
  int _treeTotal = 0;
  int _selected = -1;
  DocumentDetail? _detail;
  OperationStatus? _operation;
  WorkspaceResult? _workspaceResult;
  String? _reservationId;
  String _scenario = 'success';
  String _notice = '';
  String _state = 'idle';
  final _loadingRows = <int>{};
  final _loadingNodes = <int>{};
  int _dataGeneration = 0;

  String get _pagingKey => '$_dataGeneration|${_profile.name}|${_query.text}';

  String t(String key) => widget.messages.text(_locale, key);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      unawaited(reportUiReadyIfRequested());
      unawaited(runAutomatedSmokeIfRequested(widget.api, widget.workspace));
    });
  }

  @override
  void dispose() {
    _username.dispose();
    _password.dispose();
    _query.dispose();
    widget.api.close();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() {
      _state = 'loading';
      _notice = '';
    });
    try {
      final session = await widget.api.login(_username.text, _password.text);
      setState(() {
        _session = session;
        _locale = session.locale;
        _state = 'idle';
      });
    } catch (error) {
      _problem(error);
    }
  }

  void _changeProfile(FixtureProfile value) {
    if (value == _profile) return;
    _dataGeneration++;
    setState(() {
      _profile = value;
      _rows.clear();
      _nodes.clear();
      _detail = null;
      _selected = -1;
      _total = 0;
      _treeTotal = 0;
      _loadingRows.clear();
      _loadingNodes.clear();
    });
  }

  Future<void> _search() async {
    final generation = ++_dataGeneration;
    setState(() {
      _state = 'loading';
      _notice = '';
      _rows.clear();
      _nodes.clear();
      _detail = null;
      _selected = -1;
      _loadingRows.clear();
      _loadingNodes.clear();
    });
    try {
      final values = await Future.wait([
        widget.api.search(_query.text, _profile, 0),
        widget.api.tree(_profile, 0),
      ]);
      final page = values[0] as SearchPage;
      final tree = values[1] as TreePage;
      if (!mounted || generation != _dataGeneration) return;
      setState(() {
        _rows.addEntries(
          page.items.asMap().entries.map(
            (entry) => MapEntry(page.offset + entry.key, entry.value),
          ),
        );
        _nodes.addEntries(
          tree.nodes.asMap().entries.map(
            (entry) => MapEntry(tree.offset + entry.key, entry.value),
          ),
        );
        _columns = page.columns;
        _total = page.total;
        _treeTotal = tree.total;
        _state = page.total == 0 ? 'empty' : 'ready';
      });
    } catch (error) {
      if (generation != _dataGeneration) return;
      _problem(error);
    }
  }

  Future<void> _loadRows(int offset) async {
    if (!_loadingRows.add(offset)) return;
    final generation = _dataGeneration;
    try {
      final page = await widget.api.search(_query.text, _profile, offset);
      if (mounted && generation == _dataGeneration) {
        setState(
          () => _rows.addEntries(
            page.items.asMap().entries.map(
              (entry) => MapEntry(page.offset + entry.key, entry.value),
            ),
          ),
        );
      }
    } catch (error) {
      if (generation == _dataGeneration) _problem(error);
    } finally {
      if (generation == _dataGeneration) _loadingRows.remove(offset);
    }
  }

  Future<void> _loadNodes(int offset) async {
    if (!_loadingNodes.add(offset)) return;
    final generation = _dataGeneration;
    try {
      final page = await widget.api.tree(_profile, offset);
      if (mounted && generation == _dataGeneration) {
        setState(
          () => _nodes.addEntries(
            page.nodes.asMap().entries.map(
              (entry) => MapEntry(page.offset + entry.key, entry.value),
            ),
          ),
        );
      }
    } catch (error) {
      if (generation == _dataGeneration) _problem(error);
    } finally {
      if (generation == _dataGeneration) _loadingNodes.remove(offset);
    }
  }

  Future<void> _open(int index) async {
    final row = _rows[index];
    if (row == null) {
      await _loadRows((index ~/ 200) * 200);
      return;
    }
    setState(() {
      _selected = index;
      _state = 'loading';
    });
    try {
      final detail = await widget.api.document(row.documentId);
      if (mounted) {
        setState(() {
          _detail = detail;
          _state = 'ready';
        });
      }
    } catch (error) {
      _problem(error);
    }
  }

  Future<void> _checkout() async {
    final detail = _detail;
    if (detail == null) return;
    try {
      final operation = await widget.api.checkout(detail, _scenario);
      setState(() {
        _operation = operation;
        _reservationId = operation.reservationId;
        _notice =
            operation.status == 'Committed' ? t('success') : t('uncertain');
      });
    } catch (error) {
      _problem(error);
    }
  }

  Future<void> _openWorkspace() async {
    final detail = _detail;
    if (detail == null) return;
    if (!widget.workspace.available) {
      setState(() => _notice = t('bridgeUnavailable'));
      return;
    }
    try {
      final result = await widget.workspace.send('OpenDocument', {
        'documentId': detail.documentId,
        'generationId': detail.generationId,
      });
      setState(() {
        _workspaceResult = result;
        _notice =
            '${result.code} · ${result.preservesLocalCandidate ? t('preserved') : ''}';
      });
    } catch (error) {
      _problem(error);
    }
  }

  Future<void> _checkin() async {
    final detail = _detail;
    final reservation = _reservationId;
    if (detail == null || reservation == null) return;
    final digest =
        _workspaceResult?.payload['digest'] as String? ??
        List.filled(64, '0').join();
    try {
      final operation = await widget.api.checkin(
        detail,
        reservation,
        digest,
        _scenario == 'uncertain'
            ? 'uncertain'
            : _scenario == 'failed'
            ? 'failed'
            : 'success',
      );
      setState(() {
        _operation = operation;
        _notice =
            operation.status == 'Committed' ? t('success') : t('uncertain');
      });
    } catch (error) {
      _problem(error, preserved: true);
    }
  }

  Future<void> _refreshOperation() async {
    final operation = _operation;
    if (operation == null) return;
    try {
      final value = await widget.api.operation(operation.operationId);
      setState(() {
        _operation = value;
        _notice = value.status == 'Committed' ? t('success') : t('uncertain');
      });
    } catch (error) {
      _problem(error);
    }
  }

  void _problem(Object error, {bool preserved = false}) {
    if (!mounted) return;
    setState(() {
      _state = 'error';
      _notice =
          '${error is ApiProblem ? '${error.code}: ${error.detail}' : error}${preserved ? ' · ${t('preserved')}' : ''}';
    });
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'IDEA Engineering Q-15',
    locale: Locale(_locale.name),
    theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff1d4ed8)),
      useMaterial3: true,
      fontFamily: 'Segoe UI',
      focusColor: const Color(0xfff59e0b),
      visualDensity: VisualDensity.compact,
    ),
    home: _session == null ? _loginPage() : _workspacePage(),
  );

  Widget _loginPage() {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xff0f2c59), Color(0xff2563eb)],
          ),
        ),
        alignment: Alignment.center,
        child: SizedBox(
          width: 430,
          child: Card(
            elevation: 16,
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: AutofillGroup(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'OPTION B · FLUTTER WEB / WINDOWS',
                      style: TextStyle(
                        color: Color(0xff2563eb),
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      t('appTitle'),
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    Text(t('signInHint')),
                    const SizedBox(height: 18),
                    TextField(
                      key: const Key('username'),
                      controller: _username,
                      autofillHints: const [AutofillHints.username],
                      decoration: InputDecoration(
                        labelText: t('username'),
                        border: const OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      key: const Key('password'),
                      controller: _password,
                      obscureText: true,
                      autofillHints: const [AutofillHints.password],
                      onSubmitted: (_) => _login(),
                      decoration: InputDecoration(
                        labelText: t('password'),
                        border: const OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 14),
                    FilledButton(
                      key: const Key('login'),
                      onPressed: _state == 'loading' ? null : _login,
                      child: Text(t('login')),
                    ),
                    const SizedBox(height: 10),
                    _localePicker(),
                    _liveNotice(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _workspacePage() => Scaffold(
    appBar: AppBar(
      backgroundColor: const Color(0xff102a52),
      foregroundColor: Colors.white,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'OPTION B · FLUTTER',
            style: TextStyle(fontSize: 10, letterSpacing: 1.2),
          ),
          Text(t('appTitle'), style: const TextStyle(fontSize: 18)),
        ],
      ),
      actions: [
        Center(child: Text(_session!.displayName)),
        const SizedBox(width: 12),
        SizedBox(width: 220, child: _localePicker(dark: true)),
        const SizedBox(width: 12),
      ],
    ),
    body: Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  key: const Key('search-query'),
                  controller: _query,
                  onSubmitted: (_) => _search(),
                  decoration: InputDecoration(
                    labelText: t('search'),
                    border: const OutlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              DropdownButton<FixtureProfile>(
                key: const Key('profile'),
                value: _profile,
                items:
                    FixtureProfile.values
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value.name),
                          ),
                        )
                        .toList(),
                onChanged: (value) => _changeProfile(value!),
              ),
              const SizedBox(width: 12),
              FilledButton(
                key: const Key('search'),
                onPressed: _search,
                child: Text(t('searchAction')),
              ),
            ],
          ),
        ),
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                width: 260,
                child: _panel(
                  t('tree'),
                  PagedProductTree(
                    total: _treeTotal,
                    nodes: _nodes,
                    onNeedNode: (offset) => unawaited(_loadNodes(offset)),
                    label: t('tree'),
                    pagingKey: _pagingKey,
                  ),
                ),
              ),
              Expanded(child: _panel(t('browser'), _browserBody())),
              SizedBox(width: 340, child: _panel(t('detail'), _detailBody())),
            ],
          ),
        ),
        Container(
          width: double.infinity,
          color: const Color(0xfffff7ed),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
          child: _liveNotice(),
        ),
      ],
    ),
  );

  Widget _panel(String heading, Widget child) => DecoratedBox(
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: const Color(0xffcbd5e1)),
    ),
    child: Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            heading.toUpperCase(),
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: Color(0xff475569),
              letterSpacing: .7,
            ),
          ),
          const SizedBox(height: 8),
          Expanded(child: child),
        ],
      ),
    ),
  );

  Widget _browserBody() {
    if (_state == 'loading') {
      return Center(
        child: Semantics(
          liveRegion: true,
          label: t('loading'),
          child: const CircularProgressIndicator(),
        ),
      );
    }
    if (_state == 'empty') return Center(child: Text(t('empty')));
    if (_total == 0) return Center(child: Text(t('search')));
    return Column(
      children: [
        Align(
          alignment: Alignment.centerLeft,
          child: Text(
            '$_total ${t('rows')} × ${_columns.length} ${t('columns')}',
          ),
        ),
        const SizedBox(height: 6),
        Expanded(
          child: PagedDocumentGrid(
            total: _total,
            columns: _columns,
            rows: _rows,
            selected: _selected,
            onNeedRow: (offset) => unawaited(_loadRows(offset)),
            onSelect: (index) => setState(() => _selected = index),
            onOpen: (index) => unawaited(_open(index)),
            label: t('grid'),
            editLabel: t('inlineEdit'),
            menuLabel: t('contextMenu'),
            pagingKey: _pagingKey,
          ),
        ),
      ],
    );
  }

  Widget _detailBody() {
    final detail = _detail;
    if (detail == null) return Text(t('selectDocument'));
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Chip(
              label: Text(
                '${detail.state}${detail.readOnly ? ' · ${t('readOnly')}' : ''}',
              ),
            ),
          ),
          Text(detail.title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          _fact('Stable ID', detail.documentId),
          _fact('Revision', detail.revision),
          _fact('Version', '${detail.version}'),
          _fact('Generation', detail.generationId),
          ...detail.metadata.entries.map(
            (entry) => _fact(entry.key, entry.value),
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<String>(
            key: const Key('scenario'),
            initialValue: _scenario,
            decoration: const InputDecoration(
              labelText: 'Scenario',
              border: OutlineInputBorder(),
            ),
            items:
                const [
                      'success',
                      'conflict',
                      'stale',
                      'unauthorized',
                      'uncertain',
                      'failed',
                    ]
                    .map(
                      (value) =>
                          DropdownMenuItem(value: value, child: Text(value)),
                    )
                    .toList(),
            onChanged: (value) => setState(() => _scenario = value!),
          ),
          const SizedBox(height: 10),
          FilledButton(
            key: const Key('checkout'),
            onPressed: detail.readOnly ? null : _checkout,
            child: Text(t('checkout')),
          ),
          OutlinedButton(
            key: const Key('open-workspace'),
            onPressed: _openWorkspace,
            child: Text(t('openWorkspace')),
          ),
          FilledButton.tonal(
            key: const Key('checkin'),
            onPressed: _reservationId == null ? null : _checkin,
            child: Text(t('startCheckin')),
          ),
          TextButton(
            key: const Key('operation-status'),
            onPressed: _operation == null ? null : _refreshOperation,
            child: Text(t('checkinStatus')),
          ),
          if (_operation != null)
            Semantics(
              liveRegion: true,
              child: Card(
                color: const Color(0xffeff6ff),
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _operation!.status,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      SelectableText(_operation!.operationId),
                      if (_operation!.preservedLocalCandidate)
                        Text(t('preserved')),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _fact(String label, String value) => Semantics(
    label: '$label: $value',
    child: ExcludeSemantics(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 3),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 92,
              child: Text(
                label,
                style: const TextStyle(color: Color(0xff64748b)),
              ),
            ),
            Expanded(child: SelectableText(value)),
          ],
        ),
      ),
    ),
  );

  Widget _localePicker({bool dark = false}) =>
      DropdownButtonFormField<LocaleCode>(
        key: const Key('locale'),
        initialValue: _locale,
        dropdownColor: dark ? const Color(0xff102a52) : null,
        style: TextStyle(color: dark ? Colors.white : null),
        decoration: InputDecoration(
          labelText: t('locale'),
          isDense: true,
          labelStyle: TextStyle(color: dark ? Colors.white70 : null),
          border: const OutlineInputBorder(),
        ),
        items: const [
          DropdownMenuItem(value: LocaleCode.en, child: Text('English')),
          DropdownMenuItem(value: LocaleCode.vi, child: Text('Tiếng Việt')),
          DropdownMenuItem(value: LocaleCode.ja, child: Text('日本語')),
        ],
        onChanged: (value) => setState(() => _locale = value!),
      );

  Widget _liveNotice() => Semantics(
    key: ValueKey(_notice),
    liveRegion: true,
    label: _notice,
    child: ExcludeSemantics(child: Text(_notice, key: const Key('notice'))),
  );
}
