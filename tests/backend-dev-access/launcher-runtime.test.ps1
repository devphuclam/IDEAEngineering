[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$launcher = Join-Path $repo 'tools/backend-dev-access/launcher.ps1'
$ps = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
$ErrorActionPreference = 'Continue'
$output = @(& $ps -NoProfile -File $launcher -Action Start -NoBrowser 2>&1)
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($code -ne 0 -or ($output -join "`n") -notmatch 'BACKEND_STATE=READY') {
    throw "Start must qualify actual HTTPS and PostgreSQL before READY; got $code."
}
$process = Invoke-RestMethod 'https://localhost:18444/health' -TimeoutSec 5
$database = Invoke-RestMethod 'https://localhost:18444/health/database' -TimeoutSec 5
if ($process.status -ne 'UP' -or $database.status -ne 'UP') { throw 'Real HTTPS process/database not UP.' }
Write-Output 'PASS Start qualifies actual trusted HTTPS and PostgreSQL'
$firstText = $output -join "`n"
$firstPid = [regex]::Match($firstText, 'PID=(\d+)').Groups[1].Value
$output = @(& $ps -NoProfile -File $launcher -Action Start -NoBrowser 2>&1)
if ($LASTEXITCODE -ne 0 -or [regex]::Match(($output -join "`n"), 'PID=(\d+)').Groups[1].Value -ne $firstPid) {
    throw 'Repeated Start must reuse the same verified owned runtime.'
}
Write-Output 'PASS repeated Start reuses the owned runtime'
& $ps -NoProfile -File $launcher -Action Stop
if ($LASTEXITCODE -ne 0) { throw 'Owned Stop failed.' }
$output = @(& $ps -NoProfile -File $launcher -Action Status 2>&1)
if ($LASTEXITCODE -ne 3 -or ($output -join "`n") -notmatch 'BACKEND_STATE=STOPPED') { throw 'Stopped runtime must never report READY.' }
Write-Output 'PASS Stop closes the owned runtime/tunnel and Status reports STOPPED'
$foreign = New-Object Net.Sockets.TcpListener([Net.IPAddress]::Loopback, 18444)
try {
    $foreign.Start()
    $output = @(& $ps -NoProfile -File $launcher -Action Start -NoBrowser 2>&1)
    if ($LASTEXITCODE -ne 2 -or ($output -join "`n") -notmatch 'LOCAL_PORT_OCCUPIED') { throw 'Foreign local listener must refuse Start.' }
    $output = @(& $ps -NoProfile -File $launcher -Action Stop 2>&1)
    if ($LASTEXITCODE -ne 2 -or ($output -join "`n") -notmatch 'LOCAL_PORT_OCCUPIED') { throw 'Foreign local listener must refuse Stop.' }
    if (-not $foreign.Server.IsBound) { throw 'Launcher interfered with foreign listener.' }
    Write-Output 'PASS occupied local port is not adopted or stopped'
} finally { $foreign.Stop() }
& $ps -NoProfile -File $launcher -Action Start -NoBrowser
if ($LASTEXITCODE -ne 0) { throw 'Restart must qualify retained database.' }
Write-Output 'PASS restart restores trusted HTTPS/database readiness; human fresh-login check remains separate'
