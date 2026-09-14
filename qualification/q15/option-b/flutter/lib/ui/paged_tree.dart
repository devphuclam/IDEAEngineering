import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models.dart';

class PagedProductTree extends StatefulWidget {
  const PagedProductTree({
    super.key,
    required this.total,
    required this.nodes,
    required this.onNeedNode,
    required this.label,
    this.pagingKey = '',
  });
  final int total;
  final Map<int, TreeNodeModel> nodes;
  final ValueChanged<int> onNeedNode;
  final String label;
  final String pagingKey;

  @override
  State<PagedProductTree> createState() => _PagedProductTreeState();
}

class _PagedProductTreeState extends State<PagedProductTree> {
  final _focus = FocusNode(debugLabel: 'Q15 product tree');
  final _requested = <int>{};
  final _collapsed = <String>{};
  var _selected = 0;

  @override
  void didUpdateWidget(covariant PagedProductTree oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.pagingKey != oldWidget.pagingKey ||
        widget.total != oldWidget.total) {
      _requested.clear();
      _collapsed.clear();
      _selected = 0;
    }
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  void _need(int index) {
    if (index < 0 || index >= widget.total) return;
    final page = (index ~/ 500) * 500;
    if (_requested.add(page)) scheduleMicrotask(() => widget.onNeedNode(page));
  }

  void _select(int index) {
    if (widget.total == 0) return;
    setState(() => _selected = index.clamp(0, widget.total - 1));
    _need(_selected);
  }

  @override
  Widget build(BuildContext context) {
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
            _select((_selected + 1).clamp(0, widget.total - 1));
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
            _select((_selected - 1).clamp(0, widget.total - 1));
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.home) {
            _select(0);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.end) {
            _select(widget.total - 1);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowLeft ||
              event.logicalKey == LogicalKeyboardKey.arrowRight ||
              event.logicalKey == LogicalKeyboardKey.enter ||
              event.logicalKey == LogicalKeyboardKey.space) {
            final node = widget.nodes[_selected];
            if (node?.hasChildren == true) {
              event.logicalKey == LogicalKeyboardKey.arrowLeft
                  ? _collapsed.add(node!.nodeId)
                  : _collapsed.remove(node!.nodeId);
              if (event.logicalKey == LogicalKeyboardKey.enter ||
                  event.logicalKey == LogicalKeyboardKey.space) {
                setState(() {
                  _collapsed.contains(node.nodeId)
                      ? _collapsed.remove(node.nodeId)
                      : _collapsed.add(node.nodeId);
                });
              } else {
                setState(() {});
              }
              return KeyEventResult.handled;
            }
          }
          return KeyEventResult.ignored;
        },
        child: ListView.builder(
          itemExtent: 32,
          itemCount: widget.total,
          itemBuilder: (context, index) {
            final node = widget.nodes[index];
            if (node == null) {
              _need(index);
              return const DecoratedBox(
                decoration: BoxDecoration(color: Color(0xfff1f5f9)),
                child: SizedBox(height: 28),
              );
            }
            final expanded = !_collapsed.contains(node.nodeId);
            return Semantics(
              selected: _selected == index,
              child: InkWell(
                onTap: () {
                  _focus.requestFocus();
                  _select(index);
                },
                child: ColoredBox(
                  color:
                      _selected == index
                          ? const Color(0xffdbeafe)
                          : Colors.transparent,
                  child: Padding(
                    padding: EdgeInsets.only(left: 8.0 + node.depth * 12),
                    child: Row(
                      children: [
                        Icon(
                          node.hasChildren
                              ? expanded
                                  ? Icons.expand_more
                                  : Icons.chevron_right
                              : Icons.insert_drive_file_outlined,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            node.label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
