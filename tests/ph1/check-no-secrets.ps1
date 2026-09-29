param(
    [Parameter()]
    [string]$RepositoryRoot = (Join-Path $PSScriptRoot '..\..')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$sensitiveName = '(?:[A-Za-z0-9_.-]+[_-])?(?:password|passwd|pwd|client[_-]?secret|secret[_-]?key|secret|apikey|api[_-]?key|access[_-]?token|refresh[_-]?token|auth[_-]?token|private[_-]?key|bearer)'
$quotedCredentialAssignment = [regex]::new(
    "(?i)(?:\b|[\x27\x22\x60])\`$?(?<name>$sensitiveName)(?:\b|[\x27\x22\x60])\s*(?:=|:)\s*(?<quote>[\x27\x22\x60])(?<candidate>.+?)\k<quote>"
)
$unquotedCredentialAssignment = [regex]::new(
    "(?i)^\s*(?:(?:export|local|readonly)(?:\s+-[a-z]+)*\s+|declare(?:\s+-[a-z]+)*\s+)?\`$?(?<name>$sensitiveName)\s*(?:=|:)\s*(?<candidate>[^#\r\n]+)"
)
$unquotedCredentialExtensions = @(
    '.env', '.example', '.ini', '.properties', '.toml', '.yaml', '.yml', '.conf', '.cfg',
    '.sh', '.bash', '.zsh', '.fish'
)
$privateKeyMarker = [regex]::new('-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----')
$tokenPatterns = @(
    [pscustomobject]@{ Name = 'cloud-access-key'; Pattern = [regex]::new('\bAKIA[0-9A-Z]{16}\b') }
    [pscustomobject]@{ Name = 'source-control-token'; Pattern = [regex]::new('\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b') }
    [pscustomobject]@{ Name = 'messaging-token'; Pattern = [regex]::new('\bxox[baprs]-[A-Za-z0-9-]{20,}\b') }
)
$placeholder = [regex]::new(
    '^(?i:|null|none|false|true|undefined|changeme|change[_-].*|replace[_-].*|insert[_-].*|put[_-].*|placeholder|example|sample|dummy|fake|synthetic|fixture|your(?:[_-].*)?|<[^>]+>|\$\{[^}]+\}|\$\([^)]*\)|\$[A-Za-z_][A-Za-z0-9_]*|\(\)|%[A-Z_][A-Z0-9_]*%|xxx+|\*+|redacted|not.?set|todo)$'
)
$binaryExtensions = @('.docx', '.ico', '.pdf', '.png', '.pptx', '.ttf', '.zip')
function Stop-WithError([string]$message) {
    [Console]::Error.WriteLine("ERROR: $message")
    exit 2
}

function Get-TrackedFiles([string]$root) {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = 'git'
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $startInfo.StandardErrorEncoding = [System.Text.Encoding]::UTF8
    foreach ($argument in @('-C', $root, 'ls-files', '--stage', '-z', '--')) {
        $startInfo.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($startInfo)
    $output = $process.StandardOutput.ReadToEnd()
    $null = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
        throw 'Git could not enumerate tracked files.'
    }

    foreach ($record in $output.Split([char]0, [System.StringSplitOptions]::RemoveEmptyEntries)) {
        $tab = $record.IndexOf("`t")
        if ($tab -lt 1) {
            throw 'Git returned an unreadable tracked-file record.'
        }

        $metadata = $record.Substring(0, $tab)
        $path = $record.Substring($tab + 1)
        if ($metadata -notmatch '^(?<mode>[0-7]{6}) (?<objectId>[0-9a-f]{40,64}) (?<stage>[0-3])$') {
            throw 'Git returned an unreadable tracked-file record.'
        }

        [pscustomobject]@{
            Mode = $Matches.mode
            ObjectId = $Matches.objectId
            Stage = [int]$Matches.stage
            Path = $path
        }
    }
}

function Get-UnstagedChangedPaths([string]$root) {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = 'git'
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $startInfo.StandardErrorEncoding = [System.Text.Encoding]::UTF8
    foreach ($argument in @('-C', $root, 'diff', '--name-only', '-z', '--')) {
        $startInfo.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($startInfo)
    $output = $process.StandardOutput.ReadToEnd()
    $null = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
        throw 'Git could not enumerate unstaged tracked-file changes.'
    }

    $paths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    foreach ($path in $output.Split([char]0, [System.StringSplitOptions]::RemoveEmptyEntries)) {
        $null = $paths.Add($path)
    }
    return ,$paths
}

function Get-GitBlobBytes([string]$root, [string]$objectId) {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = 'git'
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    foreach ($argument in @('-C', $root, 'cat-file', 'blob', $objectId)) {
        $startInfo.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($startInfo)
    $content = [System.IO.MemoryStream]::new()
    try {
        $process.StandardOutput.BaseStream.CopyTo($content)
        $null = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) {
            throw 'Git could not read an indexed tracked-file object.'
        }
        return ,$content.ToArray()
    }
    finally {
        $content.Dispose()
        $process.Dispose()
    }
}

function Get-GitObjectId([string]$root, [string]$expression) {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = 'git'
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $startInfo.StandardErrorEncoding = [System.Text.Encoding]::UTF8
    foreach ($argument in @('-C', $root, 'rev-parse', '--verify', $expression)) {
        $startInfo.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($startInfo)
    $output = $process.StandardOutput.ReadToEnd()
    $null = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    $objectId = $output.Trim()
    if ($process.ExitCode -ne 0 -or $objectId -notmatch '^[0-9a-f]{40,64}$') {
        throw 'Git could not resolve the committed synthetic-fixture manifest.'
    }

    return $objectId
}

function Read-KnownSyntheticFixtureHashes([string]$root) {
    $manifestRelativePath = 'tests/ph1/known-synthetic-fixtures.json'
    # Only committed HEAD policy may exempt bytes; worktree/index edits must not expand an exemption.
    $manifestObjectId = Get-GitObjectId $root "HEAD:$manifestRelativePath"
    $manifestBytes = Get-GitBlobBytes $root $manifestObjectId
    $manifestText = [System.Text.UTF8Encoding]::new($false, $true).GetString($manifestBytes)
    $manifest = $manifestText | ConvertFrom-Json -AsHashtable
    if ($manifest.schemaVersion -ne 1 -or $null -eq $manifest.files) {
        throw 'Known synthetic fixture manifest has an unsupported schema.'
    }

    $hashes = [System.Collections.Generic.Dictionary[string, string]]::new([System.StringComparer]::Ordinal)
    foreach ($entry in $manifest.files) {
        if ($entry.path -notmatch '^(?:qualification/|tools/agent-workspace/test/|tests/verify-template\.test\.sh$)' -or
            $entry.path.Contains('..') -or
            $entry.sha256 -notmatch '^[A-Fa-f0-9]{64}$' -or
            [string]::IsNullOrWhiteSpace($entry.reason) -or
            $hashes.ContainsKey($entry.path)) {
            throw 'Known synthetic fixture manifest contains an invalid entry.'
        }

        $hashes.Add($entry.path, $entry.sha256.ToUpperInvariant())
    }

    return ,$hashes
}

function Get-CanonicalTextSha256([byte[]]$bytes) {
    $strictUtf8 = [System.Text.UTF8Encoding]::new($false, $true)
    $text = $strictUtf8.GetString($bytes).Replace("`r`n", "`n").Replace("`r", "`n")
    $canonicalBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($text)
    return [System.Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($canonicalBytes))
}

function Test-KnownSyntheticFixture([string]$path, [byte[]]$bytes, [System.Collections.Generic.Dictionary[string, string]]$hashes) {
    if (-not $hashes.ContainsKey($path)) {
        return $false
    }

    return (Get-CanonicalTextSha256 $bytes) -ceq $hashes[$path]
}

function Test-Placeholder([string]$candidate) {
    $value = $candidate.Trim().Trim('"', "'", '`')
    return $placeholder.IsMatch($value)
}

function Test-KnownBinaryBytes([byte[]]$bytes, [string]$path) {
    if ([System.IO.Path]::GetExtension($path).ToLowerInvariant() -in $binaryExtensions) {
        return $true
    }

    if ($bytes.Length -eq 0) {
        return $false
    }

    $length = [Math]::Min(8192, $bytes.Length)
    $prefix = $bytes[0..($length - 1)]
    $hasUnicodeBom = ($length -ge 2 -and $prefix[0] -eq 0xFF -and $prefix[1] -eq 0xFE) -or
        ($length -ge 2 -and $prefix[0] -eq 0xFE -and $prefix[1] -eq 0xFF)
    if (-not $hasUnicodeBom -and $prefix -contains 0) {
        return $true
    }

    $hex = [System.Convert]::ToHexString($prefix[0..([Math]::Min(7, $length - 1))])
    return $hex.StartsWith('D0CF11E0A1B11AE1') -or
        $hex.StartsWith('504B0304') -or
        $hex.StartsWith('25504446') -or
        $hex.StartsWith('89504E47') -or
        $hex.StartsWith('FFD8FF') -or
        $hex.StartsWith('47494638') -or
        $hex.StartsWith('7F454C46') -or
        $hex.StartsWith('4D5A')
}

function Test-KnownBinaryFile([string]$path) {
    if ([System.IO.Path]::GetExtension($path).ToLowerInvariant() -in $binaryExtensions) {
        return $true
    }

    $stream = [System.IO.File]::OpenRead($path)
    try {
        $prefix = [byte[]]::new(8192)
        $length = $stream.Read($prefix, 0, $prefix.Length)
        if ($length -eq 0) {
            return $false
        }
        return Test-KnownBinaryBytes $prefix[0..($length - 1)] $path
    }
    finally {
        $stream.Dispose()
    }
}

function Get-FileFindings([System.IO.TextReader]$reader, [string]$path) {
    $fileFindings = [System.Collections.Generic.List[string]]::new()
    $isBinary = $false
    while ($null -ne ($line = $reader.ReadLine())) {
        if ($line.IndexOf([char]0) -ge 0) {
            $isBinary = $true
            break
        }

        if ($privateKeyMarker.IsMatch($line)) {
            $fileFindings.Add('private-key')
        }

        $extension = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
        $leafName = [System.IO.Path]::GetFileName($path)
        $isEnvironmentFile = $leafName -match '(?i)^\.env(?:$|[.-])'
        $matches = @($quotedCredentialAssignment.Matches($line))
        if ($extension -in $unquotedCredentialExtensions -or $isEnvironmentFile) {
            $matches += @($unquotedCredentialAssignment.Matches($line))
        }

        foreach ($match in $matches) {
            if (-not (Test-Placeholder $match.Groups['candidate'].Value)) {
                $fileFindings.Add('credential-assignment')
            }
        }

        foreach ($tokenPattern in $tokenPatterns) {
            if ($tokenPattern.Pattern.IsMatch($line)) {
                $fileFindings.Add($tokenPattern.Name)
            }
        }
    }

    return [pscustomobject]@{
        IsBinary = $isBinary
        Categories = @($fileFindings | Sort-Object -Unique)
    }
}

try {
    $rootPath = [System.IO.Path]::GetFullPath($RepositoryRoot).TrimEnd([char[]]@('\', '/'))
    if (-not (Test-Path -LiteralPath $rootPath -PathType Container)) {
        Stop-WithError 'Repository root does not exist.'
    }

    $rootPrefix = $rootPath + [System.IO.Path]::DirectorySeparatorChar
    $findings = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $skippedSpecialFiles = [System.Collections.Generic.List[string]]::new()
    $knownSyntheticFixtureHashes = Read-KnownSyntheticFixtureHashes $rootPath
    $recognizedSyntheticFixtures = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $skippedBinaryFiles = 0
    $unstagedChangedPaths = Get-UnstagedChangedPaths $rootPath

    foreach ($entry in @(Get-TrackedFiles $rootPath)) {
        if ($entry.Stage -ne 0) {
            $skippedSpecialFiles.Add("$($entry.Path) (unmerged index entry)")
            continue
        }

        if ($entry.Mode -notin @('100644', '100755')) {
            $skippedSpecialFiles.Add("$($entry.Path) (non-regular index entry)")
            continue
        }

        $relativePath = $entry.Path.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::GetFullPath((Join-Path $rootPath $relativePath))
        if (-not $filePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw 'Git returned a path outside the repository root.'
        }

        if (Test-Path -LiteralPath $filePath) {
            $attributes = [System.IO.File]::GetAttributes($filePath)
            if ($attributes.HasFlag([System.IO.FileAttributes]::ReparsePoint) -or
                $attributes.HasFlag([System.IO.FileAttributes]::Directory)) {
                $skippedSpecialFiles.Add("$($entry.Path) (working-tree reparse point or directory)")
                continue
            }
        }

        $workingFileExists = Test-Path -LiteralPath $filePath -PathType Leaf
        # If the working copy differs from or is missing an indexed path, scan both versions.
        # This prevents a safe local edit or deletion from hiding content staged for commit.
        $scanIndexedVersion = $unstagedChangedPaths.Contains($entry.Path) -or -not $workingFileExists
        if ($scanIndexedVersion) {
            if ([System.IO.Path]::GetExtension($entry.Path).ToLowerInvariant() -in $binaryExtensions) {
                $skippedBinaryFiles++
            }
            else {
                $indexedBytes = Get-GitBlobBytes $rootPath $entry.ObjectId
                if (Test-KnownSyntheticFixture $entry.Path $indexedBytes $knownSyntheticFixtureHashes) {
                    $null = $recognizedSyntheticFixtures.Add($entry.Path)
                }
                elseif (Test-KnownBinaryBytes $indexedBytes $entry.Path) {
                    $skippedBinaryFiles++
                }
                else {
                    $indexedStream = [System.IO.MemoryStream]::new($indexedBytes)
                    $indexedReader = [System.IO.StreamReader]::new(
                        $indexedStream,
                        [System.Text.UTF8Encoding]::new($false, $true),
                        $true
                    )
                    try {
                        $indexedResult = Get-FileFindings $indexedReader $filePath
                    }
                    finally {
                        $indexedReader.Dispose()
                    }

                    if ($indexedResult.IsBinary) {
                        $skippedBinaryFiles++
                    }
                    else {
                        foreach ($category in $indexedResult.Categories) {
                            $null = $findings.Add("$($entry.Path) ($category)")
                        }
                    }
                }
            }
        }

        if (-not $workingFileExists) {
            continue
        }

        if ($knownSyntheticFixtureHashes.ContainsKey($entry.Path)) {
            $workingBytes = [System.IO.File]::ReadAllBytes($filePath)
            if (Test-KnownSyntheticFixture $entry.Path $workingBytes $knownSyntheticFixtureHashes) {
                $null = $recognizedSyntheticFixtures.Add($entry.Path)
                continue
            }
        }

        if (Test-KnownBinaryFile $filePath) {
            $skippedBinaryFiles++
            continue
        }

        $reader = [System.IO.StreamReader]::new(
            $filePath,
            [System.Text.UTF8Encoding]::new($false, $true),
            $true
        )
        try {
            $workingResult = Get-FileFindings $reader $filePath
        }
        finally {
            $reader.Dispose()
        }

        if (-not $workingResult.IsBinary) {
            foreach ($category in $workingResult.Categories) {
                $null = $findings.Add("$($entry.Path) ($category)")
            }
        }
        else {
            $skippedBinaryFiles++
        }
    }

    if ($skippedSpecialFiles.Count -gt 0) {
        foreach ($path in $skippedSpecialFiles) {
            [Console]::Error.WriteLine("UNSCANNED: $path")
        }
        Stop-WithError 'One or more tracked-file versions could not be scanned.'
    }

    if ($findings.Count -gt 0) {
        foreach ($finding in ($findings | Sort-Object)) {
            [Console]::Error.WriteLine("FINDING: $finding")
        }
        exit 1
    }

    [Console]::WriteLine("PASS: no secret-like values found in scanned tracked UTF-8 text files; exact synthetic fixture contents recognized: $($recognizedSyntheticFixtures.Count); skipped known binary files: $skippedBinaryFiles.")
    exit 0
}
catch [System.Text.DecoderFallbackException] {
    Stop-WithError 'A tracked text file could not be decoded as UTF-8.'
}
catch {
    Stop-WithError 'Secret check could not complete; inspect repository/tool availability without printing file contents.'
}
