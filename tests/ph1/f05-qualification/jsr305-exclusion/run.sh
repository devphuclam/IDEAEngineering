#!/usr/bin/env bash
set -euo pipefail
umask 077
if [[ $# != 1 || ! "$1" =~ ^[0-9a-f]{40}$ ]]; then
  printf '%s\n' 'STOP: one exact published source commit required' >&2
  exit 2
fi
for name in JAVA_TOOL_OPTIONS _JAVA_OPTIONS JDK_JAVA_OPTIONS MAVEN_OPTS MAVEN_ARGS CLASSPATH; do
  if [[ -n "${!name-}" ]]; then
    printf 'STOP: unexpected injected environment %s\n' "$name" >&2
    exit 2
  fi
done
cd /home/phuclam/idea-f05a-20261003-37/jsr305-exclusion-05
sha256sum -c tests/ph1/f05-qualification/jsr305-exclusion/inputs.sha256
exec /opt/idea/tools/jdk-25.0.4.1+1/bin/java \
  tests/ph1/f05-qualification/jsr305-exclusion/Experiment.java "$1"
