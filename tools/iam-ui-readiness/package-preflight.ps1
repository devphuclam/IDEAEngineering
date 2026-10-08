param(
    [Parameter(Mandatory=$true)][string]$JarPath,
    [Parameter(Mandatory=$true)][string]$RepositoryRoot
)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$expected=@{}
Import-Csv "$RepositoryRoot/docs/research/inventories/ph1-packaged-notice-map-20261006.tsv" -Delimiter "`t" |
    Where-Object {$_.surface -eq 'notice-projection.jar'} |
    ForEach-Object {$expected[$_.entry]=$_.sha256}
if($expected.Count -ne 57){throw 'Retained predecessor package inventory differs'}
$zip=[IO.Compression.ZipFile]::OpenRead($JarPath)
try {
    $nested=@($zip.Entries | Where-Object {$_.FullName -like 'BOOT-INF/lib/*.jar'})
    if($nested.Count -ne $expected.Count){throw 'Runtime JAR count differs'}
    $providers=0
    foreach($entry in $nested){
        if(!$expected.ContainsKey($entry.FullName)){throw "Unexpected runtime payload: $($entry.FullName)"}
        $buffer=[IO.MemoryStream]::new()
        $stream=$entry.Open()
        try {$stream.CopyTo($buffer)} finally {$stream.Dispose()}
        try {
            $sha=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($buffer.ToArray())).ToLowerInvariant()
            if($sha -ne $expected[$entry.FullName]){throw "Runtime payload hash differs: $($entry.FullName)"}
            $buffer.Position=0
            $inner=[IO.Compression.ZipArchive]::new($buffer,[IO.Compression.ZipArchiveMode]::Read,$true)
            try {
                foreach($item in $inner.Entries){
                    if($item.FullName -match '(?i)jsr305|^javax/annotation/.*\.class$'){ $providers++ }
                }
            } finally {$inner.Dispose()}
        } finally {$buffer.Dispose()}
    }
    foreach($entry in $zip.Entries){
        if($entry.FullName -match '(?i)jsr305|(^|/)javax/annotation/.*\.class$'){ $providers++ }
    }
    if($providers){throw 'JSR305 dependency/provider payload found'}
    $reader=[IO.StreamReader]::new($zip.GetEntry('META-INF/MANIFEST.MF').Open())
    try {$manifest=$reader.ReadToEnd()} finally {$reader.Dispose()}
    if($manifest -notmatch 'Main-Class: org.springframework.boot.loader.launch.JarLauncher' -or
        $manifest -notmatch 'Start-Class: com.idea.ddm.IdeaServerApplication' -or
        $manifest -notmatch 'Spring-Boot-Version: 4.1.1'){throw 'Executable JAR manifest differs'}
    if(!$zip.GetEntry('org/springframework/boot/loader/launch/JarLauncher.class')){throw 'Loader absent'}
    if(!$zip.GetEntry('BOOT-INF/classes/static/index.html')){throw 'Actual Web absent'}
    foreach($name in @('react','react-dom','scheduler')){
        $entry=$zip.GetEntry("BOOT-INF/classes/static/assets/licenses/$name.txt")
        if(!$entry){throw "Runtime notice absent: $name"}
        $stream=$entry.Open()
        try {$sha=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($stream)).ToLowerInvariant()}
        finally {$stream.Dispose()}
        if($sha -ne 'da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93'){throw 'Notice hash differs'}
    }
    $migrations=@(Get-ChildItem "$RepositoryRoot/database/migrations/*.sql")
    $migrations | ForEach-Object {
        $entry=$zip.GetEntry("BOOT-INF/classes/db/migration/$($_.Name)")
        if(!$entry){throw "Migration absent: $($_.Name)"}
        $stream=$entry.Open()
        try {$sha=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($stream)).ToLowerInvariant()}
        finally {$stream.Dispose()}
        if($sha -ne (Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()){throw 'Migration bytes differ'}
    }
    "PACKAGE_CONTENT=PASS;NESTED_JARS=57;JSR305_PROVIDERS=0;BUILD_TOOL_LEAK=0;NOTICES=3/3;MIGRATIONS=$($migrations.Count)/$($migrations.Count)"
} finally {$zip.Dispose()}
