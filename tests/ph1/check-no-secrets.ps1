param(
    [Parameter()]
    [string]$RepositoryRoot = (Join-Path $PSScriptRoot '..\..')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$sensitiveName = '(?:[A-Za-z0-9_.-]+[_-])?(?:password|passwd|pwd|secret|client[_-]?secret|apikey|api[_-]?key|access[_-]?token|refresh[_-]?token|auth[_-]?token|private[_-]?key|bearer)'
$quotedCredentialAssignment = [regex]::new(
    "(?i)(?:\b|['\""`])\`$?(?<name>$sensitiveName)(?:\b|['\""`])\s*(?:=|:)\s*(?<quote>['\""`])(?<candidate>.+?)\k<quote>"
)
$configCredentialAssignment = [regex]::new(
    "(?i)^\s*(?:export\s+)?\`$?(?<name>$sensitiveName)\s*(?:=|:)\s*(?<candidate>[^#\r\n]+)"
)
$privateKeyMarker = [regex]::new('-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----')
$tokenPatterns = @(
    [pscustomobject]@{ Name = 'cloud-access-key'; Pattern = [regex]::new('\bAKIA[0-9A-Z]{16}\b') }
    [pscustomobject]@{ Name = 'source-control-token'; Pattern = [regex]::new('\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b') }
    [pscustomobject]@{ Name = 'messaging-token'; Pattern = [regex]::new('\bxox[baprs]-[A-Za-z0-9-]{20,}\b') }
)
$placeholder = [regex]::new(
    '^(?i:|null|none|false|true|undefined|changeme|change[_-].*|replace[_-].*|insert[_-].*|put[_-].*|placeholder|example|sample|dummy|fake|synthetic|fixture|your(?:[_-].*)?|<[^>]+>|\$\{[^}]+\}|\$[A-Za-z_][A-Za-z0-9_]*|%[A-Z_][A-Z0-9_]*%|xxx+|\*+|redacted|not.?set|todo)$'
)
$binaryExtensions = @('.docx', '.ico', '.pdf', '.png', '.pptx', '.ttf', '.zip')
# These pre-existing corpora deliberately contain fake credentials/tokens for qualification tests;
# keep them out of the Core v0 source check and review them under their own test-data controls.
$knownSyntheticFixtureRoots = @('qualification/', 'tools/agent-workspace/test/')
$knownSyntheticFixtureFiles = @('tests/verify-template.test.sh')

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
        if ($metadata -notmatch '^(?<mode>[0-7]{6}) [0-9a-f]{40,64} [0-3]$') {
            throw 'Git returned an unreadable tracked-file record.'
        }

        [pscustomobject]@{
            Mode = $Matches.mode
            Path = $path
        }
    }
}

function Test-Placeholder([string]$candidate) {
    $value = $candidate.Trim().Trim('"', "'", '`')
    return $placeholder.IsMatch($value)
}

function Test-KnownBinaryFile([string]$path) {
    if ([System.IO.Path]::GetExtension($path).ToLowerInvariant() -in $binaryExtensions) {
        return $true
    }

    $stream = [System.IO.File]::OpenRead($path)
    try {
        $prefix = [byte[]]::new(8192)
        $length = $stream.Read($prefix, 0, $prefix.Length)
    }
    finally {
        $stream.Dispose()
    }

    if ($length -eq 0) {
        return $false
    }

    $bytes = $prefix[0..($length - 1)]
    $hasUnicodeBom = ($length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) -or
        ($length -ge 2 -and $bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF)
    if (-not $hasUnicodeBom -and $bytes -contains 0) {
        return $true
    }

    $hex = [System.Convert]::ToHexString($bytes[0..([Math]::Min(7, $length - 1))])
    return $hex.StartsWith('D0CF11E0A1B11AE1') -or
        $hex.StartsWith('504B0304') -or
        $hex.StartsWith('25504446') -or
        $hex.StartsWith('89504E47') -or
        $hex.StartsWith('FFD8FF') -or
        $hex.StartsWith('47494638') -or
        $hex.StartsWith('7F454C46') -or
        $hex.StartsWith('4D5A')
}

try {
    $rootPath = [System.IO.Path]::GetFullPath($RepositoryRoot).TrimEnd([char[]]@('\', '/'))
    if (-not (Test-Path -LiteralPath $rootPath -PathType Container)) {
        Stop-WithError 'Repository root does not exist.'
    }

    $rootPrefix = $rootPath + [System.IO.Path]::DirectorySeparatorChar
    $findings = [System.Collections.Generic.List[string]]::new()
    $skippedSpecialFiles = [System.Collections.Generic.List[string]]::new()
    $skippedBinaryFiles = 0
    $excludedSyntheticFixtures = 0

    foreach ($entry in @(Get-TrackedFiles $rootPath)) {
        if ($knownSyntheticFixtureFiles -contains $entry.Path -or
            @($knownSyntheticFixtureRoots | Where-Object { $entry.Path.StartsWith($_, [System.StringComparison]::Ordinal) }).Count -gt 0) {
            $excludedSyntheticFixtures++
            continue
        }

        if ($entry.Mode -notin @('100644', '100755')) {
            $skippedSpecialFiles.Add($entry.Path)
            continue
        }

        $relativePath = $entry.Path.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::GetFullPath((Join-Path $rootPath $relativePath))
        if (-not $filePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw 'Git returned a path outside the repository root.'
        }

        if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
            continue
        }

        if (Test-KnownBinaryFile $filePath) {
            $skippedBinaryFiles++
            continue
        }

        if ([System.IO.File]::GetAttributes($filePath).HasFlag([System.IO.FileAttributes]::ReparsePoint)) {
            $skippedSpecialFiles.Add($entry.Path)
            continue
        }

        $fileFindings = [System.Collections.Generic.List[string]]::new()
        $isBinary = $false
        $reader = [System.IO.StreamReader]::new(
            $filePath,
            [System.Text.UTF8Encoding]::new($false, $true),
            $true
        )
        try {
            while ($null -ne ($line = $reader.ReadLine())) {
                if ($line.IndexOf([char]0) -ge 0) {
                    $isBinary = $true
                    break
                }

                if ($privateKeyMarker.IsMatch($line)) {
                    $fileFindings.Add('private-key')
                }

                $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
                $matches = @($quotedCredentialAssignment.Matches($line))
                if ($extension -in @('.env', '.example', '.ini', '.properties', '.toml', '.yaml', '.yml', '.conf', '.cfg')) {
                    $matches += @($configCredentialAssignment.Matches($line))
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
        }
        finally {
            $reader.Dispose()
        }

        if (-not $isBinary) {
            foreach ($category in ($fileFindings | Sort-Object -Unique)) {
                $findings.Add("$($entry.Path) ($category)")
            }
        }
        else {
            $skippedBinaryFiles++
        }
    }

    if ($skippedSpecialFiles.Count -gt 0) {
        foreach ($path in $skippedSpecialFiles) {
            [Console]::Error.WriteLine("UNSCANNED: $path (non-regular tracked file)")
        }
        Stop-WithError 'One or more non-regular tracked files could not be scanned.'
    }

    if ($findings.Count -gt 0) {
        foreach ($finding in $findings) {
            [Console]::Error.WriteLine("FINDING: $finding")
        }
        exit 1
    }

    [Console]::WriteLine("PASS: no secret-like values found in scanned tracked UTF-8 text files; excluded known synthetic fixture files: $excludedSyntheticFixtures; skipped known binary files: $skippedBinaryFiles.")
    exit 0
}
catch [System.Text.DecoderFallbackException] {
    Stop-WithError 'A tracked text file could not be decoded as UTF-8.'
}
catch {
    Stop-WithError 'Secret check could not complete; inspect repository/tool availability without printing file contents.'
}
