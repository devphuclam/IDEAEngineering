#!/usr/bin/env bash
set -euo pipefail
controller=${1:?Provide controller path}
fixture=$(mktemp -d)
trap 'rmdir -- "$fixture"' EXIT
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" SPRING_DATASOURCE_URL=SYNTHETIC_OVERRIDE bash "$controller" start 2>&1)
code=$?
set -e
if [[ $code != 2 || $output != 'BACKEND_ERROR=ENVIRONMENT_OVERRIDE_REFUSED; Start requires controlled preview configuration.' ]]; then
  echo "FAIL inherited database configuration must refuse Start before provisioning (got $code)"
  exit 1
fi
[[ -z $(ls -A "$fixture") ]] || { echo 'FAIL refusal created runtime state'; exit 1; }
echo 'PASS inherited database override refuses Start without echoing its value or creating state'
for name in SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD SPRING_CONFIG_LOCATION SPRING_CONFIG_ADDITIONAL_LOCATION SPRING_PROFILES_ACTIVE SPRING_APPLICATION_JSON SERVER_PORT SERVER_SSL_ENABLED JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS spring_datasource_url spring.datasource.url; do
  set +e
  output=$(env IDEA_PREVIEW_ROOT="$fixture" "$name=SYNTHETIC_OVERRIDE" bash "$controller" start 2>&1)
  code=$?
  set -e
  if [[ $code != 2 || $output != 'BACKEND_ERROR=ENVIRONMENT_OVERRIDE_REFUSED; Start requires controlled preview configuration.' ]]; then
    echo "FAIL configuration override $name did not refuse Start (got $code)"; exit 1
  fi
done
echo 'PASS Spring, servlet and JVM override profiles refuse Start without leaking values'
for action in status stop; do
  set +e
  output=$(IDEA_PREVIEW_ROOT="$fixture" SPRING_DATASOURCE_URL=SYNTHETIC_OVERRIDE bash "$controller" "$action" 2>&1)
  code=$?
  set -e
  if [[ $code != 3 || $output != 'BACKEND_STATE=NOT_PROVISIONED' ]]; then
    echo "FAIL override guard must not prevent $action from inspecting provisioning (got $code)"; exit 1
  fi
done
[[ -z $(ls -A "$fixture") ]] || { echo 'FAIL override probes created runtime state'; exit 1; }
echo 'PASS override guard leaves Status/Stop available and preview state untouched'
