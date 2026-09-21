[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$trackerPath = (Resolve-Path (Join-Path $PSScriptRoot '..\idea-progress-tracker.ps1')).Path
$powerShellPath = (Get-Process -Id $PID).Path
$probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$probe.Start()
$port = ([System.Net.IPEndPoint]$probe.LocalEndpoint).Port
$probe.Stop()

$tempDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("idea-progress-tracker-test-" + [guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $tempDirectory
$serverOut = Join-Path $tempDirectory 'server.out.log'
$serverErr = Join-Path $tempDirectory 'server.err.log'
$server = $null

try {
    $server = Start-Process -FilePath $powerShellPath `
        -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $trackerPath, '-Port', $port, '-NoBrowser') `
        -RedirectStandardOutput $serverOut -RedirectStandardError $serverErr `
        -WindowStyle Hidden -PassThru

    $ready = $false
    $deadline = [DateTime]::UtcNow.AddSeconds(8)
    while ([DateTime]::UtcNow -lt $deadline) {
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:$port/api/health" -TimeoutSec 1
            if ($health.ok -eq $true) { $ready = $true; break }
        }
        catch { Start-Sleep -Milliseconds 100 }
    }
    if (-not $ready) {
        $errorText = if (Test-Path $serverErr) { Get-Content -Raw $serverErr } else { '' }
        throw "Phiên tracker đầu tiên không khởi động được. $errorText"
    }

    $duplicateOutput = @(& $powerShellPath -NoProfile -ExecutionPolicy Bypass -File $trackerPath -Port $port -NoBrowser 2>&1)
    $duplicateExitCode = $LASTEXITCODE
    $duplicateText = $duplicateOutput -join [Environment]::NewLine

    if ($duplicateExitCode -ne 0) {
        throw "Lần chạy thứ hai phải thoát thành công nhưng nhận exit code $duplicateExitCode.`n$duplicateText"
    }
    if ($duplicateText -notmatch 'đã chạy|dang chay|already running') {
        throw "Lần chạy thứ hai không thông báo rằng tracker đã chạy.`n$duplicateText"
    }

    Write-Output "PASS duplicate launch reuses tracker on port $port"
}
finally {
    if ($null -ne $server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $server.WaitForExit()
    }
    if (Test-Path -LiteralPath $tempDirectory) {
        Remove-Item -LiteralPath $tempDirectory -Recurse -Force
    }
}
