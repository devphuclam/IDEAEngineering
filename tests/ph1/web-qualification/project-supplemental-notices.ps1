param([Parameter(Mandatory)][ValidateSet('Server','Gateway')][string]$Profile,
      [Parameter(Mandatory)][string]$OutputName)
$ErrorActionPreference = 'Stop'
$repo = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$root = Join-Path $repo '.tmp/t036-supplemental-20261006-01'
if ($OutputName -cnotmatch '^(server|gateway)-(green|repeat|negative)-[0-9]+\.jar$') { throw 'INVALID_OWNED_OUTPUT_NAME' }
$output = [System.IO.Path]::GetFullPath((Join-Path $root $OutputName))
if (-not $output.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'UNSAFE_OUTPUT_PATH' }
if (Test-Path -LiteralPath $output) { throw 'OUTPUT_ALREADY_EXISTS' }
if ($Profile -eq 'Server') {
    $input = Join-Path $repo '.tmp/t036-notices-20261006-01/notice-projection.jar'
    $pin = 'dde3f36b1ad015d46c46585b78d77b660f7a62037e7ca7215574ec7186bcc151'
    $resources = Join-Path $repo 'apps/server/src/main/resources/third-party/ph1-runtime'
} else {
    $input = Join-Path $repo '.tmp/t036-mapping-20261006-01/gateway.jar'
    $pin = 'c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1'
    $resources = Join-Path $repo 'apps/gateway/src/main/resources/third-party/ph1-runtime'
}
if ((Get-FileHash -LiteralPath $input -Algorithm SHA256).Hash.ToLowerInvariant() -cne $pin) { throw 'RETAINED_INPUT_HASH_DRIFT' }
New-Item -ItemType Directory -Path $root -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
$original = [System.IO.Compression.ZipFile]::OpenRead($input)
$outputStream = [System.IO.File]::Open($output, [System.IO.FileMode]::CreateNew)
$zip = [System.IO.Compression.ZipArchive]::new($outputStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    # Update produced invalid retained-entry local headers in the first projection.
    # Copy all original uncompressed bytes into a fresh archive; never change the input.
    # Boot nested libraries remain STORED, not compressed nested archives.
    foreach ($oldEntry in $original.Entries) {
        $newEntry = $zip.CreateEntry($oldEntry.FullName, [System.IO.Compression.CompressionLevel]::NoCompression)
        $newEntry.LastWriteTime = $oldEntry.LastWriteTime
        $sourceStream = $oldEntry.Open()
        $targetStream = $newEntry.Open()
        try { $sourceStream.CopyTo($targetStream) }
        finally { $sourceStream.Dispose(); $targetStream.Dispose() }
    }
    foreach ($file in (Get-ChildItem -LiteralPath $resources -File -Filter '*.txt' | Sort-Object Name)) {
        $entryName = 'BOOT-INF/classes/third-party/ph1-runtime/' + $file.Name
        if ($original.GetEntry($entryName)) { throw 'SUPPLEMENTAL_ENTRY_ALREADY_EXISTS' }
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName) | Out-Null
    }
} finally { $zip.Dispose(); $outputStream.Dispose(); $original.Dispose() }
& (Join-Path $PSScriptRoot 'check-supplemental-notices.ps1') -Artifact $output -Profile $Profile -BaselineArtifact $input
if ((Get-FileHash -LiteralPath $input -Algorithm SHA256).Hash.ToLowerInvariant() -cne $pin) { throw 'RETAINED_INPUT_CHANGED' }
'PROJECTION_SHA256=' + (Get-FileHash -LiteralPath $output -Algorithm SHA256).Hash.ToLowerInvariant()
