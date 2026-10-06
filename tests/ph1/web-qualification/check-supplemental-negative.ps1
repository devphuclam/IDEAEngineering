param([Parameter(Mandatory)][ValidateSet('Server','Gateway')][string]$Profile)
$ErrorActionPreference = 'Stop'
$repo = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$stem = $Profile.ToLowerInvariant()
$root = Join-Path $repo '.tmp/t036-supplemental-20261006-01'
$inputPath = Join-Path $root "$stem-green-02.jar"
$outputPath = Join-Path $root "$stem-negative-01.jar"
if (Test-Path -LiteralPath $outputPath) { throw 'NEGATIVE_FIXTURE_ALREADY_EXISTS' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$old = [System.IO.Compression.ZipFile]::OpenRead($inputPath)
$output = [System.IO.File]::Open($outputPath, [System.IO.FileMode]::CreateNew)
$zip = [System.IO.Compression.ZipArchive]::new($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($entry in $old.Entries) {
        $new = $zip.CreateEntry($entry.FullName, [System.IO.Compression.CompressionLevel]::NoCompression)
        $target = $new.Open()
        try {
            if ($entry.FullName -ceq 'BOOT-INF/classes/third-party/ph1-runtime/snakeyaml-2.6-LICENSE.txt') {
                $target.WriteByte(0) # Synthetic damaged legal copy; never alter the real resource.
            } else {
                $source = $entry.Open()
                try { $source.CopyTo($target) } finally { $source.Dispose() }
            }
        } finally { $target.Dispose() }
    }
} finally { $zip.Dispose(); $output.Dispose(); $old.Dispose() }
try {
    & (Join-Path $PSScriptRoot 'check-supplemental-notices.ps1') -Artifact $outputPath -Profile $Profile
} catch {
    if ($_.Exception.Message -ceq 'SUPPLEMENTAL_NOTICE_HASH_MISMATCH=snakeyaml-2.6-LICENSE.txt') {
        "DAMAGED_NOTICE_REFUSAL=PASS; profile=$Profile"
        return
    }
    throw
}
throw 'DAMAGED_NOTICE_FALSE_PASS'
