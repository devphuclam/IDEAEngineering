$ErrorActionPreference='Stop'
# Test the authored lifecycle functions with process/network boundaries replaced.
# This is not runtime qualification; real launch/HTTPS/browser checks are separate.
$source=Join-Path $PSScriptRoot '../../tools/dev-access/launch.ps1'
$errors=$null
$ast=[System.Management.Automation.Language.Parser]::ParseFile($source,[ref]$null,[ref]$errors)
if($errors.Count){throw 'Launcher syntax error'}
foreach($name in @('StopFrontend','EnsureBackend','StartFrontend')){
    $definition=$ast.Find({param($node) $node -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq $name},$true)
    Invoke-Expression $definition.Extent.Text
}
function Assert($condition,[string]$message){if(!$condition){throw $message}}
function CloseLocal([string]$kind){$script:closed+= $kind}
function Remote([string]$kind,[string]$command){
    $script:calls+= "$kind/$command"
    if($script:unreachable){throw 'synthetic unreachable boundary'}
    if($kind -eq 'backend'){return 'BACKEND=EXTERNAL;BACKEND_ENDPOINT=UP'}
    if($command -eq 'status'){return 'EDGE=RUNNING;MODE=dev'}
}
function Owned([string]$kind){return [PSCustomObject]@{Id=1}}
function Invoke-WebRequest {return [PSCustomObject]@{StatusCode=200}}
function EnsureForward {return $true}
function Ready {throw 'synthetic health failure after edge/forward start'}
$WebRoot='C:\owned\web'
$devConfig=[PSCustomObject]@{backendOrigin='https://server.internal:9443';frontendPort=5175}
$frontendUrl=[Uri]'http://127.0.0.1:18450'
$records=@{frontend=[PSCustomObject]@{generation='new';webRoot=$WebRoot}}
$closed=@();$calls=@();$unreachable=$false;$ExpectedFrontendGeneration='old'
StopFrontend
Assert ($closed.Count -eq 0 -and $calls.Count -eq 0) 'Stale cleanup touched successor'
Write-Host 'PASS stale generation cannot stop successor'

$ExpectedFrontendGeneration='new';$unreachable=$true
$refused=$false
try{StopFrontend}catch{$refused=$true}
Assert ($refused -and $closed -contains 'frontend' -and $closed -contains 'reverse') 'SSH failure prevented local cleanup or falsely succeeded'
Write-Host 'PASS unreachable remote still cleans local owned resources and reports failure'

$unreachable=$false;$calls=@();EnsureBackend
Assert ($calls.Count -eq 1 -and $calls[0] -eq 'backend/status') 'External backend caused local start'
Write-Host 'PASS external endpoint checked without local process start'

$devConfig.backendOrigin='https://127.0.0.1:18449';$calls=@();EnsureBackend
Assert ($calls.Count -eq 1 -and $calls[0] -eq 'backend/start') 'Local backend convenience start missing'
Write-Host 'PASS local backend uses independent owned start'

$calls=@();$closed=@();$ExpectedFrontendGeneration=$null;$refused=$false
try{StartFrontend}catch{$refused=$true}
Assert ($refused -and @($calls | Where-Object {$_ -eq 'edge/stop'}).Count -eq 2 -and $closed -contains 'forward' -and $closed -notcontains 'frontend' -and $closed -notcontains 'reverse') 'Startup rollback leaked edge/forward or stopped preexisting frontend'
Write-Host 'PASS failed readiness rolls back new edge/forward, preserves independent existing resources'
Write-Host 'LIFECYCLE_UNIT=5/5;REAL_RUNTIME=SEPARATE'
