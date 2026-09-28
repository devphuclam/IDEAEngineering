$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$launcher = Join-Path $repoRoot 'IDEA-Progress-Tracker.cmd'
$codexPwsh = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\native\powershell\pwsh.exe'
if (-not (Test-Path $codexPwsh -PathType Leaf)) {
    throw "This launcher integration test requires the current user's Codex-bundled PowerShell 7 runtime: $codexPwsh"
}

$probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$probe.Start()
$port = [int]$probe.LocalEndpoint.Port
$probe.Stop()

$processInfo = [System.Diagnostics.ProcessStartInfo]::new()
$processInfo.FileName = Join-Path $env:SystemRoot 'System32\cmd.exe'
$processInfo.Arguments = "/d /s /c `"`"$launcher`" -NoBrowser -Port $port`""
$processInfo.WorkingDirectory = $repoRoot
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true

# Reproduce a Windows Explorer launch: Codex's private runtime is installed,
# but it is absent from PATH and both standard PowerShell install locations.
$processInfo.Environment['ProgramFiles'] = Join-Path ([System.IO.Path]::GetTempPath()) "idea-tracker-no-standard-pwsh-$([guid]::NewGuid().ToString('N'))"
$processInfo.Environment['LOCALAPPDATA'] = Join-Path ([System.IO.Path]::GetTempPath()) "idea-tracker-no-local-pwsh-$([guid]::NewGuid().ToString('N'))"
$processInfo.Environment['PATH'] = "$env:SystemRoot\System32;$env:SystemRoot"

$process = [System.Diagnostics.Process]::new()
$process.StartInfo = $processInfo
$null = $process.Start()
$stdout = $process.StandardOutput.ReadToEndAsync()
$stderr = $process.StandardError.ReadToEndAsync()
$healthy = $false
$deadline = [DateTime]::UtcNow.AddSeconds(10)

try {
    while ([DateTime]::UtcNow -lt $deadline) {
        if ($process.HasExited) { break }
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:$port/api/health" -TimeoutSec 1
            if ($health.ok -eq $true -and $health.service -eq 'IDEA_PROGRESS_TRACKER' -and [int]$health.port -eq $port) {
                $healthy = $true
                break
            }
        }
        catch { }
        Start-Sleep -Milliseconds 150
    }

    if (-not $healthy) {
        if (-not $process.HasExited) {
            $process.Kill($true)
            $process.WaitForExit()
        }
        $output = ($stdout.GetAwaiter().GetResult() + [Environment]::NewLine + $stderr.GetAwaiter().GetResult()).Trim()
        throw "FAIL: launcher did not make /api/health ready on port $port. Process exit: $($process.ExitCode). Output: $output"
    }

    Write-Output "PASS: launcher started IDEA_PROGRESS_TRACKER and /api/health returned OK on port $port."
}
finally {
    if (-not $process.HasExited) {
        $process.Kill($true)
        $process.WaitForExit()
    }
    $process.Dispose()
}
