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
  });
  final int total;
  final Map<int, TreeNodeModel> nodes;
  final ValueChanged<int> onNeedNode;
  final String label;
  @override
  State<PagedProductTree> createState() => _PagedProductTreeState();
}

class _PagedProductTreeState extends State<PagedProductTree> {
  final _requested = <int>{};
  var _selected = 0;
  void _need(int index) {
    final page = (index ~/ 500) * 500;
    if (_requested.add(page)) scheduleMicrotask(() => widget.onNeedNode(page));
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: widget.label,
      container: true,
      child: Focus(
        onKeyEvent: (_, event) {
          if (event is! KeyDownEvent || widget.total == 0) {
            return KeyEventResult.ignored;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
            setState(
              () => _selected = (_selected + 1).clamp(0, widget.total - 1),
            );
            _need(_selected);
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
            setState(
              () => _selected = (_selected - 1).clamp(0, widget.total - 1),
            );
            _need(_selected);
            return KeyEventResult.handled;
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
            return Semantics(
              selected: _selected == index,
              child: InkWell(
                onTap: () => setState(() => _selected = index),
                child: ColoredBox(
                  color: _selected == index
                      ? const Color(0xffdbeafe)
                      : Colors.transparent,
                  child: Padding(
                    padding: EdgeInsets.only(left: 8.0 + node.depth * 12),
                    child: Row(
                      children: [
                        Icon(
                          node.hasChildren
                              ? Icons.chevron_right
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
