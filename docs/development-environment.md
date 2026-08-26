# Development Environment

## Local Dev Container

Install Docker Desktop and a Dev Containers-capable editor, open the repository, and reopen it in the configured Dev Container. The shared environment is defined by `.devcontainer/devcontainer.json`; after creation, `./scripts/verify-template` is the verification command.

## GitHub Codespaces

Create a Codespace from this repository. GitHub uses the same default `.devcontainer/devcontainer.json`, so the image, workspace user, and post-create verification do not depend on a developer's personal machine.

## WSL2 fallback

When company policy prohibits containers, use WSL2 without a container and run the repository's shell verification from the Linux environment. This is a controlled fallback, not a claim that native Windows execution has identical behavior.

Native Windows parity is not promised.

## Docker Desktop + WSL2 recovery

If Docker Desktop reports that WSL integration stopped, or `docker` is missing inside Ubuntu, run the repeatable recovery wizard from WSL or Git Bash:

```bash
./scripts/docker-wsl-recovery.sh
```

The wizard checks the Docker Desktop proxy, backend socket, and `docker info` before asking for a safe Docker Desktop + WSL restart. It does not run Factory Reset, unregister a distro, delete images, or delete volumes. If the failure persists, follow Docker's Troubleshoot flow and run the wizard again.

## Shared and personal customization

Keep required repository customization in the template. Keep personal themes, keymaps, dotfiles, and editor preferences outside the template so they do not become project dependencies.

## Core Workspace lifecycle scope

The Core Workspace has no application `setup`, `lint`, `test`, `build`, or `deploy` command. A Stack Profile may supply real setup, lint, test, and build behavior; a Platform Adapter may supply deploy behavior. Until those optional layers exist, `./scripts/verify-template` is the only public verification command.
