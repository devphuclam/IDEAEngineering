import '../models.dart';
import 'workspace_client_base.dart';

WorkspaceClient createWorkspaceClient() => const BrowserWorkspaceClient();

class BrowserWorkspaceClient implements WorkspaceClient {
  const BrowserWorkspaceClient();
  @override
  bool get available => false;
  @override
  Future<WorkspaceResult> send(
    String operation,
    Map<String, String> payload, {
    Duration timeout = const Duration(seconds: 8),
  }) => Future.error(UnsupportedError('NATIVE_WORKSPACE_UNAVAILABLE_ON_WEB'));
}
