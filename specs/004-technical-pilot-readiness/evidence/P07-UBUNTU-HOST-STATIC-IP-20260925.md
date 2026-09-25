# P07 Ubuntu development host observation — static address

**Record ID**: `IE-VEV-P07-UBUNTU-STATIC-IP-001`  
**Date**: 2026-09-25 (Asia/Ho_Chi_Minh)  
**Scope**: Read-only host observation for D2/P07 preparation. This is not application,
Gateway, Vault Adapter, availability or production-deployment evidence.

## Observed command result

The Project Reviewer authorized a read-only SSH check to the development host at
`192.168.137.33` using the already provisioned development key. The key material and secrets
were not read or recorded.

```text
hostname
ideaddmserver

ip -brief addr show wlp2s0
wlp2s0           UP             192.168.137.33/24 fe80::d66d:6dff:feb2:3e/64

systemctl is-active postgresql
active

findmnt -no TARGET,FSTYPE,OPTIONS /srv/idea/artifacts
/srv/idea/artifacts ext4 rw,nosuid,nodev,relatime
```

## Interpretation

- The development host has a stable address for the current hotspot-backed setup.
- PostgreSQL is active and the dedicated artifact filesystem is mounted read-write.
- This does not prove an IDEA application endpoint, Gateway transfer, Vault Adapter I/O,
  multi-Vault behavior, failover, backup/restore or accepted deployment.
- Re-run the observation if the hotspot, interface, Netplan configuration or host changes.

