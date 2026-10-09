import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../../../tools/dev-access/topology.mjs';

export async function startFrontend({ webDirectory = process.env.IDEA_WEB_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), '..'),
  config = loadConfig(), port = config.frontendPort } = {}) {
  const publicUrl = new URL(config.publicOrigin);
  const server = await createServer({
    root: webDirectory, configFile: false, plugins: [react()],
    cacheDir: resolve(webDirectory, 'node_modules/.vite-dev'),
    server: {
      host: '127.0.0.1', port, strictPort: true, origin: config.publicOrigin,
      allowedHosts: [publicUrl.hostname], cors: { origin: config.publicOrigin },
      // HMR uses the same trusted HTTPS edge, never a direct browser fallback.
      ws: { protocol: 'wss', host: publicUrl.hostname, clientPort: Number(publicUrl.port || 443), path: '/__vite_hmr' },
      forwardConsole: false,
      fs: { strict: true, allow: [webDirectory] },
    },
  });
  await server.listen();
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const server = await startFrontend();
  console.log(`FRONTEND=RUNNING;SOURCE=${server.config.root};MODE=LOCAL_CHECKOUT;URL=${loadConfig().publicOrigin}`);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await server.close(); process.exit(0); });
}
