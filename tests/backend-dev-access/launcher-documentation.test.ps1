[CmdletBinding()]
param([ValidateSet('AVAILABLE', 'UNVERIFIED')][string]$ExpectedState = 'AVAILABLE')
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$launcher = Join-Path $repo 'tools/backend-dev-access/launcher.ps1'
$ps = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
$output = @(& $ps -NoProfile -File $launcher -Action Status 2>&1)
if ($LASTEXITCODE -ne 0) { throw 'Prerequisite: owned preview must be actually READY.' }
$text = $output -join "`n"
if ($text -notmatch "SWAGGER=$ExpectedState(?:`r?`n|$)") { throw "Expected identified documentation state $ExpectedState." }
if ($ExpectedState -eq 'AVAILABLE' -and $text -notmatch 'SWAGGER_URL=https://localhost:18444/dev-api/') {
    throw 'Identified documentation needs its actual address.'
}
if ($ExpectedState -eq 'UNVERIFIED' -and $text -match 'SWAGGER_URL=') {
    throw 'An unidentified generation must not advertise a working documentation URL.'
}
Write-Output "PASS actual owned runtime documentation state $ExpectedState"
