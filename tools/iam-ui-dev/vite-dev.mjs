import { readFileSync } from "node:fs";
import { createHash, X509Certificate } from "node:crypto";
import { Agent } from "node:https";
import { pathToFileURL } from "node:url";

const owned = "/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44";
const root = owned + "/source/apps/web";
const tls = "/home/phuclam/idea-iam-ui-20261007-46/tls-01";
const certificateBytes = readFileSync(tls + "/fixture.cer");
if (createHash("sha256").update(certificateBytes).digest("hex") !== "6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad") throw new Error("TLS pin drift");
const certificate = new X509Certificate(certificateBytes);
if (Date.now() < Date.parse(certificate.validFrom) || Date.now() >= Date.parse(certificate.validTo)) throw new Error("Test certificate is not currently valid");
const { createServer } = await import(pathToFileURL(root + "/node_modules/vite/dist/node/index.js"));
const { default: react } = await import(pathToFileURL(root + "/node_modules/@vitejs/plugin-react/dist/index.js"));
const server = await createServer({
  root, configFile: false, plugins: [react()], cacheDir: owned + "/vite-cache",
  server: {
    host: "127.0.0.1", port: 5173, strictPort: true,
    https: { pfx: readFileSync(tls + "/fixture.p12"), passphrase: readFileSync(tls + "/password.private", "utf8").trim() },
    proxy: { "/api": {
      target: "https://127.0.0.1:18446", secure: true,
      agent: new Agent({ ca: certificate.toString(), rejectUnauthorized: true }),
    } },
  },
});
await server.listen();
console.log("IAM_DEV_VITE=RUNNING;HTTPS=true;API=REAL_SERVER;BIND=127.0.0.1:5173");
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, async () => { await server.close(); process.exit(0); });
