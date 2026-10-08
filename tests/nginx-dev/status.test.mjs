import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const launcher = fileURLToPath(new URL('../../deploy/development/nginx/launch.ps1', import.meta.url));
const result = spawnSync('powershell.exe', ['-NoProfile', '-File', launcher, '-Action', 'Status'], {
  encoding: 'utf8', windowsHide: true, timeout: 25000,
});
assert.equal(result.status, 0, 'Read-only Status must report the owned Nginx entry');
assert.match(result.stdout, /NGINX_DEV_STATE=(NOT_PROVISIONED|STOPPED|RUNNING)/);
assert.doesNotMatch(result.stdout, /(?:adminPassword|memberPassword|ordinaryPassword|BEGIN.*PRIVATE KEY)/);
console.log('NGINX_READ_ONLY_STATUS=PASS');
