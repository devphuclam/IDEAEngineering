import '../models.dart';

abstract interface class WorkspaceClient {
  bool get available;
  Future<WorkspaceResult> send(
    String operation,
    Map<String, String> payload, {
    Duration timeout = const Duration(seconds: 8),
  });
}
