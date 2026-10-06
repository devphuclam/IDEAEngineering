param([Parameter(Mandatory)][string]$Artifact)
$ErrorActionPreference = 'Stop'
$expectedHash = 'da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93'
$archive = $null
try {
    $artifactPath = (Resolve-Path -LiteralPath $Artifact).Path
    $isDirectory = Test-Path -LiteralPath $artifactPath -PathType Container
    if (-not $isDirectory) {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $archive = [System.IO.Compression.ZipFile]::OpenRead($artifactPath)
    }
    function Read-ArtifactBytes([string]$entryName) {
        if ($isDirectory) { return ,([System.IO.File]::ReadAllBytes((Join-Path $artifactPath $entryName))) }
        $entries = @($archive.Entries | Where-Object { $_.FullName -ceq "BOOT-INF/classes/static/$entryName" })
        if ($entries.Count -ne 1) { throw "RUNTIME_NOTICE_MISSING_OR_DUPLICATE=$entryName" }
        $stream = $entries[0].Open()
        $buffer = [System.IO.MemoryStream]::new()
        try { $stream.CopyTo($buffer); return ,$buffer.ToArray() }
        finally { $stream.Dispose(); $buffer.Dispose() }
    }
    $index = [System.Text.Encoding]::UTF8.GetString((Read-ArtifactBytes 'index.html'))
    foreach ($component in @('react', 'react-dom', 'scheduler')) {
        $entryName = "assets/licenses/$component.txt"
        $bytes = Read-ArtifactBytes $entryName
        $actualHash = [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant()
        if ($actualHash -ne $expectedHash) { throw "RUNTIME_NOTICE_HASH_MISMATCH=$component" }
        if ($index -cnotmatch ('href="/' + [regex]::Escape($entryName) + '"')) {
            throw "RUNTIME_NOTICE_LINK_MISSING=$component"
        }
    }
    'RUNTIME_NOTICES=PASS; exact_notice_hashes=3; index_links=3'
} finally { if ($archive) { $archive.Dispose() } }
