import 'package:http/http.dart' as http;

import 'transport.dart';

Q15Transport createTransport() => IoQ15Transport();

class IoQ15Transport implements Q15Transport {
  final http.Client _client = http.Client();
  String? _cookie;

  @override
  Future<TransportResponse> send(String method, Uri uri, {String? body}) async {
    final request = http.Request(method, uri);
    request.headers['accept'] = 'application/json';
    if (_cookie != null) request.headers['cookie'] = _cookie!;
    if (body != null) {
      request.headers['content-type'] = 'application/json';
      request.body = body;
    }
    final streamed = await _client.send(request);
    final response = await http.Response.fromStream(streamed);
    final setCookie = response.headers['set-cookie'];
    if (setCookie != null) _cookie = setCookie.split(';').first;
    return TransportResponse(
      response.statusCode,
      response.headers,
      response.body,
    );
  }

  @override
  void close() => _client.close();
}
