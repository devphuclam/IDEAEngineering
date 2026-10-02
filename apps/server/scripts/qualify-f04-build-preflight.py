#!/usr/bin/env python3
"""Read-only admission qualification: no Maven build, credentials or database access."""
import hashlib
import json
import os
from pathlib import Path
import sys
import shutil
import subprocess
import tempfile

if (sys.version_info[:3] != (3, 14, 4) or sys.implementation.name != "cpython"
        or sys.executable != "/usr/bin/python3.14" or sys.prefix != "/usr"
        or sys.base_prefix != "/usr" or not sys.flags.isolated or not sys.flags.no_site
        or hashlib.sha256(Path(sys.executable).read_bytes()).hexdigest()
        != "52e0a13e60a981d8c4b6478be2ba5176f69da07948a056bf49cf6f077e30cb41"):
    raise SystemExit("BLOCKED: exact isolated F04 Python runtime required")

repo = Path(__file__).resolve().parents[3]
retained = Path(tempfile.mkdtemp(prefix="idea-f04-preflight-", dir="/home/phuclam"))
fixture = retained / "fixture"
inputs = (
    "apps/server/pom.xml",
    "apps/server/scripts/build-web-static.mjs",
    "apps/server/scripts/run-f04-postgresql-checks.sh",
    "apps/web/package.json",
    "apps/web/package-lock.json",
    "apps/web/vite.config.ts",
    "docs/research/2026-10-02-f04-buildtool-execution-authorization.md",
    "docs/research/2026-10-02-f04-python-harness-authorization.md",
    "docs/research/2026-10-01-t043-maven-web-build-intake.md",
)
for relative in inputs:
    target = fixture / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(repo / relative, target)
# Version probes only read metadata in this owned fixture; no package code is executed.
package = json.loads((repo / "apps/web/package.json").read_text())
for name in package["dependencies"] | package["devDependencies"]:
    target = fixture / "apps/web/node_modules" / name / "package.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(repo / "apps/web/node_modules" / name / "package.json", target)

runner = fixture / "apps/server/scripts/run-f04-postgresql-checks.sh"


def check(name, expected, signal):
    result = subprocess.run(["bash", str(runner), "--preflight-only"],
                            capture_output=True, text=True, env=os.environ.copy())
    log = retained / (name + ".log")
    log.write_text(result.stdout + result.stderr)
    log.chmod(0o600)
    if result.returncode != expected or signal not in result.stdout + result.stderr:
        raise SystemExit("F04_PREFLIGHT_CASE=" + name + "; FAIL; retained=" + str(log))
    print("F04_PREFLIGHT_CASE=" + name + "; PASS; exit=" + str(expected))


check("qualified", 0, "DATABASE=NOT-ACCESSED")
for relative, name in (("apps/server/pom.xml", "changed-pom"),
                       ("apps/web/package-lock.json", "changed-lock")):
    target = fixture / relative
    original = target.read_bytes()
    target.write_bytes(original + b"\n")
    try:
        check(name, 1, "BLOCKED: qualified build input changed " + relative)
    finally:
        target.write_bytes(original)

metadata = fixture / "apps/web/node_modules/typescript/package.json"
original = metadata.read_bytes()
changed = json.loads(original)
changed["version"] = "0.0.0-f04-unapproved-fixture"
metadata.write_text(json.dumps(changed))
try:
    check("changed-installed-version", 1, "BLOCKED: approved installed Web package missing/changed typescript")
finally:
    metadata.write_bytes(original)

extension = fixture / "apps/server/.mvn/extensions.xml"
extension.parent.mkdir(parents=True, exist_ok=True)
extension.write_text("<extensions/>\n")
check("new-maven-extension", 1, "BLOCKED: unapproved Maven configuration extensions.xml")
print("F04_PREFLIGHT_QUALIFICATION=5/5; BUILD=NOT-RUN; DATABASE=NOT-ACCESSED; RETAINED=" + str(retained))
