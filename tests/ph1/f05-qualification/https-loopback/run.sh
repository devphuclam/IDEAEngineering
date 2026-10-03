#!/usr/bin/env bash
set -euo pipefail
umask 077
[[ $# -ge 2 && $# -le 3 && $1 =~ ^[0-9a-f]{40}$ ]] || { echo 'STOP: source/phase arguments'; exit 2; }
for name in JAVA_TOOL_OPTIONS _JAVA_OPTIONS JDK_JAVA_OPTIONS MAVEN_OPTS MAVEN_ARGS CLASSPATH MAVEN_EXT_CLASS_PATH MAVEN_PROJECTBASEDIR; do
  [[ -z ${!name-} ]] || { echo 'STOP: injected environment'; exit 2; }
done
cd /home/phuclam/idea-f05a-20261003-37/https-qualification-01
sha256sum -c tests/ph1/f05-qualification/https-loopback/inputs.sha256
case "$2" in
 build)
  [[ $# == 2 ]] || exit 2
  exec /opt/idea/tools/jdk-25.0.4.1+1/bin/java tests/ph1/f05-qualification/https-loopback/Experiment.java "$1"
  ;;
 prepare)
  [[ $# == 2 ]] || exit 2
  exec /opt/idea/tools/jdk-25.0.4.1+1/bin/java -Djava.net.preferIPv4Stack=true tests/ph1/f05-qualification/https-loopback/TlsQualification.java "$1" prepare
  ;;
 probe)
  [[ $# == 3 && $3 =~ ^[0-9a-f]{64}$ ]] || exit 2
  exec /opt/idea/tools/jdk-25.0.4.1+1/bin/java -Djava.net.preferIPv4Stack=true tests/ph1/f05-qualification/https-loopback/TlsQualification.java "$1" probe "$3"
  ;;
 *) echo 'STOP: unknown phase'; exit 2 ;;
esac
