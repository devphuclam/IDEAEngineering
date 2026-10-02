#!/usr/bin/env bash
# Qualification-only configuration fixture. Never change the Windows trust store.
set -euo pipefail
set +x
umask 077
root=/home/phuclam/.local/share/idea/dev-preview-26
marker="$root/tls-refusal.fixture"
password_file=/home/phuclam/idea-f03b-web-tls-739db09df96d4d97ac69fce17bc32fae/store-password
[[ -d $root && ! -L $root && $(stat -c '%a:%u' "$root") == "700:$(id -u)" ]]
[[ ! -L $root/runtime.env && $(stat -c '%a:%u' "$root/runtime.env") == "600:$(id -u)" ]]
case ${1:-} in
  prepare)
    [[ ! -e $marker && ! -L $marker ]] || { echo 'ABORT TLS fixture already exists'; exit 2; }
    [[ -z $(ss -H -ltn 'sport = :18444') && ! -e $root/runtime.state ]] || { echo 'ABORT stop the owned preview first'; exit 2; }
    [[ ! -L $password_file && $(stat -c '%a:%u' "$password_file") == "600:$(id -u)" ]]
    fixture=$(mktemp -d "$root/tls-refusal.XXXXXXXX")
    swapped=false
    prepared=false
    cleanup_failed_prepare() {
      if [[ $prepared == false ]]; then
        if [[ $swapped == true ]]; then cp -p -- "$fixture/original.env" "$root/runtime.env"; fi
        rm -f -- "$fixture/original.env" "$fixture/test.env" "$fixture/untrusted.p12" "$fixture/keytool.log" "$marker"
        rmdir -- "$fixture"
      fi
    }
    trap cleanup_failed_prepare EXIT
    cp -p -- "$root/runtime.env" "$fixture/original.env"
    original_hash=$(sha256sum "$fixture/original.env" | cut -d ' ' -f 1)
    /opt/idea/tools/jdk-25.0.4.1+1/bin/keytool -genkeypair -noprompt -alias idea-t043 -keyalg RSA -keysize 2048 -validity 1 \
      -dname 'CN=IDEA untrusted launcher qualification' -ext 'SAN=dns:localhost,ip:127.0.0.1' \
      -storetype PKCS12 -keystore "$fixture/untrusted.p12" -storepass:file "$password_file" \
      >"$fixture/keytool.log" 2>&1
    cp -p -- "$fixture/original.env" "$fixture/test.env"
    printf '\nIDEA_SERVER_TLS_KEY_STORE=%s\nIDEA_SERVER_TLS_KEY_ALIAS=idea-t043\n' "$fixture/untrusted.p12" >> "$fixture/test.env"
    test_hash=$(sha256sum "$fixture/test.env" | cut -d ' ' -f 1)
    printf '%s\n%s\n%s\n' "$fixture" "$original_hash" "$test_hash" > "$marker"
    cp -p -- "$fixture/test.env" "$root/runtime.env"
    swapped=true
    prepared=true
    echo 'TLS_REFUSAL_FIXTURE_PREPARED; untrusted localhost certificate, no trust bypass'
    ;;
  restore)
    [[ -f $marker && ! -L $marker && $(stat -c '%a:%u' "$marker") == "600:$(id -u)" ]] || { echo 'ABORT no owned TLS fixture'; exit 2; }
    mapfile -t receipt < "$marker"
    [[ ${#receipt[@]} == 3 && ${receipt[0]} =~ ^/home/phuclam/\.local/share/idea/dev-preview-26/tls-refusal\.[A-Za-z0-9]{8}$ && ${receipt[1]} =~ ^[a-f0-9]{64}$ && ${receipt[2]} =~ ^[a-f0-9]{64}$ ]]
    fixture=${receipt[0]}
    [[ -d $fixture && ! -L $fixture && $(stat -c '%a:%u' "$fixture") == "700:$(id -u)" ]]
    [[ ! -e $root/runtime.state && -z $(ss -H -ltn 'sport = :18444') ]] || { echo 'ABORT stop the TLS fixture runtime first'; exit 2; }
    [[ $(sha256sum "$root/runtime.env" | cut -d ' ' -f 1) == "${receipt[2]}" && $(sha256sum "$fixture/original.env" | cut -d ' ' -f 1) == "${receipt[1]}" ]] || { echo 'ABORT configuration changed; backup retained for inspection'; exit 2; }
    cp -p -- "$fixture/original.env" "$root/runtime.env"
    [[ $(sha256sum "$root/runtime.env" | cut -d ' ' -f 1) == "${receipt[1]}" ]]
    rm -f -- "$fixture/original.env" "$fixture/test.env" "$fixture/untrusted.p12" "$fixture/keytool.log"
    rmdir -- "$fixture"
    rm -- "$marker"
    echo 'TLS_REFUSAL_FIXTURE_RESTORED; original configuration byte-identical; fixture key removed'
    ;;
  *) echo 'INVALID_ACTION'; exit 2 ;;
esac
