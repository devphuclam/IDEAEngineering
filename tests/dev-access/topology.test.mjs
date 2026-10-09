import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaults, configure, nginxConfig } from '../../tools/dev-access/topology.mjs';

test('Web and Server upstream hosts are independently configurable', () => {
  const config = configure({ ...defaults, backendOrigin: 'https://server.internal:9443',
    backendTlsName: 'server.internal', frontendOrigin: 'https://web.internal:5173' });
  const output = nginxConfig(config, 'dev');
  assert.match(output, /proxy_pass https:\/\/server\.internal:9443;/);
  assert.match(output, /proxy_pass https:\/\/web\.internal:5173;/);
  assert.match(output, /proxy_ssl_verify on;/);
  assert.match(output, /Upgrade \$http_upgrade/);
  assert.doesNotMatch(output, /Access-Control-Allow-Origin/);
});

test('review mode never routes UI to Vite; dev mode never silently serves bundled Web', () => {
  const config = configure(defaults);
  assert.doesNotMatch(nginxConfig(config, 'review'), /18450|__vite_hmr|Upgrade/);
  assert.match(nginxConfig(config, 'dev'), /proxy_pass http:\/\/127\.0\.0\.1:18450;/);
  assert.doesNotMatch(nginxConfig(config, 'dev'), /error_page|proxy_next_upstream on/);
});

test('reject unencrypted remote upstreams and config injection', () => {
  for (const change of [{ backendOrigin: 'http://server.internal:8080' },
    { frontendOrigin: 'http://192.168.1.8:5173' },
    { backendOrigin: 'https://localhost:18449/path' },
    { backendTlsName: 'localhost; proxy_ssl_verify off' }]) {
    assert.throws(() => configure({ ...defaults, ...change }));
  }
});

test('reject raw controls even when URL parsing or regex anchors would normalize them', () => {
  for (const key of ['publicOrigin', 'backendOrigin', 'frontendOrigin', 'backendTlsName', 'sshHost', 'remoteRoot', 'certificate']) {
    for (const control of ['\n', '\r', '\t', ' ']) assert.throws(() => configure({ ...defaults, [key]: defaults[key] + control }));
  }
  assert.throws(() => configure({ ...defaults, backendOrigin: 'https://a.\nid' }));
  assert.throws(() => configure({ ...defaults, backendOrigin: null }));
});
