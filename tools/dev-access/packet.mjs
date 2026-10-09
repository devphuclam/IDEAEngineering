// Emit a fresh, first-party control packet. Never provision a database or acquire tooling.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadConfig, nginxConfig } from './topology.mjs';
const c = loadConfig(), target = resolve(process.argv[2]);
mkdirSync(target, { recursive: false, mode: 0o700 });
const here = dirname(fileURLToPath(import.meta.url));
const files = new Map(['common.sh', 'backend.sh', 'edge.sh'].map(name => [name, readFileSync(resolve(here, name))]));
files.set('nginx-dev.conf', Buffer.from(nginxConfig(c, 'dev')));
files.set('nginx-review.conf', Buffer.from(nginxConfig(c, 'review')));
// All interpolated values were validated by configure(); private values are not included.
files.set('environment.sh', Buffer.from(`retained=/home/phuclam/idea-nginx-dev-20261008-49
nginx=$retained/package/usr/sbin/nginx
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
jar=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
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
