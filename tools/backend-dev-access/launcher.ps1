[CmdletBinding()]
param(
    [ValidateSet('Start', 'Status', 'Stop')][string]$Action = 'Status',
    [string]$SshKeyPath = (Join-Path $env:USERPROFILE '.ssh/idea_ddm_dev_ed25519'),
    [ValidatePattern('^[a-zA-Z0-9.-]+$')][string]$SshHost = '192.168.137.33',
    [ValidateRange(1,65535)][int]$SshPort = 22,
    [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$localRoot = Join-Path $env:LOCALAPPDATA 'IDEA/dev-preview-26'
$stateFile = Join-Path $localRoot 'tunnel.json'
$url = 'https://localhost:18444/'
Write-Output "BACKEND_HOST=$SshHost"
Write-Output 'BACKEND_BIND=127.0.0.1'
Write-Output 'BACKEND_PORT=18444'
Write-Output 'BACKEND_URL=https://localhost:18444/'
Write-Output 'SWAGGER=NOT_INSTALLED'
if (-not (Test-Path -LiteralPath $SshKeyPath -PathType Leaf)) {
    Write-Output 'BACKEND_ERROR=SSH_KEY_MISSING; Check the IDEA SSH key path.'
    exit 2
}
$ssh = Join-Path $env:SystemRoot 'System32/OpenSSH/ssh.exe'
if (-not (Test-Path -LiteralPath $ssh -PathType Leaf)) {
    Write-Output 'BACKEND_ERROR=SSH_TOOL_MISSING; Enable the Windows OpenSSH client.'
    exit 2
}
$SshKeyPath = [IO.Path]::GetFullPath($SshKeyPath)
if ($SshKeyPath.Contains('"')) { Write-Output 'BACKEND_ERROR=INVALID_KEY_PATH'; exit 2 }
$sshOptions = @('-i', $SshKeyPath, '-p', "$SshPort", '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=yes')

function Invoke-Remote([string]$Operation) {
    $command = "if [ -f /home/phuclam/.local/share/idea/dev-preview-26/backend.sh ]; then bash /home/phuclam/.local/share/idea/dev-preview-26/backend.sh $Operation; else echo BACKEND_STATE=NOT_PROVISIONED; exit 3; fi"
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $result = @(& $ssh @sshOptions "phuclam@$SshHost" $command 2>&1)
    $remoteCode = $LASTEXITCODE
    $ErrorActionPreference = $oldPreference
    if ($remoteCode -eq 255) {
        return [pscustomobject]@{ Code = 1; Text = 'BACKEND_ERROR=SSH_CONNECTION_FAILED; Check hotspot, Server IP, SSH key and known host fingerprint.' }
    }
    return [pscustomobject]@{ Code = $remoteCode; Text = ($result -join "`n") }
}

function Get-OwnedTunnel {
    if (-not (Test-Path -LiteralPath $stateFile -PathType Leaf)) { return $null }
    $state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    if ($state.HostName -ne $SshHost -or $state.SshPort -ne $SshPort -or $state.KeyPath -ne $SshKeyPath) { throw 'TUNNEL_OWNERSHIP_CONFLICT' }
    $process = Get-Process -Id $state.ProcessId -ErrorAction SilentlyContinue
    if ($null -eq $process) { return $null }
    $native = Get-CimInstance Win32_Process -Filter "ProcessId = $($state.ProcessId)"
    if ($process.StartTime.ToUniversalTime().Ticks.ToString() -ne $state.StartTicks -or
        $native.ExecutablePath -ne $ssh -or $native.CommandLine -ne $state.CommandLine -or
        $native.CommandLine -notmatch '-N -L 127\.0\.0\.1:18444:127\.0\.0\.1:18444' -or
        $native.CommandLine -notmatch 'ExitOnForwardFailure=yes') { throw 'TUNNEL_OWNERSHIP_CONFLICT' }
    return $process
}

function Test-LocalPort {
    return @([Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners() | Where-Object Port -eq 18444).Count -gt 0
}

function Get-Health {
    foreach ($path in @('health', 'health/database')) {
        $request = [Net.HttpWebRequest]::Create($url + $path)
        $request.Timeout = 2500
        $request.ReadWriteTimeout = 2500
        $request.AllowAutoRedirect = $false
        $request.Proxy = $null
        try {
            $response = $request.GetResponse()
            try {
                $reader = New-Object IO.StreamReader($response.GetResponseStream())
                try { $body = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
                if ([int]$response.StatusCode -ne 200 -or $body.status -ne 'UP') { return 'HEALTH_NOT_UP' }
            } finally { $response.Dispose() }
        } catch [Net.WebException] {
            if ($_.Exception.Response) { $_.Exception.Response.Dispose() }
            if ($_.Exception.Status -in @([Net.WebExceptionStatus]::TrustFailure, [Net.WebExceptionStatus]::SecureChannelFailure)) { return 'TLS_TRUST_FAILED' }
            return 'HTTPS_OR_DATABASE_NOT_READY'
        } catch { return 'HEALTH_RESPONSE_INVALID' }
    }
    return 'UP'
}

$lock = $null
$createdTunnel = $false
try {
    if ($Action -ne 'Status') {
        New-Item -ItemType Directory -Path $localRoot -Force | Out-Null
        try { $lock = [IO.File]::Open((Join-Path $localRoot 'launcher.lock'), 'OpenOrCreate', 'ReadWrite', 'None') }
        catch { Write-Output 'BACKEND_ERROR=LAUNCHER_BUSY'; exit 2 }
    }
    if ($Action -eq 'Status') {
        $remoteResult = Invoke-Remote 'status'
        if ($remoteResult.Code -ne 0) { Write-Output $remoteResult.Text; exit $remoteResult.Code }
    }
    try { $tunnel = Get-OwnedTunnel } catch { Write-Output 'BACKEND_ERROR=TUNNEL_OWNERSHIP_CONFLICT; No local process was stopped.'; exit 2 }
    if ($null -eq $tunnel -and (Test-LocalPort)) {
        Write-Output 'BACKEND_ERROR=LOCAL_PORT_OCCUPIED; Port 18444 does not belong to this launcher.'
        exit 2
    }
    if ($Action -ne 'Status') { $remoteResult = Invoke-Remote $Action.ToLowerInvariant() }
    Write-Output $remoteResult.Text
    if ($remoteResult.Code -ne 0) { exit $remoteResult.Code }
    if ($Action -eq 'Stop') {
        if ($null -ne $tunnel) {
            $tunnel = Get-OwnedTunnel
            if ($null -ne $tunnel) { Stop-Process -Id $tunnel.Id -ErrorAction Stop }
        }
        if (Test-Path -LiteralPath $stateFile) { Remove-Item -LiteralPath $stateFile }
        Write-Output 'LOCAL_TUNNEL=STOPPED; Preview database retained.'
        exit 0
    }
    if ($null -eq $tunnel) {
        if ($Action -eq 'Status') { Write-Output 'BACKEND_STATE=REMOTE_RUNNING_LOCAL_TUNNEL_ABSENT; Use Start.'; exit 3 }
        $forwardOptions = @('-i', ('"' + $SshKeyPath + '"'), '-p', "$SshPort", '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=yes', '-o', 'ExitOnForwardFailure=yes', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=2', '-N', '-L', '127.0.0.1:18444:127.0.0.1:18444', "phuclam@$SshHost")
        $tunnel = Start-Process -FilePath $ssh -ArgumentList $forwardOptions -WindowStyle Hidden -PassThru
        Start-Sleep -Milliseconds 250
        $tunnel.Refresh()
        if ($tunnel.HasExited) { Write-Output 'BACKEND_ERROR=SSH_FORWARD_FAILED'; exit 1 }
        $native = Get-CimInstance Win32_Process -Filter "ProcessId = $($tunnel.Id)"
        [pscustomobject]@{ ProcessId = $tunnel.Id; StartTicks = $tunnel.StartTime.ToUniversalTime().Ticks.ToString(); CommandLine = $native.CommandLine; HostName = $SshHost; SshPort = $SshPort; KeyPath = $SshKeyPath } |
            ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding UTF8
        $createdTunnel = $true
    }
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $deadline = [DateTime]::UtcNow.AddSeconds($(if ($Action -eq 'Start') { 60 } else { 1 }))
    do {
        $health = Get-Health
        if ($health -eq 'UP') {
            $ownerCheck = Invoke-Remote 'status'
            if ($ownerCheck.Code -ne 0) { Write-Output $ownerCheck.Text; exit $ownerCheck.Code }
            Write-Output 'BACKEND_STATE=READY; PROCESS=UP; DATABASE=UP; TLS=VERIFIED'
            if ($Action -eq 'Start' -and -not $NoBrowser) { Start-Process $url }
            $createdTunnel = $false
            exit 0
        }
        if ($health -eq 'TLS_TRUST_FAILED' -or $Action -eq 'Status') { break }
        Start-Sleep -Milliseconds 750
    } while ([DateTime]::UtcNow -lt $deadline)
    Write-Output "BACKEND_ERROR=$health; No readiness claimed. Check certificate trust/expiry, owned Server and PostgreSQL."
    exit 1
} catch {
    Write-Output 'BACKEND_ERROR=LAUNCHER_EXECUTION_FAILED; No success claimed. Check ownership, SSH and private runtime configuration.'
    exit 1
} finally {
    if ($createdTunnel) {
        try {
            $cleanupTunnel = Get-OwnedTunnel
            if ($null -ne $cleanupTunnel) { Stop-Process -Id $cleanupTunnel.Id -ErrorAction Stop }
            if (Test-Path -LiteralPath $stateFile) { Remove-Item -LiteralPath $stateFile }
        } catch { Write-Output 'BACKEND_ERROR=FORWARD_CLEANUP_UNVERIFIED; Inspect the recorded tunnel, do not stop unrelated SSH processes.' }
    }
    if ($null -ne $lock) { $lock.Dispose() }
}
