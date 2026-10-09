import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']);
const digest = text => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
const key = (surface, method, route) => `${surface} ${method.toUpperCase()} ${route}`;
export const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const stableJSON = value => JSON.stringify(value, null, 2) + '\n';

function inside(root, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw Error('Repository-relative path required');
  const target = path.resolve(root, relative);
  if (!target.startsWith(path.resolve(root) + path.sep)) throw Error('Path escapes repository');
  return target;
}
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isSymbolicLink() ? (() => { throw Error('Source symlink is unsupported'); })()
      : entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
// Preserve string literals. Commented-out mappings are not executable routes.
function withoutComments(source) {
  return source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,
    value => value.startsWith('/') ? value.replace(/[^\n]/g, ' ') : value);
}
function annotations(source) {
  const result = [];
  const pattern = /@(?:org\.springframework\.web\.bind\.annotation\.)?(RequestMapping|GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\s*\(/g;
  for (const match of source.matchAll(pattern)) {
    let depth = 1, quote = false, escaped = false, end = match.index + match[0].length;
    for (; end < source.length && depth; end++) {
      const char = source[end];
      if (escaped) { escaped = false; continue; }
      if (char === '\\' && quote) { escaped = true; continue; }
      if (char === '"') quote = !quote;
      if (!quote && char === '(') depth++;
      if (!quote && char === ')') depth--;
    }
    if (depth) throw Error('Unterminated route annotation');
    result.push({ type: match[1], index: match.index, args: source.slice(match.index + match[0].length, end - 1) });
  }
  return result;
}
function literalPaths(args) {
  // Only literal paths/arrays supported. Dynamic constants, composed annotations and
  // conditional mappings must receive an explicit adapter extension, never be guessed.
  const named = args.match(/(?:^|,)\s*(?:value|path)\s*=\s*(\{[^}]*\}|"(?:\\.|[^"\\])*")/);
  const value = named ? named[1] : args.trim();
  if (!/^(?:"[^"\\]*"|\{\s*"[^"\\]*"(?:\s*,\s*"[^"\\]*")*\s*\})$/.test(value)) {
    throw Error('Unsupported mapping syntax: ' + args);
  }
  if (named && args.replace(named[0], '').trim()) throw Error('Conditional mapping requires review: ' + args);
  return [...value.matchAll(/"([^"]*)"/g)].map(match => match[1]);
}

export function discoverRoutes(root, config) {
  const routes = [];
  for (const surface of config.surfaces) {
    for (const file of files(inside(root, surface.sourceRoot)).filter(f => f.endsWith('.java'))) {
      const source = withoutComments(fs.readFileSync(file, 'utf8'));
      const relative = path.relative(root,file).replaceAll('\\','/');
      if (/\b(?:OncePerRequestFilter|GenericFilterBean|FilterRegistrationBean|ServletRegistrationBean|HttpServlet)\b|@Web(?:Filter|Servlet)\b|\bimplements\s+Filter\b/.test(source)
        && !config.reviewedSources.includes(relative))
        throw Error('Unreviewed filter/servlet registration: ' + relative);
      // A user-defined composed mapping would otherwise silently evade the scanner.
      if (/@interface\s+\w+/.test(source) && /@(?:org\.springframework\.web\.bind\.annotation\.)?(RequestMapping|GetMapping|PostMapping)/.test(source))
        throw Error('Composed route annotation needs an explicit discovery adapter: ' + file);
      if (/RouterFunction|RouterFunctions|registerMapping\s*\(/.test(source))
        throw Error('Programmatic route registration needs an explicit discovery adapter: ' + file);
      const mappings = annotations(source);
      const declared = [...source.matchAll(/@(?:org\.springframework\.web\.bind\.annotation\.)?(RequestMapping|GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\b/g)];
      if (declared.length !== mappings.length) throw Error('Implicit/unsupported route annotation needs review: ' + file);
      const classIndex = source.search(/\bclass\s+\w+/);
      const base = mappings.filter(a => a.index < classIndex);
      if (base.length > 1 || base.some(a => a.type !== 'RequestMapping')) throw Error('Unsupported class mapping: ' + file);
      const prefixes = base.length ? literalPaths(base[0].args) : [''];
      for (const annotation of mappings.filter(a => a.index > classIndex)) {
        if (annotation.type === 'RequestMapping') throw Error('Method RequestMapping requires explicit method discovery: ' + file);
        for (const prefix of prefixes) for (const suffix of literalPaths(annotation.args)) {
          const route = (prefix + suffix).replace(/\/+/g, '/');
          const method = annotation.type.replace('Mapping','').toUpperCase();
          const exclusion = config.excludedRoutes.find(e => e.surface === surface.id
            && e.source === relative && e.method === method && e.path === route);
          if (exclusion) continue;
          routes.push({ surface: surface.id, method, path: route, source: relative });
        }
      }
    }
  }
  for (const binding of config.filterRoutes) {
    const source = withoutComments(fs.readFileSync(inside(root, binding.source), 'utf8'));
    let matched;
    if (binding.adapter === 'spring-login') {
      const found = [...source.matchAll(/\.loginProcessingUrl\("([^"]+)"\)/g)];
      if (found.length === 1) matched = { method: 'POST', path: found[0][1] };
    } else if (binding.adapter === 'servlet-logout') {
      const found = source.match(/!request\.getMethod\(\)\.equals\("([A-Z]+)"\)\s*\|\|\s*!request\.getServletPath\(\)\.equals\("([^"]+)"\)/);
      if (found) matched = { method: found[1], path: found[2] };
    }
    if (!matched) throw Error('Filter route adapter no longer matches: ' + binding.source);
    routes.push({ ...matched, surface: binding.surface, source: binding.source });
  }
  const seen = new Set();
  for (const route of routes) {
    const identity = key(route.surface,route.method,route.path.replace(/\{[^}]+\}/g, '{}'));
    if (seen.has(identity)) throw Error('Duplicate executable route: ' + identity);
    seen.add(identity);
  }
  return routes;
}

function resolve(document, value) {
  if (!value?.$ref) return value;
  if (!value.$ref.startsWith('#/')) throw Error('External OpenAPI reference is not admitted: ' + value.$ref);
  const resolved = value.$ref.slice(2).split('/').reduce((item, token) =>
    item?.[token.replaceAll('~1','/').replaceAll('~0','~')], document);
  if (!resolved) throw Error('Unresolved OpenAPI reference: ' + value.$ref);
  return resolved;
}
function validateDocument(document) {
  if (document.openapi !== '3.0.3' || !document.info?.version || !document.paths)
    throw Error('Expected a versioned OpenAPI 3.0.3 document');
  function walk(value, inSchema = false) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { for (const child of value) walk(child,inSchema); return; }
    if (value.$ref) resolve(document,value);
    if (inSchema && value.type === 'object' && value.required
      && value.required.some(name => !Object.hasOwn(value.properties ?? {},name)))
      throw Error('Required property absent from schema');
    if (inSchema && value.type === 'array' && !value.items) throw Error('Array schema needs items');
    if (inSchema && value.type && !['object','array','string','integer','number','boolean'].includes(value.type))
      throw Error('Unsupported OpenAPI schema type: ' + value.type);
    for (const [name,child] of Object.entries(value)) {
      // Literal payloads may legitimately contain keys called type, required or $ref.
      if (['example','default','enum'].includes(name) || name.startsWith('x-')) continue;
      if (name === 'examples') {
        for (const example of Object.values(child ?? {})) if (example?.$ref) resolve(document,example);
      } else if (child === document.components?.schemas || (inSchema && name === 'properties')) {
        for (const schema of Object.values(child)) walk(schema,true);
      } else walk(child,name === 'schema' || (inSchema && ['items','allOf','anyOf','oneOf','not','additionalProperties'].includes(name)));
    }
  }
  walk(document);
}

export function sourceHashes(root, config) {
  return Object.fromEntries(config.reviewedSources.map(file => [file,
    digest(fs.readFileSync(inside(root,file),'utf8'))]));
}

export function readContract(root) {
  const tool = inside(root,'tools/contract-exporter');
  const config = json(path.join(tool,'contract-config.json'));
  const errors = [];
  const operations = [];
  const documents = config.surfaces.map(surface => ({ surface,
    document: json(inside(root,surface.openapi)) }));
  for (const {surface,document} of documents) {
    try { validateDocument(document); } catch (error) { errors.push(surface.id + ': ' + error.message); }
    for (const [route,item] of Object.entries(document.paths)) {
      if (!route.startsWith('/')) { errors.push('Invalid path: ' + route); continue; }
      for (const [method,operation] of Object.entries(item)) {
        if (!methods.has(method)) continue;
        const identity = key(surface.id,method,route);
        if (!operation.operationId) errors.push('Missing operationId: ' + identity);
        const contract = operation['x-idea-contract'];
        for (const field of ['code','owner','authority','state','atomicity','concurrency','retry','trace','semanticSource']) {
          if (!contract?.[field] || (Array.isArray(contract[field]) && !contract[field].length))
            errors.push('Missing contract ' + field + ': ' + identity);
        }
        if (contract?.status !== 'HTTP') errors.push('Executable route must be explicitly HTTP: ' + identity);
        if (contract?.semanticSource) {
          const file = contract.semanticSource.split('#')[0];
          if (!fs.existsSync(inside(root,file))) errors.push('Missing semantic source: ' + file);
        }
        if (!Object.keys(operation.responses ?? {}).some(code => /^2\d\d$/.test(code)))
          errors.push('Missing successful response: ' + identity);
        const parameters = [...(item.parameters ?? []),...(operation.parameters ?? [])].map(p => resolve(document,p));
        for (const name of [...route.matchAll(/\{([^}]+)\}/g)].map(m => m[1])) {
          if (!parameters.some(p => p.in === 'path' && p.name === name && p.required === true))
            errors.push('Missing required path parameter ' + name + ': ' + identity);
        }
        for (const security of operation.security ?? document.security ?? []) {
          for (const name of Object.keys(security)) if (!document.components?.securitySchemes?.[name])
            errors.push('Undefined security scheme ' + name + ': ' + identity);
        }
        operations.push({surface:surface.id,method:method.toUpperCase(),path:route,operation,contract,document,parameters});
      }
    }
  }
  for (const field of ['operationId','code']) {
    const seen = new Set();
    for (const entry of operations) {
      const value = field === 'code' ? entry.contract?.code : entry.operation.operationId;
      if (seen.has(value)) errors.push('Duplicate ' + field + ': ' + value);
      seen.add(value);
    }
  }
  let routes = [];
  try { routes = discoverRoutes(root,config); } catch (error) { errors.push(error.message); }
  const actualKeys = new Set(routes.map(r => key(r.surface,r.method,r.path)));
  const documentedKeys = new Set(operations.map(r => key(r.surface,r.method,r.path)));
  for (const identity of actualKeys) if (!documentedKeys.has(identity)) errors.push('UNDOCUMENTED_ROUTE ' + identity);
  for (const identity of documentedKeys) if (!actualKeys.has(identity)) errors.push('STALE_CONTRACT_ROUTE ' + identity);
  for (const route of routes) if (!config.reviewedSources.includes(route.source))
    errors.push('UNREVIEWED_ROUTE_SOURCE ' + route.source);
  const expected = json(path.join(tool,'source-review.json'));
  const current = sourceHashes(root,config);
  for (const [file,hash] of Object.entries(current)) if (expected.hashes[file] !== hash)
    errors.push('SOURCE_REVIEW_REQUIRED ' + file);
  for (const file of Object.keys(expected.hashes)) if (!Object.hasOwn(current,file))
    errors.push('Unexpected reviewed-source entry: ' + file);
  return {root,tool,config,operations,routes,errors,documents};
}

function schemaType(document, schema) {
  const resolved = resolve(document,schema);
  if (schema?.$ref) return schema.$ref.split('/').at(-1);
  if (resolved?.type === 'array') return 'array<' + schemaType(document,resolved.items) + '>';
  return resolved?.type ?? (resolved?.oneOf ? 'oneOf' : 'object');
}

function schemaConstraints(schema) {
  return [
    schema.format, schema.enum && 'enum: ' + schema.enum.join(', '),
    schema.minimum !== undefined && 'minimum=' + schema.minimum,
    schema.maximum !== undefined && 'maximum=' + schema.maximum,
    schema.minLength !== undefined && 'minLength=' + schema.minLength,
    schema.maxLength !== undefined && 'maxLength=' + schema.maxLength,
    schema.minItems !== undefined && 'minItems=' + schema.minItems,
    schema.maxItems !== undefined && 'maxItems=' + schema.maxItems,
    schema.uniqueItems && 'uniqueItems', schema.pattern && 'pattern=' + schema.pattern,
    schema.nullable && 'nullable', schema.writeOnly && 'writeOnly', schema.readOnly && 'readOnly'
  ].filter(Boolean).join('; ');
}

// Keep the existing short endpoint dictionary. Refer to nested models by name rather
// than copying the complete model tree into every endpoint/document three times.
function schemaFields(document, schema, location, prefix = '', required = false) {
  const resolved = resolve(document,schema);
  if (!resolved) return [];
  if (!prefix && resolved.properties) return Object.entries(resolved.properties).flatMap(([name,child]) =>
    schemaFields(document,child,location,name,(resolved.required ?? []).includes(name)));
  const itemConditions = resolved.items ? schemaConstraints(resolve(document,resolved.items)) : '';
  const conditions = [schemaConstraints(resolved),itemConditions && 'items: ' + itemConditions]
    .filter(Boolean).join('; ');
  const field = {name:prefix || 'body',in:location,type:schemaType(document,schema),
    required,validation:conditions,description:resolved.description ?? '',example:resolved.example ?? ''};
  return [field];
}

export function projectCatalog(packet) {
  const {config,operations,documents} = packet;
  // This is the old tool's editorial catalog, not a disposable generated document.
  // Keep its Vietnamese names, explanations, metadata and revision history.
  const current = json(path.join(packet.tool,'data/api-catalog.json'));
  const editorial = new Map(current.endpoints.map(entry=>[entry.code,entry]));
  const endpoints = operations.map(({surface,method,path:route,operation,contract,document,parameters}) => {
    const fields = parameters.flatMap(p => schemaFields(document,p.schema,p.in,p.name,p.required));
    for (const [media,content] of Object.entries(operation.requestBody?.content ?? {}))
      fields.push(...schemaFields(document,content.schema,'Request Body (' + media + ')','',operation.requestBody.required));
    for (const [status,response] of Object.entries(operation.responses ?? {})) {
      if (!status.startsWith('2')) continue; // Refusals already have the existing error matrix.
      for (const [media,content] of Object.entries(resolve(document,response).content ?? {}))
        fields.push(...schemaFields(document,content.schema,'Response ' + status + ' (' + media + ')'));
    }
    return {
      code:contract.code,name:editorial.get(contract.code)?.name ?? operation.summary ?? operation.operationId,
      group:editorial.get(contract.code)?.group ?? contract.owner,
      phase:surface === 'gateway' ? 'Gateway' : 'Phase 1',method,path:route,
      auth:contract.authority,status:'[ĐÃ TRIỂN KHAI — HTTP; không đồng nghĩa deployed]',
      description:editorial.get(contract.code)?.description ?? operation.description ?? operation.summary ?? '',
      preconditions:contract.state,stateEffects:contract.atomicity,
      headers:parameters.filter(p => p.in === 'header').map(p => ({name:p.name,required:p.required,description:p.description ?? ''})),
      fields,requestExample: operation['x-idea-request-example'] ?? 'See canonical OpenAPI schema; no inferred request or secret value.',
      responseExample:operation['x-idea-response-example'] ?? 'See canonical OpenAPI schema; no inferred response.',
      errors:Object.entries(operation.responses).filter(([status]) => !status.startsWith('2')).map(([status,r]) => ({
        status,code:'HTTP ' + status,reason:resolve(document,r).description,remedy:contract.retry})),
      notes:`operationId=${operation.operationId}; surface=${surface}; concurrency=${contract.concurrency}; retry=${contract.retry}; trace=${contract.trace.join(', ')}; semanticSource=${contract.semanticSource}; schema đầy đủ: ${config.surfaces.find(s=>s.id===surface).openapi}`
    };
  });
  // CPD is still semantic DESIGN. Keep a short index to the original cards, not a second
  // copy of the semantic specification and not a fabricated wire schema.
  const source = config.designSource;
  const text = fs.readFileSync(inside(packet.root,source),'utf8');
  const cards = /###\s+(CPD-[A-Z0-9.]+)\s+[—–-]\s+([^\r\n]+)\r?\n([\s\S]*?)(?=\r?\n###|\r?\n##|$)/g;
  for (const match of text.matchAll(cards)) endpoints.push({
    code:match[1],name:editorial.get(match[1])?.name ?? match[2],
    group:editorial.get(match[1])?.group ?? 'Dữ liệu Sản phẩm PDM (CPD)',phase:'Phase 2 (CPD)',method:'UNKNOWN',path:'UNKNOWN',
    auth:'UNKNOWN wire; see approved semantic authority',status:'[DESIGN — chưa triển khai HTTP]',
    description:editorial.get(match[1])?.description ?? `Thiết kế, chưa có API HTTP. Xem thẻ ${match[1]} trong controlled-product-data.md.`,
    preconditions:'See exact semantic card',stateEffects:'No runtime claim',
    headers:[],fields:[],requestExample:'UNKNOWN — semantic examples are not wire DTOs.',
    responseExample:'UNKNOWN — no implemented endpoint.',errors:[],notes:'Source: ' + source
  });
  return {metadata:current.metadata,workflows:current.workflows ?? [],endpoints,
    provenance:{sources:documents.map(({surface,document}) => ({surface:surface.id,path:surface.openapi,
      version:document.info.version,sha256:digest(stableJSON(document))})),
      semanticSource:source,semanticSHA256:digest(text)}};
}

export function checkContract(root, {checkCatalog = true} = {}) {
  const packet = readContract(root);
  if (!packet.errors.length) {
    packet.catalog = projectCatalog(packet);
    const catalogPath = path.join(packet.tool,'data/api-catalog.json');
    if (checkCatalog && (!fs.existsSync(catalogPath)
      || stableJSON(json(catalogPath)) !== stableJSON(packet.catalog)))
      packet.errors.push('STALE_EXPORT_CATALOG: run --update after reviewing the source contract');
  }
  return packet;
}
