#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 3 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ && $3 =~ ^gateway-(red|green)-[0-9]{2}$ ]] || exit 2
owned=/home/phuclam/idea-f05-sprint-20261005-37/$3
source_root="$owned/source"
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" && $(realpath -e "$source_root") == "$source_root" ]] || exit 3
[[ ! -e "$owned/classes" && ! -e "$owned/vault-test" && ! -e "$owned/result-private.log" ]] || exit 4
[[ -z $(find "$source_root" -type l -print -quit) ]] || exit 5
manifest="$source_root/tests/ph1/f05-qualification/gateway/inputs.sha256"
[[ $(sha256sum "$manifest" | cut -d' ' -f1) == "$2" ]] || exit 6
cd "$source_root"
sha256sum -c "$manifest" > "$owned/source-preflight.log"
jdk=/opt/idea/tools/jdk-25.0.4.1+1
[[ $(sha256sum "$jdk/bin/java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 7
[[ $(sha256sum "$jdk/bin/javac" | cut -d' ' -f1) == 86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e ]] || exit 7
unset JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH
mkdir -m 700 "$owned/classes" "$owned/vault-test"
"$jdk/bin/javac" -d "$owned/classes" \
  apps/gateway/src/main/java/com/idea/ddm/gateway/security/GatewayEnvelope.java \
  apps/gateway/src/main/java/com/idea/ddm/gateway/security/TransferGrantVerifier.java \
  apps/gateway/src/test/java/com/idea/ddm/gateway/GatewayTransferTest.java
set +e
"$jdk/bin/java" -cp "$owned/classes" com.idea.ddm.gateway.GatewayTransferTest "$owned/vault-test" > "$owned/result-private.log" 2>&1
status=$?
set -e
sha256sum -c "$manifest" > "$owned/source-postflight.log"
[[ $(sha256sum "$jdk/bin/java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 7
[[ $(sha256sum "$jdk/bin/javac" | cut -d' ' -f1) == 86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e ]] || exit 7
if [[ $3 == gateway-red-* ]]; then
  [[ $status != 0 ]] && grep -Eq 'GRANT_VERIFIER_NOT_IMPLEMENTED' "$owned/result-private.log" || exit 8
  printf 'GATEWAY_RED=EXPECTED_MISSING_BEHAVIOR; SOURCE=%s\n' "$1"
else
  [[ $status == 0 ]] && grep -q 'GATEWAY_TRACER=PASS' "$owned/result-private.log" || exit 8
  printf 'GATEWAY_GREEN=PASS; SOURCE=%s\n' "$1"
fi
sha256sum "$owned/result-private.log"
# Retain owned test bytes privately for review; no broad recursive delete or real Vault cleanup.
