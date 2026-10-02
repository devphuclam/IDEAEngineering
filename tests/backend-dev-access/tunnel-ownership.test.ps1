[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$launcher = Join-Path $repo 'tools/backend-dev-access/launcher.ps1'
$ps = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
$fixtureRoot = Join-Path ([IO.Path]::GetTempPath()) ('idea-tunnel-contract-' + [guid]::NewGuid().ToString('N'))
$fixtureStateDirectory = Join-Path $fixtureRoot 'IDEA/dev-preview-26'
$fixtureState = Join-Path $fixtureStateDirectory 'tunnel.json'
$originalLocalAppData = $env:LOCALAPPDATA
$foreign = $null
try {
    New-Item -ItemType Directory -Path $fixtureStateDirectory | Out-Null
    # A fixture process only; never borrow or signal an unrelated PID. The launcher sees
    # a separate LOCALAPPDATA tree, so the developer's real tunnel profile is untouched.
    $foreign = Start-Process -FilePath $ps -ArgumentList '-NoProfile', '-Command', 'Start-Sleep -Seconds 180' -WindowStyle Hidden -PassThru
    $foreignStartTicks = $foreign.StartTime.ToUniversalTime().Ticks.ToString()
    $env:LOCALAPPDATA = $fixtureRoot
    $profile = [ordered]@{
        ProcessId = $foreign.Id
        StartTicks = $foreignStartTicks
        CommandLine = 'not-an-owned-ssh-forward'
        HostName = '192.168.137.33'
        SshPort = 22
        KeyPath = [IO.Path]::GetFullPath((Join-Path $env:USERPROFILE '.ssh/idea_ddm_dev_ed25519'))
    }
    foreach ($case in @('malformed', 'foreign-process', 'reused-pid-profile')) {
        if ($case -eq 'malformed') {
            '{invalid-json' | Set-Content -LiteralPath $fixtureState -Encoding UTF8
        } else {
            # Simulate PID reuse by recording a nonmatching creation time. This does not
            # claim to force an actual operating-system PID reuse.
            $profile.StartTicks = $(if ($case -eq 'reused-pid-profile') { '1' } else { $foreignStartTicks })
            $profile | ConvertTo-Json | Set-Content -LiteralPath $fixtureState -Encoding UTF8
        }
        foreach ($action in @('Start', 'Status', 'Stop')) {
            $ErrorActionPreference = 'Continue'
            $output = @(& $ps -NoProfile -File $launcher -Action $action -NoBrowser 2>&1)
            $code = $LASTEXITCODE
            $ErrorActionPreference = 'Stop'
            if ($code -ne 2 -or ($output -join "`n") -notmatch 'TUNNEL_OWNERSHIP_CONFLICT' -or ($output -join "`n") -match 'BACKEND_STATE=READY') {
                throw "Ownership case $case must refuse $action with exit 2; got $code."
            }
            $foreign.Refresh()
            if ($foreign.HasExited) { throw "Ownership case $case stopped the fixture process." }
        }
        Write-Output "PASS $case refuses Start/Status/Stop without stopping the foreign fixture"
    }
} finally {
    $env:LOCALAPPDATA = $originalLocalAppData
    if ($null -ne $foreign) {
        $foreign.Refresh()
        if (-not $foreign.HasExited -and $foreign.StartTime.ToUniversalTime().Ticks.ToString() -eq $foreignStartTicks) {
            Stop-Process -Id $foreign.Id
        }
        $foreign.Dispose()
    }
    foreach ($name in @('tunnel.json', 'launcher.lock')) {
        $file = Join-Path $fixtureStateDirectory $name
        if (Test-Path -LiteralPath $file) { Remove-Item -LiteralPath $file }
    }
    foreach ($directory in @($fixtureStateDirectory, (Join-Path $fixtureRoot 'IDEA'), $fixtureRoot)) {
        if (Test-Path -LiteralPath $directory) { Remove-Item -LiteralPath $directory }
    }
}
