#!/usr/bin/env bash
#
# A wizard — walks a human through Docker Desktop + WSL recovery.
# Generated from the project-local /wizard skill.
#
# Everything above the "STAGES" marker is the wizard library: do not hand-edit
# it. Author the per-step stages below the marker.

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────
# Wizard library — delightful, consistent UX. Identical across every wizard.
# ──────────────────────────────────────────────────────────────────────────

if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
  BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0)
  BLUE=$(tput setaf 4); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3); RED=$(tput setaf 1)
else
  BOLD=""; DIM=""; RESET=""; BLUE=""; GREEN=""; YELLOW=""; RED=""
fi

# Author sets this at the top of the stages section.
TOTAL_STAGES=0

_STAGE_INDEX=0
ENV_FILE="${ENV_FILE:-.env}"
WRITTEN_ENV=()    # KEYs written to ENV_FILE this run
WRITTEN_SECRET=() # secret NAMEs set this run
SKIPPED=()        # things we couldn't do (e.g. gh missing)

# _clear — wipe the terminal so only the current step is on screen. No-op when
# output isn't a terminal, so piped logs stay readable.
_clear() {
  [[ -t 1 ]] || return 0
  if command -v tput >/dev/null 2>&1; then tput clear; else printf '\033[2J\033[3J\033[H'; fi
}

# banner "Title" — opening frame: what this wizard does.
banner() {
  _clear
  printf '\n%s%s  %s%s\n' "$BOLD" "$BLUE" "$1" "$RESET"
  printf '%s  %s stages%s\n\n' "$DIM" "$TOTAL_STAGES" "$RESET"
  printf '%s  You drive the browser; this wizard tells you exactly what to do and\n' "$DIM"
  printf '  captures the values you copy back. Stop any time with Ctrl-C and re-run\n'
  printf '  later — it remembers values already saved.%s\n' "$RESET"
  pause "Ready to start?"
}

# stage "Name" — clear the screen, then announce a stage and show progress.
# Clearing keeps only the current step on screen.
stage() {
  _clear
  _STAGE_INDEX=$((_STAGE_INDEX + 1))
  printf '\n%s%s▸ Stage %s/%s · %s%s\n' \
    "$BOLD" "$BLUE" "$_STAGE_INDEX" "$TOTAL_STAGES" "$1" "$RESET"
}

# say "..." — a plain instruction line.
say()  { printf '  %s\n' "$1"; }
# step "..." — a numbered-feeling action the human takes in the browser.
step() { printf '  %s•%s %s\n' "$BLUE" "$RESET" "$1"; }
note() { printf '  %s%s%s\n' "$DIM" "$1" "$RESET"; }
warn() { printf '  %s⚠ %s%s\n' "$YELLOW" "$1" "$RESET"; }

# open_url URL — open in the human's browser, cross-platform incl. WSL.
open_url() {
  local url="$1"
  printf '  %s↗ opening%s %s\n' "$GREEN" "$RESET" "$url"
  { if   command -v wslview     >/dev/null 2>&1; then wslview "$url"
    elif command -v explorer.exe >/dev/null 2>&1; then explorer.exe "$url"
    elif command -v xdg-open    >/dev/null 2>&1; then xdg-open "$url"
    elif command -v open        >/dev/null 2>&1; then open "$url"
    else warn "couldn't open a browser — visit it manually: $url"; fi
  } >/dev/null 2>&1 || warn "couldn't open a browser — visit it manually: $url"
}

# pause "msg" — wait for the human to confirm they've done the manual part.
pause() {
  printf '  %s%s%s ' "$DIM" "${1:-Press Enter to continue}" "$RESET"
  read -r _ || true
}

# confirm "question" — y/N gate; returns success on yes.
confirm() {
  local reply=""
  printf '  %s? %s [y/N] ' "$YELLOW" "$1"
  read -r reply || true
  [[ "$reply" =~ ^[Yy] ]]
}

# _existing KEY — current value of KEY in ENV_FILE, if any.
_existing() {
  [[ -f "$ENV_FILE" ]] || return 1
  local line; line=$(grep -E "^${1}=" "$ENV_FILE" | tail -n1) || return 1
  printf '%s' "${line#*=}"
}

# ask KEY "Prompt" — read a value into $KEY. Offers the existing .env value as
# a default on re-runs (Enter keeps it). Visible input (non-secret).
ask() {
  local key="$1" prompt="$2" current input
  current=$(_existing "$key" || true)
  if [[ -n "$current" ]]; then
    printf '  %s%s%s %s[Enter keeps current]%s ' "$BOLD" "$prompt" "$RESET" "$DIM" "$RESET"
  else
    printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"
  fi
  read -r input || true
  [[ -z "$input" && -n "$current" ]] && input="$current"
  printf -v "$key" '%s' "$input"
}

# ask_secret KEY "Prompt" — like ask, but input is hidden.
ask_secret() {
  local key="$1" prompt="$2" current input
  current=$(_existing "$key" || true)
  if [[ -n "$current" ]]; then
    printf '  %s%s%s %s[Enter keeps current]%s ' "$BOLD" "$prompt" "$RESET" "$DIM" "$RESET"
  else
    printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"
  fi
  read -rs input || true
  printf '\n'
  [[ -z "$input" && -n "$current" ]] && input="$current"
  printf -v "$key" '%s' "$input"
}

# write_env KEY VALUE — upsert KEY=VALUE into ENV_FILE (creates it; replaces
# any existing line). Idempotent.
write_env() {
  local key="$1" value="$2" tmp
  touch "$ENV_FILE"
  tmp=$(mktemp)
  grep -vE "^${key}=" "$ENV_FILE" > "$tmp" || true
  printf '%s=%s\n' "$key" "$value" >> "$tmp"
  mv "$tmp" "$ENV_FILE"
  WRITTEN_ENV+=("$key")
  printf '  %s✓ wrote%s %s → %s\n' "$GREEN" "$RESET" "$key" "$ENV_FILE"
}

# set_secret NAME VALUE — set a GitHub Actions repo secret via gh. Falls back
# to a warning (and records it) if gh is unavailable or unauthenticated.
set_secret() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    if printf '%s' "$value" | gh secret set "$name" >/dev/null 2>&1; then
      WRITTEN_SECRET+=("$name")
      printf '  %s✓ set%s GitHub secret %s\n' "$GREEN" "$RESET" "$name"
      return
    fi
  fi
  SKIPPED+=("GitHub secret $name (set it manually: gh secret set $name)")
  warn "skipped GitHub secret $name — gh not ready; set it later"
}

# set_var NAME VALUE — set a GitHub Actions repo variable (non-secret).
set_var() {
  local name="$1" value="$2"
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    if gh variable set "$name" --body "$value" >/dev/null 2>&1; then
      printf '  %s✓ set%s GitHub variable %s\n' "$GREEN" "$RESET" "$name"
      return
    fi
  fi
  SKIPPED+=("GitHub variable $name")
  warn "skipped GitHub variable $name — gh not ready; set it later"
}

# finish — clear, then a closing summary of everything configured.
finish() {
  _clear
  printf '\n%s%s  ✓ Setup complete%s\n' "$BOLD" "$GREEN" "$RESET"
  (( ${#WRITTEN_ENV[@]} ))    && note "wrote ${#WRITTEN_ENV[@]} value(s) to $ENV_FILE: ${WRITTEN_ENV[*]}"
  (( ${#WRITTEN_SECRET[@]} )) && note "set ${#WRITTEN_SECRET[@]} GitHub secret(s): ${WRITTEN_SECRET[*]}"
  if (( ${#SKIPPED[@]} )); then
    printf '\n'; warn "still to do by hand:"
    for s in "${SKIPPED[@]}"; do note "  - $s"; done
  fi
  printf '\n'
}

# ──────────────────────────────────────────────────────────────────────────
# STAGES — author this section. One stage() per step the human takes.
# Replace the example below. Set TOTAL_STAGES to match the stages you write.
# ──────────────────────────────────────────────────────────────────────────

TOTAL_STAGES=5
DISTRO="${WSL_DISTRO:-Ubuntu-24.04}"
HEALTHY=0
RESTART_REQUESTED=0

recovery_banner() {
  _clear
  printf '\n%s%s  Docker Desktop + WSL recovery%s\n' "$BOLD" "$BLUE" "$RESET"
  printf '%s  %s stages%s\n\n' "$DIM" "$TOTAL_STAGES" "$RESET"
  printf '  This wizard checks the integration and asks before stopping Docker Desktop.\n'
  printf '  It never resets Docker, unregisters a distro, or deletes images/volumes.\n\n'
  pause "Ready to start?"
}

recovery_finish() {
  _clear
  if (( HEALTHY )); then
    printf '\n%s%s  ✓ Docker Desktop + WSL integration is healthy%s\n\n' "$BOLD" "$GREEN" "$RESET"
  else
    printf '\n%s%s  ⚠ Recovery is incomplete%s\n' "$BOLD" "$YELLOW" "$RESET"
    printf '  Re-run this wizard after the manual Docker Desktop Troubleshoot step.\n\n'
  fi
}

docker_desktop() {
  if command -v docker.exe >/dev/null 2>&1; then
    docker.exe desktop "$@"
  elif command -v docker >/dev/null 2>&1; then
    docker desktop "$@"
  else
    return 127
  fi
}

run_wsl() {
  wsl.exe -d "$DISTRO" "$@"
}

check_integration() {
  local proxy_state backend_state info
  proxy_state="missing"
  backend_state="missing"

  if run_wsl -u root -- bash -lc 'test -x /run/docker-desktop/docker-desktop-user-distro' >/dev/null 2>&1; then
    proxy_state="present"
  fi
  if run_wsl -u root -- bash -lc 'test -S /mnt/wsl/docker-desktop/shared-sockets/host-services/backend.sock' >/dev/null 2>&1; then
    backend_state="present"
  fi

  printf '  proxy: %s\n' "$proxy_state"
  printf '  backend.sock: %s\n' "$backend_state"

  if info=$(run_wsl -- bash -lc "docker info --format 'server={{.ServerVersion}}'" 2>&1); then
    printf '  docker info: PASS (%s)\n' "$info"
  else
    printf '  docker info: FAIL (%s)\n' "$(printf '%s' "$info" | tr '\n' ' ')"
    return 1
  fi

  [[ "$proxy_state" == "present" && "$backend_state" == "present" ]]
}

wait_for_running() {
  local attempt status
  for ((attempt = 1; attempt <= 12; attempt++)); do
    status=$(docker_desktop status 2>&1 | tr -d '\000' || true)
    if printf '%s' "$status" | grep -Eiq 'Status[[:space:]]+running'; then
      printf '  Docker Desktop: running\n'
      return 0
    fi
    printf '  waiting for Docker Desktop (%s/12)\n' "$attempt"
    sleep 5
  done
  warn "Docker Desktop did not report running within 60 seconds."
  return 1
}

recovery_banner

stage "Preflight"
say "This wizard checks Docker Desktop WSL integration for distro: $DISTRO"
say "It never runs Factory Reset, unregisters a WSL distro, or deletes images and volumes."
if ! command -v wsl.exe >/dev/null 2>&1; then
  warn "wsl.exe is not available. Run this wizard from WSL, Git Bash, or PowerShell with bash."
  exit 1
fi
if ! command -v docker.exe >/dev/null 2>&1 && ! command -v docker >/dev/null 2>&1; then
  warn "Docker CLI is not available. Start Docker Desktop and run this wizard again."
  exit 1
fi
docker_status=$(docker_desktop status 2>&1 | tr -d '\000' || true)
printf '%s\n' "$docker_status"

stage "Diagnose current integration"
if check_integration; then
  HEALTHY=1
  say "The exact Docker/WSL failure signature is not present."
else
  warn "The Docker/WSL integration is not healthy."
fi

stage "Confirm safe restart"
if (( HEALTHY )); then
  say "No restart is required. The integration is already healthy."
else
  say "The next step stops Docker Desktop and WSL temporarily. Running containers will stop."
  if confirm "Restart Docker Desktop and WSL now?"; then
    RESTART_REQUESTED=1
    if ! docker_desktop stop --force --detach; then
      warn "Docker Desktop was already stopped or did not stop cleanly; continuing."
    fi
    wsl.exe --shutdown
    if ! docker_desktop start --detach; then
      warn "Docker Desktop could not be started by the CLI. Open Docker Desktop manually, then re-run this wizard."
    fi
  else
    warn "Restart declined. No changes were made."
  fi
fi

stage "Verify after restart"
if (( RESTART_REQUESTED )); then
  wait_for_running || true
fi
if check_integration; then
  HEALTHY=1
else
  HEALTHY=0
fi

stage "Escalate only if still failing"
if (( HEALTHY )); then
  say "Docker Desktop WSL integration is healthy. You can reopen the Dev Container."
else
  warn "The exact failure still reproduces after a safe restart."
  say "Open Docker Desktop → Troubleshoot → Restart Docker Desktop, then run this wizard again."
  say "Do not choose Factory Reset and do not unregister Ubuntu-24.04 without a backup plan."
  open_url "https://docs.docker.com/desktop/features/wsl/"
  pause "After the manual restart, press Enter to finish; re-run this wizard to verify."
fi

recovery_finish
