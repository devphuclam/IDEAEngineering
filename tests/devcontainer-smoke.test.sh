#!/usr/bin/env bash

set -u

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
workspace_folder=$repo_root
cleanup_required=0
cleanup_status=0
cleanup_id_label=

usage() {
  printf '%s\n' 'Usage: bash tests/devcontainer-smoke.test.sh [--self-test]' >&2
}

cleanup_smoke() {
  local docker_command=${DOCKER_COMMAND:-docker}
  local container_ids
  local container_id

  if [ "$cleanup_required" -ne 1 ]; then
    return 0
  fi

  cleanup_required=0
  if ! container_ids=$("$docker_command" container ls --all --filter "label=$cleanup_id_label" --format '{{.ID}}' 2>/dev/null); then
    printf '%s\n' 'ERROR [DEVCONTAINER_CLEANUP] Unable to list the Dev Container workspace' >&2
    cleanup_status=1
    return 1
  fi

  for container_id in $container_ids; do
    if ! "$docker_command" rm -f "$container_id" >/dev/null 2>&1; then
      printf '%s\n' 'ERROR [DEVCONTAINER_CLEANUP] Unable to remove the Dev Container workspace' >&2
      cleanup_status=1
      return 1
    fi
  done

  cleanup_id_label=
  if [ -z "$container_ids" ]; then
    return 0
  fi

  return 0
}

on_exit() {
  local status=$?

  cleanup_smoke || true
  if [ "$status" -eq 0 ] && [ "$cleanup_status" -ne 0 ]; then
    status=$cleanup_status
  fi
  exit "$status"
}

trap on_exit EXIT

run_smoke() {
  local devcontainer_command=${DEVCONTAINER_COMMAND:-devcontainer}
  local docker_command=${DOCKER_COMMAND:-docker}
  local command_status
  local runtime_doctor_output
  local runtime_marker
  local -a config_args=()

  if [ -n "${DEVCONTAINER_CONFIG:-}" ]; then
    config_args=(--config "$DEVCONTAINER_CONFIG")
  fi

  if ! command -v "$devcontainer_command" >/dev/null 2>&1; then
    printf 'ERROR [DEVCONTAINER_TOOL] Missing Development Containers CLI: %s\n' "$devcontainer_command" >&2
    return 1
  fi

  if ! "$docker_command" info >/dev/null 2>&1; then
    printf '%s\n' 'ERROR [DEVCONTAINER_RUNTIME] Docker-compatible runtime is unavailable or its daemon is not running' >&2
    return 1
  fi

  cleanup_id_label=${SMOKE_ID_LABEL:-devcontainer.smoke=$$_${RANDOM}}
  cleanup_required=1

  "$devcontainer_command" up --workspace-folder "$workspace_folder" --id-label "$cleanup_id_label" "${config_args[@]}"
  command_status=$?
  if [ "$command_status" -ne 0 ]; then
    printf '%s\n' 'ERROR [DEVCONTAINER_START] Unable to create or start the Dev Container' >&2
    return "$command_status"
  fi

  "$devcontainer_command" exec --workspace-folder "$workspace_folder" --id-label "$cleanup_id_label" "${config_args[@]}" ./scripts/verify-template
  command_status=$?
  if [ "$command_status" -ne 0 ]; then
    printf '%s\n' 'ERROR [DEVCONTAINER_VERIFY] The Core verifier failed inside the Dev Container' >&2
    return "$command_status"
  fi

  if [ -n "${DEVCONTAINER_CONFIG:-}" ]; then
    runtime_doctor_output=$("$devcontainer_command" exec --workspace-folder "$workspace_folder" --id-label "$cleanup_id_label" "${config_args[@]}" bash tools/agent-workspace/scripts/runtime-doctor.sh 2>&1)
    command_status=$?
    printf '%s\n' "$runtime_doctor_output"
    if [ "$command_status" -ne 0 ]; then
      printf '%s\n' 'ERROR [DEVCONTAINER_RUNTIME_DOCTOR] The Agent Workspace runtime doctor failed inside the selected Dev Container' >&2
      return "$command_status"
    fi
    for runtime_marker in '"platform":"Linux"' '"linuxDevContainer":true' '"nodeMajor":24' '"node24OrNewer":true' '"gitRepository":true' '"lockfile":true'; do
      if [[ "$runtime_doctor_output" != *"$runtime_marker"* ]]; then
        printf 'ERROR [DEVCONTAINER_RUNTIME_DOCTOR] Runtime doctor output is missing required marker: %s\n' "$runtime_marker" >&2
        return 1
      fi
    done

    "$devcontainer_command" exec --workspace-folder "$workspace_folder" --id-label "$cleanup_id_label" "${config_args[@]}" npm --prefix tools/agent-workspace ci --ignore-scripts
    command_status=$?
    if [ "$command_status" -ne 0 ]; then
      printf '%s\n' 'ERROR [DEVCONTAINER_PACKAGE_INSTALL] The Agent Workspace package install failed inside the selected Dev Container' >&2
      return "$command_status"
    fi
  fi

  return 0
}

test_missing_devcontainer_cli() {
  local missing_command="devcontainer-missing-$$_${RANDOM}"
  local output
  local status

  output=$(DEVCONTAINER_COMMAND="$missing_command" DOCKER_COMMAND=sh run_smoke 2>&1)
  status=$?
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER_TOOL"* ]]; then
    printf '%s\n' 'ok - reports a missing Dev Container CLI'
    return 0
  fi

  printf '%s\n' 'not ok - reports a missing Dev Container CLI'
  return 1
}

test_unreachable_docker_daemon() {
  local shim_directory
  local docker_shim
  local output
  local status

  shim_directory=$(mktemp -d)
  docker_shim="$shim_directory/docker-unavailable"
  printf '%s\n' '#!/usr/bin/env bash' 'exit 1' > "$docker_shim"
  chmod +x "$docker_shim"
  output=$(DEVCONTAINER_COMMAND=sh DOCKER_COMMAND="$docker_shim" run_smoke 2>&1)
  status=$?
  rm -rf "$shim_directory"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER_RUNTIME"* ]]; then
    printf '%s\n' 'ok - reports an unavailable Docker daemon'
    return 0
  fi

  printf '%s\n' 'not ok - reports an unavailable Docker daemon'
  return 1
}

test_cleans_after_failed_start() {
  local shim_directory
  local devcontainer_shim
  local docker_shim
  local docker_log
  local output_file
  local output
  local status

  shim_directory=$(mktemp -d)
  devcontainer_shim="$shim_directory/devcontainer-fails"
  docker_shim="$shim_directory/docker-records-cleanup"
  docker_log="$shim_directory/docker.log"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'if [ "${1-}" = "up" ]; then exit 17; fi' \
    'exit 1' > "$devcontainer_shim"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'if [ "${1-}" = "info" ]; then exit 0; fi' \
    'if [ "${1-}" = "container" ] && [ "${2-}" = "ls" ]; then printf "%s\\n" "fake-container"; exit 0; fi' \
    'if [ "${1-}" = "rm" ]; then printf "%s\\n" "$*" > "$SMOKE_DOCKER_LOG"; exit 0; fi' \
    'exit 1' > "$docker_shim"
  chmod +x "$devcontainer_shim" "$docker_shim"

  output_file="$shim_directory/output.log"
  DEVCONTAINER_COMMAND="$devcontainer_shim"
  DOCKER_COMMAND="$docker_shim"
  SMOKE_ID_LABEL='devcontainer-smoke-test=failure'
  SMOKE_DOCKER_LOG="$docker_log"
  export SMOKE_DOCKER_LOG
  run_smoke > "$output_file" 2>&1
  status=$?
  cleanup_smoke || true
  output=$(cat "$output_file")

  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER_START"* ]] && [ -s "$docker_log" ] && [[ "$(cat "$docker_log")" == *"fake-container"* ]]; then
    rm -rf "$shim_directory"
    printf '%s\n' 'ok - cleans the labeled container after a failed start'
    return 0
  fi

  rm -rf "$shim_directory"
  printf '%s\n' 'not ok - cleans the labeled container after a failed start'
  return 1
}

test_forwards_selected_devcontainer_config() {
  local shim_directory
  local devcontainer_shim
  local docker_shim
  local devcontainer_log
  local output
  local status

  shim_directory=$(mktemp -d)
  devcontainer_shim="$shim_directory/devcontainer-records-config"
  docker_shim="$shim_directory/docker-available"
  devcontainer_log="$shim_directory/devcontainer.log"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'printf "%s\\n" "$*" >> "$SMOKE_DEVCONTAINER_LOG"' \
    'if [[ "$*" == *runtime-doctor.sh* ]]; then printf "%s\\n" '\''{"platform":"Linux","linuxDevContainer":true,"nodeMajor":24,"node24OrNewer":true,"gitRepository":true,"lockfile":true}'\''; fi' \
    'exit 0' > "$devcontainer_shim"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'if [ "${1-}" = "info" ]; then exit 0; fi' \
    'if [ "${1-}" = "container" ] && [ "${2-}" = "ls" ]; then exit 0; fi' \
    'exit 0' > "$docker_shim"
  chmod +x "$devcontainer_shim" "$docker_shim"

  output_file="$shim_directory/output.log"
  DEVCONTAINER_COMMAND="$devcontainer_shim"
  DOCKER_COMMAND="$docker_shim"
  DEVCONTAINER_CONFIG='.devcontainer/agent-workspace/devcontainer.json'
  SMOKE_DEVCONTAINER_LOG="$devcontainer_log"
  export SMOKE_DEVCONTAINER_LOG
  run_smoke > "$output_file" 2>&1
  status=$?
  cleanup_smoke || true
  output=$(cat "$output_file")

  if [ "$status" -eq 0 ] && [[ "$(cat "$devcontainer_log")" == *"--config .devcontainer/agent-workspace/devcontainer.json"* ]]; then
    rm -rf "$shim_directory"
    printf '%s\n' 'ok - forwards the selected Dev Container configuration'
    return 0
  fi

  rm -rf "$shim_directory"
  printf '%s\n' 'not ok - forwards the selected Dev Container configuration'
  return 1
}

run_self_tests() {
  local failures=0

  test_missing_devcontainer_cli || failures=$((failures + 1))
  test_unreachable_docker_daemon || failures=$((failures + 1))
  test_cleans_after_failed_start || failures=$((failures + 1))
  test_forwards_selected_devcontainer_config || failures=$((failures + 1))
  printf 'SMOKE_SELF_TESTS failures=%d\n' "$failures"
  return "$failures"
}

case "${1-}" in
  '')
    run_smoke
    ;;
  --self-test)
    run_self_tests
    ;;
  --help)
    usage
    exit 0
    ;;
  *)
    printf 'ERROR [USAGE] Unknown argument: %s\n' "$1" >&2
    usage
    exit 2
    ;;
esac
