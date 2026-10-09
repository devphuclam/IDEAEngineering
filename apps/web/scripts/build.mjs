import { access, copyFile, mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { assertBuildOutput } from './build-output.mjs';

const web = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outputArgument = args.indexOf('--outDir');
if (outputArgument >= 0 && !args[outputArgument + 1]) throw new Error('--outDir requires an owned output path');
const output = await assertBuildOutput(web, outputArgument < 0 ? resolve(web, 'dist') : resolve(web, args[outputArgument + 1]));
if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Approved Node24 required');
for (const command of [
  [resolve(web, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json', '--noEmit'],
  [resolve(web, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', output, '--emptyOutDir'],
]) {
  const result = spawnSync(process.execPath, command, { cwd: web, stdio: 'inherit', env: { ...process.env, npm_config_offline: 'true' } });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await access(resolve(output, 'index.html'));
const notices = [['react', '19.3.0'], ['react-dom', '19.3.0'], ['scheduler', '0.28.0']];
await mkdir(resolve(output, 'assets/licenses'), { recursive: true });
for (const [name, version] of notices) {
  const root = resolve(web, 'node_modules', name);
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const license = await readFile(resolve(root, 'LICENSE'));
  if (manifest.name !== name || manifest.version !== version || createHash('sha256').update(license).digest('hex') !== 'da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93') throw new Error('Runtime notice intake drift');
  await copyFile(resolve(root, 'LICENSE'), resolve(output, 'assets/licenses', `${name}.txt`));
}
console.log('FRONTEND_BUILD=READY;ARTIFACT=STATIC_WEB;BACKEND_BUILD=NOT_REQUIRED;NOTICES=3');
