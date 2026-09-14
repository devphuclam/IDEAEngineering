import 'dart:convert';

import '../models.dart';
import 'transport.dart';
import 'transport_factory.dart';

abstract interface class Q15Api {
  Future<SessionView> login(String username, String password);
  Future<SearchPage> search(
    String query,
    FixtureProfile profile,
    int offset, [
    int limit = 200,
  ]);
  Future<TreePage> tree(FixtureProfile profile, int offset, [int limit = 500]);
  Future<DocumentDetail> document(String id);
  Future<OperationStatus> checkout(DocumentDetail detail, String scenario);
  Future<OperationStatus> checkin(
    DocumentDetail detail,
    String reservationId,
    String digest,
    String scenario,
  );
  Future<OperationStatus> operation(String id);
  void close();
}

class Q15ApiClient implements Q15Api {
  Q15ApiClient({String? baseUrl})
    : _base = Uri.parse(
        baseUrl ??
            const String.fromEnvironment(
              'Q15_API_URL',
              defaultValue: 'http://127.0.0.1:5115',
            ),
      ),
      _transport = createTransport();
  final Uri _base;
  final Q15Transport _transport;

  @override
  Future<SessionView> login(String username, String password) async =>
      SessionView.fromJson(
        await _request(
          'POST',
          '/api/v1/session/login',
          body: {'username': username, 'password': password},
        ),
      );
  @override
  Future<SearchPage> search(
    String query,
    FixtureProfile profile,
    int offset, [
    int limit = 200,
  ]) async => SearchPage.fromJson(
    await _request(
      'GET',
      '/api/v1/search',
      query: {
        'q': query,
        'profile': profile.name,
        'offset': '$offset',
        'limit': '$limit',
      },
    ),
  );
  @override
  Future<TreePage> tree(
    FixtureProfile profile,
    int offset, [
    int limit = 500,
  ]) async => TreePage.fromJson(
    await _request(
      'GET',
      '/api/v1/tree',
      query: {'profile': profile.name, 'offset': '$offset', 'limit': '$limit'},
    ),
  );
  @override
  Future<DocumentDetail> document(String id) async => DocumentDetail.fromJson(
    await _request('GET', '/api/v1/documents/${Uri.encodeComponent(id)}'),
  );
  @override
  Future<OperationStatus> checkout(
    DocumentDetail detail,
    String scenario,
  ) async => OperationStatus.fromJson(
    await _request(
      'POST',
      '/api/v1/documents/${Uri.encodeComponent(detail.documentId)}/checkout',
      body: {
        'operationId': newUuid(),
        'workspaceId': 'WS-Q15-001',
        'expectedGenerationId': detail.generationId,
        'scenario': scenario,
      },
    ),
  );
  @override
  Future<OperationStatus> checkin(
    DocumentDetail detail,
    String reservationId,
    String digest,
    String scenario,
  ) async => OperationStatus.fromJson(
    await _request(
      'POST',
      '/api/v1/documents/${Uri.encodeComponent(detail.documentId)}/checkin',
      body: {
        'operationId': newUuid(),
        'workspaceId': 'WS-Q15-001',
        'reservationId': reservationId,
        'expectedGenerationId': detail.generationId,
        'declaredDigest': digest,
        'scenario': scenario,
      },
    ),
  );
  @override
  Future<OperationStatus> operation(String id) async =>
      OperationStatus.fromJson(
        await _request('GET', '/api/v1/operations/${Uri.encodeComponent(id)}'),
      );

  Future<JsonMap> _request(
    String method,
    String path, {
    Map<String, String>? query,
    JsonMap? body,
  }) async {
    final uri = _base.resolve(path).replace(queryParameters: query);
    final response = await _transport.send(
      method,
      uri,
      body: body == null ? null : jsonEncode(body),
    );
    final decoded = jsonDecode(response.body) as JsonMap;
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiProblem.fromJson(decoded);
    }
    return decoded;
  }

  @override
  void close() => _transport.close();
}

String newUuid() {
  final now = DateTime.now().microsecondsSinceEpoch;
  final values = List<int>.generate(
    16,
    (index) => (now >> ((index % 8) * 8) ^ (index * 37 + now)) & 0xff,
  );
  values[6] = (values[6] & 0x0f) | 0x40;
  values[8] = (values[8] & 0x3f) | 0x80;
  String part(int start, int length) => values
      .skip(start)
      .take(length)
      .map((value) => value.toRadixString(16).padLeft(2, '0'))
      .join();
  return '${part(0, 4)}-${part(4, 2)}-${part(6, 2)}-${part(8, 2)}-${part(10, 6)}';
}
