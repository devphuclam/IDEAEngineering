param(
    [ValidateSet('Start','Dev','Frontend','Status','Stop','BackendStart','BackendStop','EdgeStop','FrontendStop')]
    [string]$Action='Status',
    [switch]$NoWait,
    [switch]$NoBrowser,
    [string]$WebRoot,
    [string]$ExpectedFrontendGeneration
)
$ErrorActionPreference='Stop'
$repository=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$node=Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$node=[IO.Path]::GetFullPath($node)
$ssh=Join-Path $env:SystemRoot 'System32/OpenSSH/ssh.exe'
$key=Join-Path $env:USERPROFILE '.ssh/idea_ddm_dev_ed25519'
$stateRoot=Join-Path $env:USERPROFILE '.codex/idea-dev-access-51'
$stateFile=Join-Path $stateRoot 'processes.json'
$frontendScript=Join-Path $repository 'apps/web/scripts/dev.mjs'
if(!$WebRoot){$WebRoot=Join-Path $repository 'apps/web'}
$WebRoot=(Resolve-Path -LiteralPath $WebRoot).Path
if(!(Test-Path -LiteralPath $node) -or (Get-FileHash -LiteralPath $node -Algorithm SHA256).Hash -ne '3602F2BB1A10F2CBAB4C36886218A33C1AB3DB87290E73B033C46C77147D0237'){
    throw 'Approved Node24.19.0 missing/hash drift. No PATH substitution or download.'
}
$env:NODE_OPTIONS=$null; $env:NODE_PATH=$null
$configText=& $node (Join-Path $PSScriptRoot 'topology.mjs') json
if($LASTEXITCODE -ne 0){throw 'Invalid connection configuration'}
$devConfig=$configText | ConvertFrom-Json
$remote=$devConfig.sshUser+'@'+$devConfig.sshHost
$sshOptions=@('-i',$key,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8')
$publicUrl=[Uri]$devConfig.publicOrigin
$frontendUrl=[Uri]$devConfig.frontendOrigin
New-Item -ItemType Directory -Force -Path $stateRoot | Out-Null
$lock=$null
try{$lock=[IO.File]::Open((Join-Path $stateRoot 'launcher.lock'),'OpenOrCreate','ReadWrite','None')}catch{throw 'Another dev launcher action is active'}
$records=@{}
if(Test-Path -LiteralPath $stateFile){
    $loaded=Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    foreach($property in $loaded.PSObject.Properties){$records[$property.Name]=$property.Value}
}
function Remote([string]$Kind,[string]$Command){
    $remoteCommand='bash '+$devConfig.remoteRoot+'/'+$Kind+'.sh '+$Command
    & $ssh @sshOptions $remote $remoteCommand
    if($LASTEXITCODE -ne 0){throw ($Kind+' action failed. No ready claim; retained data untouched.')}
}
function Persist {
    $temporary=$stateFile+'.'+[Guid]::NewGuid().ToString('N')+'.tmp'
    try{
        $records | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $temporary -Encoding UTF8
        if(Test-Path -LiteralPath $stateFile){[IO.File]::Replace($temporary,$stateFile,$null)}else{[IO.File]::Move($temporary,$stateFile)}
    }finally{if(Test-Path -LiteralPath $temporary){Remove-Item -LiteralPath $temporary}}
}
function Owned([string]$Kind){
    if(!$records.ContainsKey($Kind)){return $null}
    $record=$records[$Kind]
    $process=Get-Process -Id $record.pid -ErrorAction SilentlyContinue
    if(!$process){return $null}
    $details=Get-CimInstance Win32_Process -Filter ('ProcessId='+$process.Id)
    if($process.StartTime.ToUniversalTime().ToString('o') -ne $record.started -or
       $details.ExecutablePath -ne $record.executable -or $details.CommandLine -ne $record.command -or
       $record.remote -ne $remote -or $record.root -ne $devConfig.remoteRoot){throw ('Ownership mismatch: '+$Kind+'; no process signalled')}
    if($Kind -eq 'frontend'){
        if($record.executable -ne $node -or $record.script -ne $frontendScript){throw 'Frontend belongs to another checkout; stop it with its launcher first'}
    }elseif($record.executable -ne $ssh.Replace('/','\')){throw 'Forward executable mismatch'}
    return $process
}
function Save([string]$Kind,$Process){
    $details=Get-CimInstance Win32_Process -Filter ('ProcessId='+$Process.Id)
    if(!$details){throw ('Process exited before ownership could be recorded: '+$Kind)}
    $records[$Kind]=@{pid=$Process.Id;started=$Process.StartTime.ToUniversalTime().ToString('o');
        executable=$details.ExecutablePath;command=$details.CommandLine;remote=$remote;root=$devConfig.remoteRoot;
        script=$frontendScript;webRoot=$WebRoot;generation=[Guid]::NewGuid().ToString('N')}
    Persist
}
function CloseLocal([string]$Kind){
    $process=Owned $Kind
    if($process){Stop-Process -Id $process.Id; if(!$process.WaitForExit(10000)){throw ('Owned process did not stop: '+$Kind)}}
    $records.Remove($Kind);Persist
}
function EnsureForward {
    if(Owned 'forward'){return $false}
    if(Get-NetTCPConnection -LocalPort $publicUrl.Port -State Listen -ErrorAction SilentlyContinue){throw 'Public port occupied by another owner'}
    $arguments=$sshOptions+@('-N','-T','-L',('127.0.0.1:'+$publicUrl.Port+':127.0.0.1:'+$publicUrl.Port),
        '-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=15','-o','ServerAliveCountMax=2',$remote)
    $process=Start-Process -FilePath $ssh -ArgumentList $arguments -WindowStyle Hidden -PassThru
    try{Start-Sleep -Milliseconds 150;Save 'forward' $process}catch{CloseLocal 'forward';throw}
    return $true
}
function Ready {
    $response=Invoke-WebRequest -UseBasicParsing -Uri ($devConfig.publicOrigin+'/health/database') -TimeoutSec 10
    if($response.StatusCode -ne 200 -or ($response.Content | ConvertFrom-Json).status -ne 'UP'){throw 'HTTPS/PostgreSQL not ready'}
    Write-Host ('IDEA_URL='+$devConfig.publicOrigin+'/;SWAGGER='+$devConfig.publicOrigin+'/dev-api/;HTTPS=VERIFIED')
}
function StopFrontend {
    if($ExpectedFrontendGeneration -and (!$records.ContainsKey('frontend') -or $records['frontend'].generation -ne $ExpectedFrontendGeneration)){
        Write-Host 'FRONTEND_CLEANUP=SKIPPED_SUCCESSOR_GENERATION';return
    }
    $failures=@()
    try{$edge=Remote 'edge' 'status';if($edge -match 'MODE=dev'){Remote 'edge' 'stop'}}catch{$failures+= $_;Write-Warning 'REMOTE_CLEANUP=PENDING;local owned cleanup still proceeds'}
    foreach($kind in @('reverse','frontend')){try{CloseLocal $kind}catch{$failures+=$_}}
    if($failures.Count){throw 'Frontend cleanup incomplete; remote/ownership error retained, local cleanup attempted. Retry Status/Stop when reachable.'}
    Write-Host 'FRONTEND=STOPPED;BACKEND_UNCHANGED=true'
}
function EnsureBackend {
    if($devConfig.backendOrigin -eq 'https://127.0.0.1:18449'){Remote 'backend' 'start'}
    else{if((Remote 'backend' 'status') -notmatch 'BACKEND_ENDPOINT=UP'){throw 'Configured external Backend unavailable; start it with its own operator'} }
}
function StartFrontend {
    if($frontendUrl.Scheme -ne 'http' -or $frontendUrl.Host -ne '127.0.0.1'){throw 'Local frontend command requires the configured loopback SSH endpoint; external Web hosting is separately managed'}
    $backend=Remote 'backend' 'status'
    if($backend -notmatch 'BACKEND_ENDPOINT=UP'){throw 'Configured Backend unavailable. Start local Backend or the independently hosted endpoint first.'}
    $existing=Owned 'frontend'
    if($existing -and $records['frontend'].webRoot -ne $WebRoot){throw 'Another frontend checkout is active. Stop it explicitly before switching source.'}
    $newFrontend=$false;$newReverse=$false;$newEdge=$false;$newForward=$false
    try{
        if(!$existing){
            if(Get-NetTCPConnection -LocalPort $devConfig.frontendPort -State Listen -ErrorAction SilentlyContinue){throw 'Frontend port occupied; no unrelated process stopped'}
            $env:IDEA_WEB_ROOT=$WebRoot
            $process=Start-Process -FilePath $node -ArgumentList @(('"'+$frontendScript+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $stateRoot 'frontend.log') -RedirectStandardError (Join-Path $stateRoot 'frontend-error.log')
            $newFrontend=$true;Start-Sleep -Milliseconds 150;Save 'frontend' $process
        }
        $viteReady=$false
        for($attempt=0;$attempt -lt 60;$attempt++){
            if(!(Owned 'frontend')){throw 'Vite exited; inspect local frontend-error.log. No snapshot fallback.'}
            try{ $result=Invoke-WebRequest -UseBasicParsing -Uri ('http://127.0.0.1:'+$devConfig.frontendPort+'/@vite/client') -TimeoutSec 1
                if($result.StatusCode -eq 200){$viteReady=$true;break} }catch{}
            Start-Sleep -Milliseconds 100
        }
        if(!$viteReady){throw 'Vite did not become ready'}
        if(!(Owned 'reverse')){
            $arguments=$sshOptions+@('-N','-T','-R',('127.0.0.1:'+$frontendUrl.Port+':127.0.0.1:'+$devConfig.frontendPort),
                '-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=15','-o','ServerAliveCountMax=2',$remote)
            $process=Start-Process -FilePath $ssh -ArgumentList $arguments -WindowStyle Hidden -PassThru
            $newReverse=$true;Start-Sleep -Milliseconds 200;Save 'reverse' $process
            if(!(Owned 'reverse')){throw 'Reverse SSH unavailable; no LAN fallback'}
        }
        # Explicitly selected dev mode; stop only this owned edge, never the Backend.
        Remote 'edge' 'stop';Remote 'edge' 'start dev';$newEdge=$true;$newForward=EnsureForward;Ready
        Write-Host ('FRONTEND=LOCAL_CHECKOUT;SOURCE='+$WebRoot+';BACKEND_ENDPOINT='+$devConfig.backendOrigin+';MODE=dev')
    }catch{
        $failure=$_
        if($newEdge){try{Remote 'edge' 'stop'}catch{Write-Warning 'REMOTE_CLEANUP=PENDING'}}
        foreach($kind in @('forward','reverse','frontend')){
            $created=switch($kind){'forward'{$newForward}'reverse'{$newReverse}'frontend'{$newFrontend}}
            if($created){try{CloseLocal $kind}catch{Write-Warning ('LOCAL_CLEANUP=PENDING;KIND='+$kind)}}
        }
        throw $failure
    }finally{$env:IDEA_WEB_ROOT=$null}
}
try{
    switch($Action){
        'BackendStart' {Remote 'backend' 'start'}
        'BackendStop' {Remote 'backend' 'stop'}
        'EdgeStop' {Remote 'edge' 'stop'}
        'FrontendStop' {StopFrontend}
        'Status' {
            Remote 'backend' 'status';Remote 'edge' 'status'
            $front=Owned 'frontend';$forward=Owned 'forward';$reverse=Owned 'reverse'
            Write-Host ('FRONTEND='+$(if($front){'UP;SOURCE='+$records['frontend'].webRoot}else{'STOPPED'}))
            Write-Host ('EDGE_FORWARD='+$(if($forward){'UP'}else{'STOPPED'})+';REVERSE='+$(if($reverse){'UP'}else{'STOPPED'}))
        }
        'Stop' {
            $failures=@()
            foreach($operation in @({StopFrontend},{Remote 'edge' 'stop'},{CloseLocal 'forward'},{Remote 'backend' 'stop'})){
                try{& $operation}catch{$failures+=$_}
            }
            if($failures.Count){throw 'Owned cleanup incomplete; local cleanup attempted. Retry remote Status/Stop when reachable.'}
        }
        'Start' {
            StopFrontend;EnsureBackend;Remote 'edge' 'stop';Remote 'edge' 'start review'
            $newForward=$false
            try{$newForward=EnsureForward;Ready}catch{
                $failure=$_;try{Remote 'edge' 'stop'}catch{Write-Warning 'REMOTE_CLEANUP=PENDING'}
                if($newForward){CloseLocal 'forward'};throw $failure
            }
            Write-Host 'MODE=review;WEB=QUALIFIED_JAR;CURRENT_CHECKOUT_EDITS_NOT_DEPLOYED=true'
            if(!$NoBrowser){Start-Process ($devConfig.publicOrigin+'/')}
        }
        default {
            if($Action -eq 'Dev'){EnsureBackend}
            StartFrontend
            if(!$NoBrowser){Start-Process ($devConfig.publicOrigin+'/')}
            if(!$NoWait){
                Write-Host 'Keep this terminal open. Ctrl+C stops Frontend/dev edge only; Backend and data remain.'
                $generation=$records['frontend'].generation
                $lock.Dispose();$lock=$null
                try{
                    while($true){
                        $current=Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
                        if(!$current.frontend -or $current.frontend.generation -ne $generation -or !(Owned 'frontend') -or !(Owned 'reverse')){break}
                        Start-Sleep -Milliseconds 500
                    }
                }finally{& "$PSHOME/powershell.exe" -NoProfile -File $PSCommandPath -Action FrontendStop -WebRoot $WebRoot -ExpectedFrontendGeneration $generation}
            }
        }
    }
}finally{if($lock){$lock.Dispose()}}
