import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Public, read-only launcher seam; no database mutation or credential output.
const launcher = fileURLToPath(new URL("../../tools/iam-ui-dev/launch.ps1", import.meta.url));
const result = spawnSync("powershell.exe", ["-NoProfile", "-File", launcher, "-Action", "Status"], {
  encoding: "utf8", windowsHide: true, timeout: 20000,
});
assert.equal(result.status, 0, "Status must report the owned dev environment without failing");
assert.match(result.stdout, /IAM_DEV_STATE=(NOT_PROVISIONED|STOPPED|RUNNING)/);
assert.doesNotMatch(result.stdout, /(?:adminPassword|memberPassword|ordinaryPassword)/);
console.log("READ_ONLY_DEV_STATUS=PASS");
