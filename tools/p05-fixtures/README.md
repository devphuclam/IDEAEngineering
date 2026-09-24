# P05 synthetic fixture generator

This first-party script prepares the P05 transfer and digest files with Node.js 24 built-ins. It
does not add packages or create valid CAD/Office documents. The expected byte sizes and SHA-256
values are recorded in
[`expected-artifact-digests.json`](../../specs/004-technical-pilot-readiness/fixtures/expected-artifact-digests.json).

The approved server target is `/srv/idea/artifacts/p05-fixtures`, beside (not inside)
`/srv/idea/artifacts/vault-01`. The output directory must be empty. The generator refuses to
overwrite existing files.

From Windows PowerShell, copy the script to the server's temporary directory, using the server's
current DHCP address:

```powershell
# Replace SERVER_IP with the value from hostname -I in the current SSH session.
$serverIp = "SERVER_IP"
scp -i "$env:USERPROFILE\.ssh\idea_ddm_dev_ed25519" .\tools\p05-fixtures\generate-fixtures.mjs "phuclam@${serverIp}:/tmp/idea-p05-generate.mjs"
```

Copy the guarded runner too. It verifies the staged generator checksum before creating anything:

```powershell
scp -i "$env:USERPROFILE\.ssh\idea_ddm_dev_ed25519" .\tools\p05-fixtures\run-on-server.sh "phuclam@${serverIp}:/tmp/idea-p05-run.sh"
```

In the existing Ubuntu SSH terminal, run this one command. Enter the `sudo` password only in that
terminal. The runner stops if the target or evidence path already exists. It creates the files as
`idea-server`, checks size, owner and SHA-256, and leaves a readable evidence record in
`/home/phuclam/idea-p05-evidence-2026-09-24.txt`:

```bash
sudo bash /tmp/idea-p05-run.sh
```

The equivalent manual steps are:

```bash
if sudo test -e /srv/idea/artifacts/p05-fixtures; then
  echo 'P05 target already exists; stop and inspect it before proceeding.'
else
  sudo install -d -o idea-server -g idea-server -m 0700 /srv/idea/artifacts/p05-fixtures &&
  sudo -u idea-server /opt/idea/tools/node-v24.21.0-linux-x64/bin/node /tmp/idea-p05-generate.mjs &&
  sudo stat -c '%a %U:%G %n' /srv/idea/artifacts/p05-fixtures &&
  sudo find /srv/idea/artifacts/p05-fixtures -maxdepth 1 -type f -printf '%m %U:%G %s %p\n' &&
  sudo sha256sum /srv/idea/artifacts/p05-fixtures/IE-DATA-CANONICAL-001-small-1KiB.bin /srv/idea/artifacts/p05-fixtures/IE-DATA-CANONICAL-001-transfer-64MiB.bin &&
  sudo cat /srv/idea/artifacts/p05-fixtures/manifest.json &&
  rm -f /tmp/idea-p05-generate.mjs
fi
```

Keep the server `manifest.json` as the run record. P05 is complete
only after the server file sizes, hashes, ownership and manifest have been reviewed. Review and
delete the generated fixture files by 2027-01-31; record any extension before that date.
