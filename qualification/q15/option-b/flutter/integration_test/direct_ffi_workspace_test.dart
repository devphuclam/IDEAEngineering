import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:idea_q15_option_b/workspace/workspace_client.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('direct Dart FFI survives repeated named-pipe round trips', (
    _,
  ) async {
    final client = createWorkspaceClient();
    expect(client.available, isTrue);

    for (var attempt = 0; attempt < 32; attempt++) {
      final result = await client.send('OpenDocument', const {
        'documentId': 'DOC-Q15-000001',
        'generationId': 'GEN-Q15-000001-V001',
      });
      expect(result.status, 'Accepted', reason: 'round trip $attempt');
      expect(
        result.code,
        'DOCUMENT_MATERIALIZED',
        reason: 'round trip $attempt',
      );
      expect(result.preservesLocalCandidate, isTrue);
    }
  });
}
