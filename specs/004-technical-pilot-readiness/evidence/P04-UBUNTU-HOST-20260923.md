# P04 Ubuntu development-host observation

| Field | Value |
|---|---|
| Evidence ID | `P04-UBUNTU-HOST-20260923` |
| Date | 2026-09-23, Asia/Ho_Chi_Minh |
| Target | `ideaddmserver`, allocated Ubuntu development host |
| Evidence classes | Agent-observed read-only SSH output; Project Reviewer-supplied privileged command output |
| Scope | Host identity/resources, dedicated IDEA artifact mount and one development Vault directory |
| Excludes | Runtime installation, PostgreSQL database, application build, accepted deployment, backup or multi-vault readiness |

## 1. Read-only SSH inventory

The agent authenticated from the Windows development workstation with the IDEA-specific SSH key
and ran read-only commands as `phuclam`. No password or private key was captured in this record.

| Check | Observed result |
|---|---|
| OS / architecture | Ubuntu 26.04.1 LTS; `x86_64` |
| CPU / RAM / swap | 6 CPUs; 14 GiB RAM; 4 GiB swap |
| Clock | `Asia/Ho_Chi_Minh`; NTP synchronized |
| Root filesystem | 98 GiB total; 86 GiB available |
| IDEA artifact filesystem | Dedicated ext4 mount at `/srv/idea/artifacts`; 108 GiB total; 103 GiB available; `rw,nosuid,nodev` |
| Parent directory | `/srv/idea/artifacts` mode `750`, owner `idea-server:idea-server` |
| Current network | DHCP address `192.168.137.250/24` over `wlp2s0`; this is not a stable application endpoint |
| Existing listeners | SSH on port 22 and local system listeners; no IDEA or PostgreSQL service listener observed |
| Existing tools | Git `2.53.0`; no `java`, `node` or `psql` command; no installed `postgresql-18` apt package |

## 2. Privileged mount inspection and Vault creation

The Project Reviewer used their own SSH terminal and `sudo`; the agent did not receive a sudo
password. The Reviewer-supplied `sudo ls -la /srv/idea/artifacts` output showed only the mount
directory and `lost+found` before creation. No pre-existing IDEA payload was reported.

The Reviewer then ran an exact-target command to create the one development Vault directory
and check it as the service account. Supplied output:

```text
700 idea-server:idea-server /srv/idea/artifacts/vault-01
IDEA_VAULT_WRITABLE=YES
```

The check establishes directory existence, ownership, mode and write eligibility for the
`idea-server` account. It does **not** verify Gateway/Server integration, actual file write/read,
database metadata consistency, backup or multi-vault routing. No temporary fixture or real
company file was written into the Vault by this check.

## 3. P04 disposition

At the time of this host-only observation on 2026-09-23, P04 remained `IN-PROGRESS / NOT-RUN`:
native dependencies, database roles and the final P04 disposition had not yet been recorded.
Those later outcomes are captured in the [runtime evidence](P04-UBUNTU-RUNTIMES-20260923.md)
and [P04 review evidence](P04-ENV-REVIEW-20260924.md). The 103 GiB free on the development mount
is not evidence for the later GB-per-file/TB-per-project objective.
