import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:idea_q15_fixtures/fixture_assets.dart';

import 'models.dart';

class Q15Messages {
  Q15Messages._(this._catalog);
  final Map<String, Map<String, String>> _catalog;

  factory Q15Messages.fromCatalog(Map<String, Map<String, String>> catalog) =>
      Q15Messages._(catalog);

  static Future<Q15Messages> load() async {
    final source = await rootBundle.loadString(q15LocalesAsset);
    final decoded = jsonDecode(source) as Map<String, dynamic>;
    return Q15Messages._(
      decoded.map(
        (locale, values) => MapEntry(
          locale,
          (values as Map<String, dynamic>).map(
            (key, value) => MapEntry(key, value as String),
          ),
        ),
      ),
    );
  }

  String text(LocaleCode locale, String key) =>
      _catalog[locale.name]?[key] ?? _catalog['en']?[key] ?? key;
  Map<String, String> forLocale(LocaleCode locale) =>
      Map.unmodifiable(_catalog[locale.name] ?? _catalog['en']!);
}
