#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=/home/phuclam/idea-nginx-dev-20261008-49
action=${1:-all}
[[ $# -le 1 && $action =~ ^(all|finish-tls)$ && $(id -un) == phuclam ]] || exit 2
if [[ $action == all ]]; then [[ ! -e $root ]] || exit 2
else
  [[ $(realpath -e "$root") == "$root" && $(stat -c '%U:%a' "$root") == phuclam:700 && ! -e $root/tls.sha256 && ! -e $root/backend.state && ! -e $root/nginx.state ]] || exit 2
  sha256sum --strict -c "$root/binaries.sha256" >/dev/null
  sha256sum --strict -c "$root/libraries.sha256" >/dev/null
fi
[[ $(realpath -e /home/phuclam) == /home/phuclam ]] || exit 2
for entry in \
  '/usr/bin/dpkg-deb:66a1f5c65bc66cf20a35eb0695bf783bfb365bc80a45006d8a9d97fd406536e0' \
  '/usr/bin/curl:7abff479a2c8bd06ace2d82522a8bf2b102ae917ab2a2cbfa0fc52a2178a48a6' \
  '/usr/bin/openssl:1d72cbc5bf62be3f3dbd7626c295b63c5fdc1dd8439f323ac47998d8a062b4c9'; do
  [[ $(sha256sum "${entry%%:*}" | cut -d' ' -f1) == "${entry#*:}" ]] || exit 3
done
[[ -z $(ss -H -ltn 'sport = :18448 or sport = :18449') ]] || exit 4
if [[ $action == all ]]; then
mkdir -m 700 "$root"
mkdir "$root/packages" "$root/package" "$root/notices" "$root/tls" "$root/logs" "$root/temp"
curl --proto '=https' --proto-redir '=https' --fail --silent --show-error --max-time 60 \
  https://changelogs.ubuntu.com/changelogs/pool/main/n/nginx/nginx_1.28.3-2ubuntu1.11/copyright -o "$root/notices/ubuntu-nginx-copyright"
[[ $(sha256sum "$root/notices/ubuntu-nginx-copyright" | cut -d' ' -f1) == 437401e2b26c87fbd03d3a5e6c915dbed82fe07c52863f927b34bb70dea570b0 ]] || exit 3
while read -r file expected; do
  curl --proto '=https' --proto-redir '=https' --fail --silent --show-error --max-time 60 \
    "https://archive.ubuntu.com/ubuntu/pool/main/n/nginx/$file" -o "$root/packages/$file"
  [[ $(sha256sum "$root/packages/$file" | cut -d' ' -f1) == "$expected" ]] || exit 3
  dpkg-deb -x "$root/packages/$file" "$root/package"
done <<'PACKAGES'
nginx_1.28.3-2ubuntu1.11_amd64.deb f9c3041e8952741cff93b9138322ae4d8ff0d52a9b4327f25b25f87281108997
nginx-common_1.28.3-2ubuntu1.11_all.deb 30ddbab1f1b752677c9d4f92de038be9af9ee2cafc96d87cda41659d4d5c8142
PACKAGES
cmp "$root/notices/ubuntu-nginx-copyright" "$root/package/usr/share/doc/nginx/copyright"
cp /usr/share/doc/openssl/copyright "$root/notices/openssl-copyright"
# Extraction never runs package maintainer scripts or installs system config/services.
ldd "$root/package/usr/sbin/nginx" > "$root/shared-libraries.txt"
! grep -q 'not found' "$root/shared-libraries.txt" || exit 3
while read -r library; do sha256sum "$library"; done < <(awk '/=> \// {print $3} /^\s*\/lib/ {print $1}' "$root/shared-libraries.txt") > "$root/libraries.sha256"
for component in libc6 libcrypt1 libpcre2-8-0 libssl3t64 zlib1g; do
  cp "/usr/share/doc/$component/copyright" "$root/notices/$component-copyright"
done
sha256sum "$root/package/usr/sbin/nginx" /usr/bin/openssl /usr/bin/dpkg-deb /usr/bin/curl \
  /opt/idea/tools/jdk-25.0.4.1+1/bin/java > "$root/binaries.sha256"
"$root/package/usr/sbin/nginx" -V > "$root/nginx-version-private.log" 2>&1
fi
# OpenSSL's existing shared-library closure also uses the installed Zstandard library.
cp /usr/share/doc/libzstd1/copyright "$root/notices/libzstd1-copyright"
tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
[[ $(sha256sum "$tls/fixture.p12" | cut -d' ' -f1) == cb9c804289e7d3e6b4d7e6c9f665a61194b42eac7b55146f5eecd023ef8cab2f ]] || exit 3
[[ $(sha256sum "$tls/fixture.cer" | cut -d' ' -f1) == 6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad ]] || exit 3
[[ $(stat -c '%U:%a' "$tls/password.private") == phuclam:600 ]] || exit 3
openssl x509 -inform DER -in "$tls/fixture.cer" -out "$root/tls/certificate.pem"
openssl x509 -in "$root/tls/certificate.pem" -checkend 3600 -noout >/dev/null
# Separate processes read the same private file independently. Passing the same file
# to pkcs12's passin/passout consumes two lines and fails for a one-line password.
# Unencrypted key bytes exist only in this pipe, never in a file/log or Git.
openssl pkcs12 -in "$tls/fixture.p12" -nocerts -noenc -passin "file:$tls/password.private" \
  2> "$root/logs/key-export-private.log" | \
  openssl pkey -aes-256-cbc -passout "file:$tls/password.private" -out "$root/tls/key.encrypted.pem" \
  2>> "$root/logs/key-export-private.log"
chmod 600 "$root/tls/key.encrypted.pem"
sha256sum "$root/tls/certificate.pem" "$root/tls/key.encrypted.pem" > "$root/tls.sha256"
echo 'NGINX_PROVISION=PASS;SYSTEM_INSTALL=false;SERVICE_ENABLED=false;LISTENER_STARTED=false;DATABASE_CHANGED=false'
