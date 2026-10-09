// Throwaway visual-only preview. Run from any directory with the already approved Node runtime.
// Serves exactly one authored concept and the existing IDEA logo, on loopback only.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([
  ['/', [new URL('./iam-visual-concept.html', import.meta.url), 'text/html; charset=utf-8']],
  ['/apps/web/src/assets/logo-idea.png', [new URL('../apps/web/src/assets/logo-idea.png', import.meta.url), 'image/png']],
]);
const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
  const file = files.get(request.url);
  if (!file) { response.writeHead(404); response.end(); return; }
  try {
    const body = await readFile(file[0]);
    response.writeHead(200, {
      'Content-Type': file[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(500); response.end(); }
});
server.on('error', error => { console.error(`Concept preview stopped: ${error.code}`); process.exitCode = 1; });
server.listen(18609, '127.0.0.1', () => console.log('IDEA visual concept: http://127.0.0.1:18609/ (synthetic only; Ctrl+C to stop)'));
