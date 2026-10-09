// Connection configuration belongs to the edge, not to browser code or IAM.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const defaults = {
  publicOrigin: 'https://localhost:18448',
  backendOrigin: 'https://127.0.0.1:18449', backendTlsName: 'localhost',
  frontendOrigin: 'http://127.0.0.1:18450', frontendPort: 5175,
  sshHost: '192.168.137.33', sshUser: 'phuclam',
  remoteRoot: '/home/phuclam/idea-dev-access-20261009-51-04',
  certificate: '/home/phuclam/idea-nginx-dev-20261008-49/tls/certificate.pem',
  encryptedKey: '/home/phuclam/idea-nginx-dev-20261008-49/tls/key.encrypted.pem',
  tlsPasswordFile: '/home/phuclam/idea-iam-ui-20261007-46/tls-01/password.private',
  backendCa: '/home/phuclam/idea-nginx-dev-20261008-49/tls/certificate.pem',
  frontendCa: '/home/phuclam/idea-nginx-dev-20261008-49/tls/certificate.pem',
};

function origin(value, loopbackHttp = false) {
  const url = new URL(value);
  if (value !== url.origin || url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      !/^[a-zA-Z0-9.-]+$/.test(url.hostname) ||
      (url.protocol !== 'https:' && !(loopbackHttp && url.protocol === 'http:' && url.hostname === '127.0.0.1'))) {
    throw new Error('Use an HTTPS origin; HTTP is allowed only for the loopback SSH frontend endpoint');
  }
  return url;
}

export function configure(input = defaults) {
  for (const key of Object.keys(input)) if (!(key in defaults)) throw new Error(`Unknown setting: ${key}`);
  const config = { ...defaults, ...input };
  // URL parsing removes some controls; shell/Nginx generation must never receive
  // the unvalidated original bytes (including a trailing newline in a path).
  for (const [key, value] of Object.entries(config)) {
    if (key !== 'frontendPort' && (typeof value !== 'string' || /[^\x21-\x7e]/u.test(value))) throw new Error(`Invalid raw setting: ${key}`);
  }
  origin(config.publicOrigin); origin(config.backendOrigin); origin(config.frontendOrigin, true);
  for (const key of ['backendTlsName', 'sshHost', 'sshUser']) {
    if (!/^[a-zA-Z0-9._-]+$/.test(config[key])) throw new Error(`Invalid ${key}`);
  }
  for (const key of ['remoteRoot', 'certificate', 'encryptedKey', 'tlsPasswordFile', 'backendCa', 'frontendCa']) {
    if (!/^\/home\/[a-zA-Z0-9_./-]+$/.test(config[key]) || config[key].split('/').includes('..')) throw new Error(`Invalid ${key}`);
  }
  if (!Number.isInteger(config.frontendPort) || config.frontendPort < 1024 || config.frontendPort > 65535) throw new Error('Invalid frontend port');
  // This development controller must never expose the edge on a LAN interface.
  if (!['localhost', '127.0.0.1'].includes(new URL(config.publicOrigin).hostname)) throw new Error('Dev public origin must be loopback');
  return config;
}

export function loadConfig() {
  return configure(process.env.IDEA_DEV_CONFIG ? JSON.parse(readFileSync(process.env.IDEA_DEV_CONFIG, 'utf8')) : defaults);
}

export function nginxConfig(input, mode) {
  const c = configure(input);
  if (!['dev', 'review'].includes(mode)) throw new Error('Explicit dev/review mode required');
  const publicUrl = new URL(c.publicOrigin), authority = publicUrl.host, port = publicUrl.port || '443';
  const backend = `proxy_pass ${c.backendOrigin};
      proxy_ssl_trusted_certificate ${c.backendCa};
      proxy_ssl_verify on; proxy_ssl_verify_depth 1;
      proxy_ssl_name ${c.backendTlsName}; proxy_ssl_server_name on;`;
  const headers = `proxy_http_version 1.1;
      proxy_set_header Host $http_host;
      proxy_set_header Forwarded "";
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto https;
      proxy_set_header X-Forwarded-Host $http_host;
      proxy_set_header X-Forwarded-Port ${port};
      proxy_next_upstream off; proxy_cache off; proxy_buffering off;
      proxy_max_temp_file_size 0; proxy_connect_timeout 3s; proxy_read_timeout 60s;`;
  const frontend = new URL(c.frontendOrigin);
  const tls = frontend.protocol === 'https:' ? `proxy_ssl_trusted_certificate ${c.frontendCa};
      proxy_ssl_verify on; proxy_ssl_name ${frontend.hostname}; proxy_ssl_server_name on;` : '';
  const locations = mode === 'review' ? `location / { ${backend} ${headers} proxy_set_header Connection ""; }` : `
    location ~ ^/(api|dev-api|health|webjars)(/|$) { ${backend} ${headers} proxy_set_header Connection ""; }
    location / {
      proxy_pass ${c.frontendOrigin}; ${tls} ${headers}
      proxy_set_header Cookie "";
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }`;
  return `daemon off;
master_process on;
worker_processes 1;
pid nginx.pid;
error_log logs/nginx-private.log error;
events { worker_connections 256; }
http {
  access_log off; server_tokens off;
  client_body_temp_path temp/client; proxy_temp_path temp/proxy;
  fastcgi_temp_path temp/fastcgi; uwsgi_temp_path temp/uwsgi; scgi_temp_path temp/scgi;
  map $http_host $known_host { default 0; "${authority}" 1; }
  map "$http_host|$http_origin" $same_origin {
    default 0; "${authority}|" 1; "${authority}|${c.publicOrigin}" 1;
  }
  ${mode === 'dev' ? 'map $http_upgrade $connection_upgrade { default upgrade; "" close; }' : ''}
  server {
    listen 127.0.0.1:${port} ssl;
    server_name ${publicUrl.hostname};
    ssl_certificate ${c.certificate}; ssl_certificate_key ${c.encryptedKey};
    ssl_password_file ${c.tlsPasswordFile};
    ssl_protocols TLSv1.2 TLSv1.3; ssl_session_tickets off;
    if ($known_host = 0) { return 400; }
    if ($same_origin = 0) { return 403; }
    ${locations}
  }
}
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv[2] === 'json') process.stdout.write(JSON.stringify(loadConfig()));
  else process.stdout.write(nginxConfig(loadConfig(), process.argv[2]));
}
