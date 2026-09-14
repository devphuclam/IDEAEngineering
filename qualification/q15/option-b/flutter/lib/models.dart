typedef JsonMap = Map<String, dynamic>;

enum LocaleCode { en, vi, ja }

enum FixtureProfile { small, medium, large, stress }

class SessionView {
  const SessionView(this.displayName, this.locale, this.expiresAtUtc);
  final String displayName;
  final LocaleCode locale;
  final DateTime expiresAtUtc;
  factory SessionView.fromJson(JsonMap json) => SessionView(
    json['displayName'] as String,
    LocaleCode.values.byName(json['locale'] as String),
    DateTime.parse(json['expiresAtUtc'] as String),
  );
}

class DocumentSummary {
  const DocumentSummary({
    required this.documentId,
    required this.title,
    required this.revision,
    required this.version,
    required this.generationId,
    required this.state,
    required this.values,
  });
  final String documentId;
  final String title;
  final String revision;
  final int version;
  final String generationId;
  final String state;
  final List<String> values;
  factory DocumentSummary.fromJson(JsonMap json) => DocumentSummary(
    documentId: json['documentId'] as String,
    title: json['title'] as String,
    revision: json['revision'] as String,
    version: json['version'] as int,
    generationId: json['generationId'] as String,
    state: json['state'] as String,
    values: (json['values'] as List<dynamic>).cast<String>(),
  );
}

class DocumentDetail extends DocumentSummary {
  const DocumentDetail({
    required super.documentId,
    required super.title,
    required super.revision,
    required super.version,
    required super.generationId,
    required super.state,
    required super.values,
    required this.documentClass,
    required this.metadata,
    required this.allowedActions,
    required this.readOnly,
  });
  final String documentClass;
  final Map<String, String> metadata;
  final List<String> allowedActions;
  final bool readOnly;
  factory DocumentDetail.fromJson(JsonMap json) => DocumentDetail(
    documentId: json['documentId'] as String,
    title: json['title'] as String,
    revision: json['revision'] as String,
    version: json['version'] as int,
    generationId: json['generationId'] as String,
    state: json['state'] as String,
    values: (json['values'] as List<dynamic>).cast<String>(),
    documentClass: json['documentClass'] as String,
    metadata: (json['metadata'] as Map<String, dynamic>).map(
      (key, value) => MapEntry(key, value as String),
    ),
    allowedActions: (json['allowedActions'] as List<dynamic>).cast<String>(),
    readOnly: json['readOnly'] as bool,
  );
}

class SearchPage {
  const SearchPage(
    this.total,
    this.offset,
    this.limit,
    this.columns,
    this.items,
  );
  final int total;
  final int offset;
  final int limit;
  final List<String> columns;
  final List<DocumentSummary> items;
  factory SearchPage.fromJson(JsonMap json) => SearchPage(
    json['total'] as int,
    json['offset'] as int,
    json['limit'] as int,
    (json['columns'] as List<dynamic>).cast<String>(),
    (json['items'] as List<dynamic>)
        .map((item) => DocumentSummary.fromJson(item as JsonMap))
        .toList(),
  );
}

class TreeNodeModel {
  const TreeNodeModel(
    this.nodeId,
    this.parentId,
    this.label,
    this.depth,
    this.hasChildren,
  );
  final String nodeId;
  final String? parentId;
  final String label;
  final int depth;
  final bool hasChildren;
  factory TreeNodeModel.fromJson(JsonMap json) => TreeNodeModel(
    json['nodeId'] as String,
    json['parentId'] as String?,
    json['label'] as String,
    json['depth'] as int,
    json['hasChildren'] as bool,
  );
}

class TreePage {
  const TreePage(
    this.total,
    this.maxDepth,
    this.offset,
    this.limit,
    this.nodes,
  );
  final int total;
  final int maxDepth;
  final int offset;
  final int limit;
  final List<TreeNodeModel> nodes;
  factory TreePage.fromJson(JsonMap json) => TreePage(
    json['total'] as int,
    json['maxDepth'] as int,
    json['offset'] as int,
    json['limit'] as int,
    (json['nodes'] as List<dynamic>)
        .map((item) => TreeNodeModel.fromJson(item as JsonMap))
        .toList(),
  );
}

class OperationStatus {
  const OperationStatus({
    required this.operationId,
    required this.kind,
    required this.status,
    required this.documentId,
    required this.expectedGenerationId,
    this.reservationId,
    this.reasonCode,
    required this.preservedLocalCandidate,
  });
  final String operationId;
  final String kind;
  final String status;
  final String documentId;
  final String expectedGenerationId;
  final String? reservationId;
  final String? reasonCode;
  final bool preservedLocalCandidate;
  factory OperationStatus.fromJson(JsonMap json) => OperationStatus(
    operationId: json['operationId'] as String,
    kind: json['kind'] as String,
    status: json['status'] as String,
    documentId: json['documentId'] as String,
    expectedGenerationId: json['expectedGenerationId'] as String,
    reservationId: json['reservationId'] as String?,
    reasonCode: json['reasonCode'] as String?,
    preservedLocalCandidate: json['preservedLocalCandidate'] as bool,
  );
}

class ApiProblem implements Exception {
  const ApiProblem(this.status, this.code, this.title, this.detail);
  final int status;
  final String code;
  final String title;
  final String detail;
  factory ApiProblem.fromJson(JsonMap json) => ApiProblem(
    json['status'] as int,
    json['code'] as String,
    json['title'] as String,
    json['detail'] as String,
  );
  @override
  String toString() => '$code: $detail';
}

class WorkspaceResult {
  const WorkspaceResult({
    required this.requestId,
    required this.status,
    required this.code,
    required this.payload,
    required this.preservesLocalCandidate,
  });
  final String requestId;
  final String status;
  final String code;
  final JsonMap payload;
  final bool preservesLocalCandidate;
  factory WorkspaceResult.fromJson(JsonMap json) => WorkspaceResult(
    requestId: json['requestId'] as String,
    status: json['status'] as String,
    code: json['code'] as String,
    payload: json['payload'] as JsonMap,
    preservesLocalCandidate: json['preservesLocalCandidate'] as bool,
  );
}
