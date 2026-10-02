[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$launcher = Join-Path $repo 'tools/backend-dev-access/launcher.ps1'
$windowsPowerShell = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
$missingKey = Join-Path $repo 'var/nonexistent-qualification-key'
if (Test-Path -LiteralPath $missingKey) { throw 'Test prerequisite: missing key path must not exist.' }
$ErrorActionPreference = 'Continue'
$output = @(& $windowsPowerShell -NoProfile -File $launcher -Action Status -SshKeyPath $missingKey 2>&1)
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
$text = $output -join "`n"
if ($code -ne 2) { throw "Missing-key refusal: expected exit 2, got $code." }
if ($text -notmatch 'BACKEND_HOST=192\.168\.137\.33' -or $text -notmatch 'BACKEND_PORT=18444') {
    throw 'Launcher must show the actual intended host/port even when a prerequisite is missing.'
}
if ($text -notmatch 'SSH_KEY_MISSING' -or $text -match 'BACKEND_STATE=READY') {
    throw 'Missing SSH key must be an actionable refusal, never READY.'
}
Write-Output 'PASS missing-key refusal identifies Backend address without reporting readiness'
$key = Join-Path $env:USERPROFILE '.ssh/idea_ddm_dev_ed25519'
if (-not (Test-Path -LiteralPath $key -PathType Leaf)) { throw 'Qualification requires the existing IDEA SSH key.' }
$ErrorActionPreference = 'Continue'
$output = @(& $windowsPowerShell -NoProfile -File $launcher -Action Status -SshHost 127.0.0.1 -SshPort 1 2>&1)
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
$text = $output -join "`n"
if ($code -ne 1 -or $text -notmatch 'SSH_CONNECTION_FAILED' -or $text -match 'BACKEND_STATE=READY') {
    throw "Unreachable SSH must refuse with exit 1 and a clear error; got $code."
}
Write-Output 'PASS unreachable SSH fails closed'
$cmdLauncher = Join-Path $repo 'IDEA-Dev.cmd'
$ErrorActionPreference = 'Continue'
$output = @(& $env:ComSpec /d /c "$cmdLauncher Status -SshKeyPath $missingKey" 2>&1)
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($code -ne 2 -or ($output -join "`n") -notmatch 'SSH_KEY_MISSING') {
    throw "CMD entry point must use installed Windows PowerShell and preserve refusal exit 2; got $code."
}
Write-Output 'PASS CMD entry point needs no PowerShell 7 and preserves refusal'
