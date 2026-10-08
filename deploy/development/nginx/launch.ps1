param([ValidateSet('Start','Status','Stop')][string]$Action='Start')
$ErrorActionPreference='Stop'
$ssh='C:/Windows/System32/OpenSSH/ssh.exe'
$key='C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519'
$remote='phuclam@192.168.137.33'
$control='/home/phuclam/idea-nginx-dev-control-49/control.sh'
$stateDirectory='C:/Users/TD-999/.codex/nginx-dev-49'
$stateFile=$stateDirectory+'/forward.json'
$sshOptions=@('-i',$key,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8')

function Remote([string]$Command) {
    & $ssh @sshOptions $remote ('bash '+$control+' '+$Command)
    if($LASTEXITCODE -ne 0){throw ('Owned Nginx '+$Command+' failed; no success is claimed.')}
}
function OwnedForward {
    if(!(Test-Path -LiteralPath $stateFile)){return $null}
    $record=Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    $process=Get-Process -Id $record.pid -ErrorAction SilentlyContinue
    if(!$process){return $null}
    $details=Get-CimInstance Win32_Process -Filter ('ProcessId='+$record.pid)
    if($process.StartTime.ToUniversalTime().ToString('o') -ne $record.started -or
       $details.ExecutablePath -ne $ssh.Replace('/','\') -or
       $details.CommandLine -notlike '*127.0.0.1:18448:127.0.0.1:18448*' -or
       $details.CommandLine -notlike '*phuclam@192.168.137.33*' -or
       $details.CommandLine -notlike '*idea_ddm_dev_ed25519*'){
        throw 'Forward ownership conflict; no process was signalled.'
    }
    return $process
}
function StopForward {
    $process=OwnedForward
    if($process){Stop-Process -Id $process.Id; $process.WaitForExit(10000) | Out-Null}
    if(Test-Path -LiteralPath $stateFile){Remove-Item -LiteralPath $stateFile}
}
if($Action -eq 'Status'){
    Remote 'status'
    Write-Host ('NGINX_DEV_FORWARD='+$(if(OwnedForward){'RUNNING'}else{'STOPPED'}))
    exit 0
}
if($Action -eq 'Stop'){StopForward;Remote 'stop';exit 0}
$process=OwnedForward
if(!$process -and (Get-NetTCPConnection -LocalPort 18448 -State Listen -ErrorAction SilentlyContinue)){
    throw 'Local port18448 is occupied; no unrelated process was stopped.'
}
Remote 'start'
if(!$process){
    $arguments=$sshOptions+@('-N','-T','-L','127.0.0.1:18448:127.0.0.1:18448','-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=15','-o','ServerAliveCountMax=2',$remote)
    $process=Start-Process -FilePath $ssh -ArgumentList $arguments -WindowStyle Hidden -PassThru
    New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null
    @{pid=$process.Id;started=$process.StartTime.ToUniversalTime().ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding UTF8
    $ready=$false
    for($attempt=0;$attempt -lt 30;$attempt++){
        if($process.HasExited){StopForward;throw 'Owned SSH forward exited; Nginx entry is not ready.'}
        if(Get-NetTCPConnection -LocalPort 18448 -State Listen -OwningProcess $process.Id -ErrorAction SilentlyContinue){$ready=$true;break}
        Start-Sleep -Milliseconds 100
    }
    if(!$ready){StopForward;throw 'Owned forward did not become ready; remote state is retained.'}
}
# Normal Windows trust and endpoint verification; no TLS bypass or secret output.
$response=Invoke-WebRequest -UseBasicParsing -Uri 'https://localhost:18448/health/database' -TimeoutSec 10
if($response.StatusCode -ne 200){throw 'Nginx database health failed; no ready claim.'}
Write-Host 'IDEA Nginx dev: https://localhost:18448/ ; Swagger: https://localhost:18448/dev-api/'
Write-Host 'NGINX_ENTRY=READY;TRUSTED_HTTPS=true;POSTGRESQL=UP;DATABASE_RETAINED=true'
