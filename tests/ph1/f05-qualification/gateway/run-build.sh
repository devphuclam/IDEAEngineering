#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 3 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ && $3 == gateway-boot-03 ]] || exit 2
owned=/home/phuclam/idea-f05-sprint-20261005-37/$3/source
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" && ! -e "$owned/run" ]] || exit 3
cd "$owned"
[[ -z $(find "$owned" -type l -print -quit) ]] || exit 4
[[ $(sha256sum tests/ph1/f05-qualification/gateway/inputs.sha256 | cut -d' ' -f1) == "$2" ]] || exit 5
sha256sum -c tests/ph1/f05-qualification/gateway/inputs.sha256
[[ $(sha256sum /opt/idea/tools/jdk-25.0.4.1+1/bin/java | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 6
exec /opt/idea/tools/jdk-25.0.4.1+1/bin/java tests/ph1/f05-qualification/gateway/GatewayBuild.java "$1"
