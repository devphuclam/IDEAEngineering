param([ValidateSet('Dev','Start','Status','Stop','Credentials')][string]$Action='Dev')
$ErrorActionPreference='Stop'
$ssh='C:/Windows/System32/OpenSSH/ssh.exe'
$key='C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519'
$remote='phuclam@192.168.137.33'
$backend='/home/phuclam/idea-iam-ui-20261007-46/manual-dev-01/backend.sh'
$stateDirectory='C:/Users/TD-999/.codex/iam-ui-46'
$stateFile=$stateDirectory+'/dev-forward.json'
$sshOptions=@('-i',$key,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8')

function Remote([string]$Command) {
    & $ssh @sshOptions $remote ('bash '+$backend+' '+$Command)
    if($LASTEXITCODE -ne 0){throw ('Owned dev '+$Command+' failed; no success is claimed.')}
}
function OwnedForward {
    if(!(Test-Path -LiteralPath $stateFile)){return $null}
    $record=Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    $process=Get-Process -Id $record.pid -ErrorAction SilentlyContinue
    if(!$process){return $null}
    $details=Get-CimInstance Win32_Process -Filter ('ProcessId='+$record.pid)
    if($process.StartTime.ToUniversalTime().ToString('o') -ne $record.started -or
       $details.ExecutablePath -ne $ssh.Replace('/','\') -or
       $details.CommandLine -notlike '*127.0.0.1:5174:127.0.0.1:5173*' -or
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
if($Action -eq 'Credentials'){
    if([Console]::IsOutputRedirected){throw 'Private credentials require your interactive terminal; never record or paste them.'}
    & $ssh @sshOptions -t $remote ('bash '+$backend+' credentials')
    if($LASTEXITCODE -ne 0){throw 'Private credential handoff failed.'}
    exit 0
}
if($Action -eq 'Status'){Remote 'status'; $process=OwnedForward; Write-Host ('IAM_DEV_FORWARD='+$(if($process){'RUNNING'}else{'STOPPED'})); exit 0}
if($Action -eq 'Stop'){StopForward; Remote 'stop'; exit 0}
Remote 'start'
$process=OwnedForward
if(!$process){
    if(Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue){throw 'Local port 5174 occupied; no unrelated process was stopped.'}
    $arguments=$sshOptions+@('-N','-T','-L','127.0.0.1:5174:127.0.0.1:5173','-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=15','-o','ServerAliveCountMax=2',$remote)
    $process=Start-Process -FilePath $ssh -ArgumentList $arguments -WindowStyle Hidden -PassThru
    New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null
    @{pid=$process.Id;started=$process.StartTime.ToUniversalTime().ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding UTF8
    $ready=$false
    for($attempt=0;$attempt -lt 30;$attempt++){
        if($process.HasExited){throw 'Owned SSH forward exited; dev is not ready.'}
        if(Get-NetTCPConnection -LocalPort 5174 -State Listen -OwningProcess $process.Id -ErrorAction SilentlyContinue){$ready=$true;break}
        Start-Sleep -Milliseconds 100
    }
    if(!$ready){StopForward;throw 'Owned forward did not become ready.'}
}
Write-Host 'IDEA Feature009 dev: https://localhost:5174/'
Write-Host 'Synthetic login: iam-assignment.admin (private password: npm run dev:credentials)'
Write-Host 'Data and accounts survive Stop/Start. Never use company credentials.'
if($Action -eq 'Start'){exit 0}
Write-Host 'Keep this terminal open. Ctrl+C stops only owned dev processes, not the database.'
try{Wait-Process -Id $process.Id}finally{StopForward;Remote 'stop'}
