// Emit a fresh, first-party control packet. Never provision a database or acquire tooling.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadConfig, nginxConfig } from './topology.mjs';
const c = loadConfig(), target = resolve(process.argv[2]);
mkdirSync(target, { recursive: false, mode: 0o700 });
const here = dirname(fileURLToPath(import.meta.url));
const artifact=JSON.parse(readFileSync(resolve(here,'artifact.json'),'utf8'));
if(!/^\/home\/phuclam\/[a-zA-Z0-9_./-]+\.jar$/.test(artifact.jar)||artifact.jar.split('/').includes('..')
  ||!/^[a-f0-9]{64}$/.test(artifact.sha256)||!/^[a-f0-9]{40}$/.test(artifact.applicationSource)
  ||!/^[a-f0-9]{40}$/.test(artifact.documentationSource))throw Error('Invalid controlled package identity');
const files = new Map(['common.sh', 'backend.sh', 'edge.sh'].map(name => [name, readFileSync(resolve(here, name))]));
files.set('nginx-dev.conf', Buffer.from(nginxConfig(c, 'dev')));
files.set('nginx-review.conf', Buffer.from(nginxConfig(c, 'review')));
// All interpolated values were validated by configure(); private values are not included.
files.set('environment.sh', Buffer.from(`retained=/home/phuclam/idea-nginx-dev-20261008-49
nginx=$retained/package/usr/sbin/nginx
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
jar=${artifact.jar}
jar_sha256=${artifact.sha256}
application_source=${artifact.applicationSource}
documentation_source=${artifact.documentationSource}
certificate=${c.certificate}
backend_ca=${c.backendCa}
backend_origin=${c.backendOrigin}
backend_managed=${c.backendOrigin === 'https://127.0.0.1:18449' ? 'true' : 'false'}
frontend_origin=${c.frontendOrigin}
frontend_ca=${c.frontendCa}
public_origin=${c.publicOrigin}
edge_port=${new URL(c.publicOrigin).port || '443'}
`));
for (const [name, bytes] of files) writeFileSync(resolve(target, name), bytes, { flag: 'wx', mode: 0o600 });
writeFileSync(resolve(target, 'inputs.sha256'), [...files].map(([name, bytes]) => `${createHash('sha256').update(bytes).digest('hex')}  ${name}`).join('\n') + '\n', { flag: 'wx', mode: 0o600 });
console.log(`DEV_PACKET=${target};TARGET=${c.remoteRoot};FILES=${files.size};NO_SECRETS=true`);
