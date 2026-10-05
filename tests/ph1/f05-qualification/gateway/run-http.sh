#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 2 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^(red|green)$ ]] || exit 2
owned=/home/phuclam/idea-f05-sprint-20261005-37/gateway-boot-03/source
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" && ! -e "$owned/run/harness" ]] || exit 3
cd "$owned"
sha256sum -c tests/ph1/f05-qualification/gateway/inputs.sha256 > run/http-source-preflight.log
jdk=/opt/idea/tools/jdk-25.0.4.1+1
[[ $(sha256sum "$jdk/bin/javac" | cut -d' ' -f1) == 86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e ]] || exit 4
mkdir -m 700 run/harness
"$jdk/bin/javac" -cp run/application/target/classes -d run/harness \
  tests/ph1/f05-qualification/gateway/GatewayTlsMaterial.java \
  tests/ph1/f05-qualification/gateway/GatewayHttpQualification.java \
  apps/gateway/src/test/java/com/idea/ddm/gateway/GatewayTransferTest.java
"$jdk/bin/java" -Djava.net.preferIPv4Stack=true -cp run/harness:run/application/target/classes GatewayTlsMaterial "$1" > run/tls-preparation.log 2>&1
cat run/tls-preparation.log
freeze=$(sha256sum run/tls-freeze.txt | cut -d' ' -f1)
"$jdk/bin/java" -Djava.net.preferIPv4Stack=true -cp run/harness:run/application/target/classes GatewayHttpQualification "$1" "$freeze" > run/http-result-private.log 2>&1
if [[ $2 == red ]]; then grep -q GATEWAY_HTTP_RED=EXPECTED_MISSING_BEHAVIOR run/http-result-private.log
else grep -q GATEWAY_HTTP_GREEN=PASS run/http-result-private.log; fi
cat run/http-result-private.log
sha256sum run/http-result-private.log run/http-cleanup.txt
sha256sum -c tests/ph1/f05-qualification/gateway/inputs.sha256 > run/http-source-postflight.log
