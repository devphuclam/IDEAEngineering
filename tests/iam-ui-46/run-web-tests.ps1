param(
    [Parameter(Mandatory=$true)][string]$SourceRoot,
    [Parameter(Mandatory=$true)][ValidatePattern('^[0-9a-f]{40}$')][string]$SourceSha,
    [Parameter(Mandatory=$true)][ValidateSet('RED','PASS')][string]$Oracle,
    [Parameter(Mandatory=$true)][int]$ExpectedCount,
    [ValidateSet('src/features/projectAdministration/projectAdministration.test.tsx','src/features/accessAdministration/assignmentWizard.test.tsx')][string]$TestFile
)
$ErrorActionPreference='Stop'
$SourceRoot=[IO.Path]::GetFullPath($SourceRoot)
if($SourceRoot -notmatch '^C:\\Users\\TD-999\\\.codex\\iam-ui-46\\export-web-[a-z0-9-]+\\source$'){throw 'Unowned Web source target'}
$owned=[IO.Path]::GetDirectoryName($SourceRoot)
if(Test-Path -LiteralPath ($owned+'/web-private.log')){throw 'Reused test target'}
$web=$SourceRoot+'/apps/web'
if(Test-Path -LiteralPath ($web+'/node_modules')){throw 'Dependency projection already exists'}
$node='C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
if((Get-FileHash -LiteralPath $node).Hash.ToLowerInvariant() -ne '3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237'){throw 'Node pin drift'}
Remove-Item Env:NODE_OPTIONS,Env:NODE_PATH -ErrorAction SilentlyContinue
if((& $node --version) -ne 'v24.19.0'){throw 'Node version drift'}
function Check-Source {
    $count=0
    foreach($line in Get-Content -LiteralPath ($SourceRoot+'/tests/iam-ui-46/inputs.sha256')){
        if($line -notmatch '^[0-9a-f]{64}  .+$'){throw 'Source manifest format'}
        $parts=$line -split '  ',2
        if((Get-FileHash -LiteralPath ($SourceRoot+'/'+$parts[1])).Hash.ToLowerInvariant() -ne $parts[0]){throw ('Controlled source drift: '+$parts[1])}
        $count++
    }
    return $count
}
$inputCount=Check-Source
$cacheRoot='C:/Users/TD-999/Research/Projects/IDEA/IDEAEngineering/apps/web'
$lock=Get-Content -LiteralPath ($web+'/package-lock.json') -Raw | ConvertFrom-Json -AsHashtable
$projection=[Collections.Generic.List[object]]::new()
$packages=0
$archives=0
foreach($path in $lock.packages.Keys){
    if(!$path.StartsWith('node_modules/')){continue}
    $installed=$cacheRoot+'/'+$path
    if(!(Test-Path -LiteralPath $installed)){continue} # Optional non-Windows artifacts are not selected.
    $package=$lock.packages[$path]
    $actual=Get-Content -LiteralPath ($installed+'/package.json') -Raw | ConvertFrom-Json
    if($actual.version -ne $package.version -or $actual.name -ne $path.Substring(13)){throw ('Locked package identity drift: '+$path)}
    $prefix=if($path.StartsWith('node_modules/@types/')){$actual.name.Substring(7)+'/'}else{'package/'}
    if($package.integrity -notmatch '^sha512-([A-Za-z0-9+/=]+)$'){throw 'Unpinned archive'}
    $hex=[Convert]::ToHexString([Convert]::FromBase64String($Matches[1])).ToLowerInvariant()
    $archive='C:/Users/TD-999/AppData/Local/npm-cache/_cacache/content-v2/sha512/'+$hex.Substring(0,2)+'/'+$hex.Substring(2,2)+'/'+$hex.Substring(4)
    if((Get-FileHash -LiteralPath $archive -Algorithm SHA512).Hash.ToLowerInvariant() -ne $hex){throw ('Archive integrity drift: '+$path)}
    $stream=[IO.File]::OpenRead($archive)
    $gzip=[IO.Compression.GZipStream]::new($stream,[IO.Compression.CompressionMode]::Decompress)
    $tar=[System.Formats.Tar.TarReader]::new($gzip)
    try {
        while($entry=$tar.GetNextEntry()){
            if(!$entry.DataStream){continue}
            if(!$entry.Name.StartsWith($prefix) -or $entry.Name.Contains('..')){throw 'Unexpected archive member'}
            $relative=$entry.Name.Substring($prefix.Length)
            $member=[IO.Path]::GetFullPath($installed+'/'+$relative)
            if(!$member.StartsWith([IO.Path]::GetFullPath($installed)+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Archive escape'}
            $hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($entry.DataStream)).ToLowerInvariant()
            if((Get-FileHash -LiteralPath $member).Hash.ToLowerInvariant() -ne $hash){throw ('Installed/archive byte drift: '+$path+'/'+$relative)}
            $projection.Add(@{source=$member;relative=$path+'/'+$relative;hash=$hash})
        }
    } finally { $tar.Dispose(); $gzip.Dispose(); $stream.Dispose() }
    $packages++; $archives++
}
if($packages -ne 44 -or $archives -ne 44){throw 'Admitted Windows package set drift'}
foreach($member in $projection){
    $target=[IO.Path]::GetFullPath($web+'/'+$member.relative)
    if(!$target.StartsWith([IO.Path]::GetFullPath($web+'/node_modules')+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Projection escape'}
    New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($target)) -Force | Out-Null
    Copy-Item -LiteralPath $member.source -Destination $target
    if((Get-FileHash -LiteralPath $target).Hash.ToLowerInvariant() -ne $member.hash){throw 'Projection byte drift'}
}
$report=$owned+'/web-result.json'
$log=$owned+'/web-private.log'
$typecheck='NOT-RUN'
Push-Location $web
try {
    [string[]]$testSelection=if($TestFile){@($TestFile)}else{@()}
    & $node ($web+'/node_modules/vitest/vitest.mjs') run @testSelection --config ($SourceRoot+'/tests/iam-ui-46/vitest.config.mjs') --configLoader native --reporter=json --outputFile $report --no-color *> $log
    $status=$LASTEXITCODE
    if($Oracle -eq 'PASS' -and $status -eq 0){
        & $node ($web+'/node_modules/typescript/bin/tsc') -p ($web+'/tsconfig.json') --noEmit *>> $log
        $typecheck=if($LASTEXITCODE -eq 0){'PASS'}else{'FAIL'}
    }
} finally { Pop-Location }
foreach($member in $projection){
    if((Get-FileHash -LiteralPath $member.source).Hash.ToLowerInvariant() -ne $member.hash){throw 'Shared input mutated'}
    if((Get-FileHash -LiteralPath ($web+'/'+$member.relative)).Hash.ToLowerInvariant() -ne $member.hash){throw 'Projected input mutated'}
}
if((Check-Source) -ne $inputCount){throw 'Source postflight mismatch'}
if((Get-FileHash -LiteralPath $node).Hash.ToLowerInvariant() -ne '3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237'){throw 'Node postflight drift'}
if(!(Test-Path -LiteralPath $report)){throw 'STOP: no executed Web result'}
$result=Get-Content -LiteralPath $report -Raw | ConvertFrom-Json
if($result.numTotalTests -ne $ExpectedCount){throw 'Executed count differs'}
if($Oracle -eq 'RED'){
    if($status -eq 0 -or $result.numFailedTests -lt 1){throw 'Expected genuine RED missing'}
} elseif($status -ne 0 -or $result.numPassedTests -ne $ExpectedCount -or $result.numFailedTests -ne 0 -or $result.numPendingTests -ne 0 -or $typecheck -ne 'PASS'){throw 'Web qualification/typecheck failure'}
@{source=$SourceSha;oracle=$Oracle;tests=$result.numTotalTests;passed=$result.numPassedTests;failed=$result.numFailedTests;
  inputs=$inputCount;packages=$packages;archives=$archives;packageFiles=$projection.Count;postflight='PASS';typecheck=$typecheck;
  logHash=(Get-FileHash -LiteralPath $log).Hash.ToLowerInvariant();reportHash=(Get-FileHash -LiteralPath $report).Hash.ToLowerInvariant()} | ConvertTo-Json -Compress
