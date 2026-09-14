import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models.dart';

class PagedDocumentGrid extends StatefulWidget {
  const PagedDocumentGrid({
    super.key,
    required this.total,
    required this.columns,
    required this.rows,
    required this.selected,
    required this.onNeedRow,
    required this.onSelect,
    required this.onOpen,
    required this.label,
    required this.editLabel,
    required this.menuLabel,
  });
  final int total;
  final List<String> columns;
  final Map<int, DocumentSummary> rows;
  final int selected;
  final ValueChanged<int> onNeedRow;
  final ValueChanged<int> onSelect;
  final ValueChanged<int> onOpen;
  final String label;
  final String editLabel;
  final String menuLabel;

  @override
  State<PagedDocumentGrid> createState() => _PagedDocumentGridState();
}

class _PagedDocumentGridState extends State<PagedDocumentGrid> {
  final _focus = FocusNode(debugLabel: 'Q15 document grid');
  final _requested = <int>{};
  final _multiSelected = <int>{};
  int? _editing;
  int _cursor = -1;

  @override
  void initState() {
    super.initState();
    _cursor = widget.selected;
  }

  @override
  void didUpdateWidget(covariant PagedDocumentGrid oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selected != oldWidget.selected) _cursor = widget.selected;
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  void _need(int index) {
    final page = (index ~/ 200) * 200;
    if (_requested.add(page)) scheduleMicrotask(() => widget.onNeedRow(page));
  }

  void _move(int delta) {
    final next = (_cursor < 0 ? 0 : _cursor + delta).clamp(0, widget.total - 1);
    setState(() => _cursor = next);
    widget.onSelect(next);
    _need(next);
  }

  @override
  Widget build(BuildContext context) {
    final width = (widget.columns.length * 148).toDouble();
    return Semantics(
      label: widget.label,
      container: true,
      child: Focus(
        focusNode: _focus,
        autofocus: true,
        onKeyEvent: (_, event) {
          if (event is! KeyDownEvent || widget.total == 0) {
            return KeyEventResult.ignored;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
            _move(1);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
            _move(-1);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.enter && _cursor >= 0) {
            widget.onOpen(_cursor);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.space && _cursor >= 0) {
            setState(
              () => _multiSelected.contains(_cursor)
                  ? _multiSelected.remove(_cursor)
                  : _multiSelected.add(_cursor),
            );
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.f2 && _cursor >= 0) {
            setState(() => _editing = _cursor);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.f10 &&
              HardwareKeyboard.instance.isShiftPressed &&
              _cursor >= 0) {
            _showMenu(context, const Offset(360, 220));
            return KeyEventResult.handled;
          }
          return KeyEventResult.ignored;
        },
        child: DecoratedBox(
          decoration: BoxDecoration(
            border: Border.all(color: const Color(0xffcbd5e1)),
          ),
          child: Column(
            children: [
              SizedBox(
                height: 36,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: SizedBox(
                    width: width,
                    child: Row(
                      children: widget.columns
                          .map((column) => _cell(column, header: true))
                          .toList(),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: SizedBox(
                    width: width,
                    child: ListView.builder(
                      itemExtent: 38,
                      itemCount: widget.total,
                      itemBuilder: (context, index) {
                        final row = widget.rows[index];
                        if (row == null) {
                          _need(index);
                          return const _SkeletonRow();
                        }
                        final active = _cursor == index;
                        return Semantics(
                          excludeSemantics: true,
                          selected: active || _multiSelected.contains(index),
                          button: true,
                          label:
                              '${row.documentId}, ${row.title}, ${row.state}',
                          onTap: () {
                            setState(() => _cursor = index);
                            widget.onSelect(index);
                            widget.onOpen(index);
                          },
                          child: GestureDetector(
                            onTap: () {
                              _focus.requestFocus();
                              setState(() => _cursor = index);
                              widget.onSelect(index);
                            },
                            onDoubleTap: () => widget.onOpen(index),
                            onSecondaryTapDown: (details) {
                              setState(() => _cursor = index);
                              widget.onSelect(index);
                              _showMenu(context, details.globalPosition);
                            },
                            child: ColoredBox(
                              color: active
                                  ? const Color(0xffdbeafe)
                                  : _multiSelected.contains(index)
                                  ? const Color(0xffeff6ff)
                                  : Colors.transparent,
                              child: Row(
                                children: [
                                  _cell(
                                    _editing == index ? '' : row.title,
                                    child: _editing == index
                                        ? TextField(
                                            key: const Key('inline-editor'),
                                            autofocus: true,
                                            controller: TextEditingController(
                                              text: row.title,
                                            ),
                                            decoration: InputDecoration(
                                              isDense: true,
                                              labelText: widget.editLabel,
                                            ),
                                            onSubmitted: (_) =>
                                                setState(() => _editing = null),
                                          )
                                        : null,
                                  ),
                                  ...row.values.skip(1).map(_cell),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _cell(String value, {bool header = false, Widget? child}) => Container(
    width: 148,
    height: 38,
    alignment: Alignment.centerLeft,
    padding: const EdgeInsets.symmetric(horizontal: 8),
    decoration: BoxDecoration(
      color: header ? const Color(0xffe2e8f0) : null,
      border: const Border(
        right: BorderSide(color: Color(0xffe2e8f0)),
        bottom: BorderSide(color: Color(0xffe2e8f0)),
      ),
    ),
    child:
        child ??
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: header ? const TextStyle(fontWeight: FontWeight.w700) : null,
        ),
  );

  Future<void> _showMenu(BuildContext context, Offset position) async {
    await showMenu<void>(
      context: context,
      position: RelativeRect.fromLTRB(
        position.dx,
        position.dy,
        position.dx,
        position.dy,
      ),
      items: [
        PopupMenuItem<void>(
          onTap: _cursor < 0 ? null : () => widget.onOpen(_cursor),
          child: Text(widget.menuLabel),
        ),
        PopupMenuItem<void>(
          onTap: _cursor < 0 ? null : () => setState(() => _editing = _cursor),
          child: Text(widget.editLabel),
        ),
      ],
    );
  }
}

class _SkeletonRow extends StatelessWidget {
  const _SkeletonRow();
  @override
  Widget build(BuildContext context) => const Row(
    children: [
      SizedBox(
        width: 148,
        child: DecoratedBox(
          decoration: BoxDecoration(color: Color(0xfff1f5f9)),
          child: SizedBox(height: 30),
        ),
      ),
    ],
  );
}
