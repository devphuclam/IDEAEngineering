class TransportResponse {
  const TransportResponse(this.statusCode, this.headers, this.body);
  final int statusCode;
  final Map<String, String> headers;
  final String body;
}

abstract interface class Q15Transport {
  Future<TransportResponse> send(String method, Uri uri, {String? body});
  void close();
}
