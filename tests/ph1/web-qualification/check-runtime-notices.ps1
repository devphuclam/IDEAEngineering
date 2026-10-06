param([Parameter(Mandatory)][string]$Artifact, [string]$BaselineArtifact)
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
    if ($BaselineArtifact) {
        if (-not $archive) { throw 'BASELINE_COMPARISON_REQUIRES_JAR' }
        $baseline = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $BaselineArtifact).Path)
        try {
            $oldEntries = @($baseline.Entries | Where-Object { -not $_.FullName.StartsWith('BOOT-INF/classes/static/', [StringComparison]::Ordinal) })
            $newEntries = @($archive.Entries | Where-Object { -not $_.FullName.StartsWith('BOOT-INF/classes/static/', [StringComparison]::Ordinal) })
            if ($oldEntries.Count -ne $newEntries.Count) { throw 'NON_STATIC_ENTRY_SET_CHANGED' }
            foreach ($oldEntry in $oldEntries) {
                $matching = @($newEntries | Where-Object { $_.FullName -ceq $oldEntry.FullName })
                if ($matching.Count -ne 1) { throw 'NON_STATIC_ENTRY_MISSING_OR_DUPLICATE' }
                $oldStream = $oldEntry.Open()
                $newStream = $matching[0].Open()
                try {
                    $oldHash = [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($oldStream))
                    $newHash = [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($newStream))
                    if ($oldHash -ne $newHash) { throw "NON_STATIC_BYTES_CHANGED=$($oldEntry.FullName)" }
                } finally { $oldStream.Dispose(); $newStream.Dispose() }
            }
            "NON_STATIC_CONTENT=PASS; entries=$($oldEntries.Count)"
        } finally { $baseline.Dispose() }
    }
} finally { if ($archive) { $archive.Dispose() } }
