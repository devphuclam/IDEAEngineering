import 'package:http/browser_client.dart';
import 'package:http/http.dart' as http;

import 'transport.dart';

Q15Transport createTransport() => WebQ15Transport();

class WebQ15Transport implements Q15Transport {
  WebQ15Transport() {
    _client.withCredentials = true;
  }
  final BrowserClient _client = BrowserClient();

  @override
  Future<TransportResponse> send(String method, Uri uri, {String? body}) async {
    final request = http.Request(method, uri)
      ..headers['accept'] = 'application/json';
    if (body != null) {
      request.headers['content-type'] = 'application/json';
      request.body = body;
    }
    final streamed = await _client.send(request);
    final response = await http.Response.fromStream(streamed);
    return TransportResponse(
      response.statusCode,
      response.headers,
      response.body,
    );
  }

  @override
  void close() => _client.close();
}
