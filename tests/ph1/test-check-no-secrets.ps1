param()

$ErrorActionPreference = 'Stop'
$scannerPath = Join-Path $PSScriptRoot 'check-no-secrets.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('idea-secret-check-test-' + [guid]::NewGuid().ToString('N'))

function Assert-True([bool]$condition, [string]$message) {
    if (-not $condition) { throw $message }
}

function Invoke-Git([string]$root, [string[]]$gitArgs) {
    $gitOutput = & git -C $root @gitArgs 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Git fixture setup failed at command: git $($gitArgs -join ' ') (exit $LASTEXITCODE): $($gitOutput -join ' ')"
    }
}

function Invoke-Scanner([string]$root) {
    if (-not (Test-Path -LiteralPath $scannerPath -PathType Leaf)) {
        throw 'Secret scanner script is missing.'
    }

    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = (Get-Process -Id $PID).Path
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $startInfo.StandardErrorEncoding = [System.Text.Encoding]::UTF8
    foreach ($argument in @('-NoProfile', '-File', $scannerPath, '-RepositoryRoot', $root)) {
        $startInfo.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($startInfo)
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    return [pscustomobject]@{
        ExitCode = $process.ExitCode
        Output = ($stdout + $stderr)
    }
}

try {
    $fixtureRoot = Join-Path $tempRoot 'repo'
    New-Item -ItemType Directory -Path $fixtureRoot -Force | Out-Null
    Invoke-Git $fixtureRoot @('init', '--quiet')
    Invoke-Git $fixtureRoot @('config', 'user.name', 'IDEA secret-check fixture')
    Invoke-Git $fixtureRoot @('config', 'user.email', 'fixture@example.invalid')
    Invoke-Git $fixtureRoot @('config', 'core.autocrlf', 'false')
    Invoke-Git $fixtureRoot @('config', 'commit.gpgsign', 'false')

    $ignoreRule = '.env' + "`n"
    [System.IO.File]::WriteAllText((Join-Path $fixtureRoot '.gitignore'), $ignoreRule, [System.Text.Encoding]::UTF8)
    $placeholderName = 'PASS' + 'WORD'
    $placeholderValue = 'REPLACE' + '_ME'
    [System.IO.File]::WriteAllText((Join-Path $fixtureRoot 'config.example'), "$placeholderName=$placeholderValue`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText((Join-Path $fixtureRoot 'README.md'), "Synthetic scanner fixture.`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', '.gitignore', 'config.example', 'README.md')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'clean fixture baseline')

    $ignoredName = 'PASS' + 'WORD'
    $ignoredValue = ('ignored-fixture-' + [guid]::NewGuid().ToString('N'))
    [System.IO.File]::WriteAllText((Join-Path $fixtureRoot '.env'), "$ignoredName=$ignoredValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('check-ignore', '--quiet', '--', '.env')

    # Alphanumeric-only values resemble ordinary generated credentials and must not be
    # mistaken for placeholders merely because they contain no punctuation.
    $value = 'SyntheticCredential' + [guid]::NewGuid().ToString('N')
    $fieldName = 'pass' + 'word'
    $fixturePath = Join-Path $fixtureRoot 'tracked-fixture.json'
    [System.IO.File]::WriteAllText($fixturePath, ('"' + $fieldName + '": "' + $value + '"' + "`n"), [System.Text.Encoding]::UTF8)
    $yamlFixturePath = Join-Path $fixtureRoot 'settings.yaml'
    $yamlFieldName = 'secret' + '_key'
    [System.IO.File]::WriteAllText($yamlFixturePath, "$yamlFieldName`: $value`n", [System.Text.Encoding]::UTF8)
    $envLocalFixturePath = Join-Path $fixtureRoot '.env.local'
    [System.IO.File]::WriteAllText($envLocalFixturePath, "$fieldName=$value`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'tracked-fixture.json', 'settings.yaml')
    Invoke-Git $fixtureRoot @('add', '--force', '--', '.env.local')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic credential fixture')

    $leakResult = Invoke-Scanner $fixtureRoot
    Assert-True ($leakResult.ExitCode -eq 1) 'Expected exit code 1 for the tracked synthetic credential fixture.'
    Assert-True ($leakResult.Output -match 'tracked-fixture\.json') 'Expected the finding to identify the affected file.'
    Assert-True ($leakResult.Output -match 'settings\.yaml') 'Expected an unquoted YAML credential assignment to be detected.'
    Assert-True ($leakResult.Output -match '\.env\.local') 'Expected a tracked .env.local assignment to be detected.'
    Assert-True ($leakResult.Output -match 'credential-assignment') 'Expected the finding to identify the type of issue.'
    Assert-True ($leakResult.Output -notmatch [regex]::Escape($value)) 'Scanner output exposed the synthetic credential value.'
    Assert-True ($leakResult.Output -notmatch [regex]::Escape($ignoredValue)) 'Ignored local configuration was scanned or exposed.'

    # The Git index is the content a commit will contain. A safe or missing working-tree copy
    # must not hide a credential that remains in that index.
    [System.IO.File]::Delete($fixturePath)
    [System.IO.File]::WriteAllText($yamlFixturePath, "example: value`n", [System.Text.Encoding]::UTF8)
    $deletedWorkingCopyResult = Invoke-Scanner $fixtureRoot
    Assert-True ($deletedWorkingCopyResult.ExitCode -eq 1) 'Expected indexed credentials to be detected when the working copy is deleted or sanitized.'
    Assert-True ($deletedWorkingCopyResult.Output -match 'tracked-fixture\.json') 'Expected the indexed credential in the deleted working copy to be reported.'
    Assert-True ($deletedWorkingCopyResult.Output -match 'settings\.yaml') 'Expected the indexed credential hidden by a safe working copy to be reported.'
    Assert-True ($deletedWorkingCopyResult.Output -notmatch [regex]::Escape($value)) 'Scanner output exposed the indexed synthetic credential value.'

    [System.IO.File]::WriteAllText($fixturePath, "{}`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'tracked-fixture.json', 'settings.yaml')
    [System.IO.File]::WriteAllText($envLocalFixturePath, "$fieldName=$placeholderValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', '.env.local')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'clean tracked fixture after deletion test')

    [System.IO.File]::WriteAllText($fixturePath, ('"' + $fieldName + '": "' + $value + '"' + "`n"), [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($yamlFixturePath, "$yamlFieldName`: $value`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($envLocalFixturePath, "$fieldName=$value`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'tracked-fixture.json', 'settings.yaml')
    Invoke-Git $fixtureRoot @('add', '--', '.env.local')
    [System.IO.File]::WriteAllText($fixturePath, "{}`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($yamlFixturePath, "example: value`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($envLocalFixturePath, "$fieldName=$placeholderValue`n", [System.Text.Encoding]::UTF8)

    $stagedCredentialResult = Invoke-Scanner $fixtureRoot
    Assert-True ($stagedCredentialResult.ExitCode -eq 1) 'Expected staged credentials to be detected when the working copy is sanitized.'
    Assert-True ($stagedCredentialResult.Output -match 'tracked-fixture\.json') 'Expected the staged JSON credential to be reported.'
    Assert-True ($stagedCredentialResult.Output -match 'settings\.yaml') 'Expected the staged YAML credential to be reported.'
    Assert-True ($stagedCredentialResult.Output -match '\.env\.local') 'Expected the staged .env.local credential to be reported.'
    Assert-True ($stagedCredentialResult.Output -notmatch [regex]::Escape($value)) 'Scanner output exposed the staged synthetic credential value.'

    [System.IO.File]::WriteAllText($fixturePath, "{}`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($yamlFixturePath, "example: value`n", [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($envLocalFixturePath, "$fieldName=$placeholderValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'tracked-fixture.json', 'settings.yaml')
    Invoke-Git $fixtureRoot @('add', '--', '.env.local')
    $fixtureStatus = & git -C $fixtureRoot status --porcelain
    if ($LASTEXITCODE -ne 0 -or @($fixtureStatus).Count -ne 0) {
        throw ('The clean-pass fixture did not return to a clean Git state: ' + ($fixtureStatus -join '; '))
    }

    $cleanResult = Invoke-Scanner $fixtureRoot
    Assert-True ($cleanResult.ExitCode -eq 0) 'Expected exit code 0 after removing the synthetic tracked finding.'
    Assert-True ($cleanResult.Output -notmatch [regex]::Escape($ignoredValue)) 'Ignored local configuration affected a clean scan.'

    Write-Output 'PASS: tracked credentials in JSON, YAML, and .env.local are detected across Git-index and working-tree states without printing values.'
    Write-Output 'PASS: placeholders and Git-ignored local configuration do not fail the scan.'
}
finally {
    $resolvedTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    $resolvedRoot = [System.IO.Path]::GetFullPath($tempRoot)
    if ($resolvedRoot.StartsWith($resolvedTemp, [System.StringComparison]::OrdinalIgnoreCase) -and
        [System.IO.Path]::GetFileName($resolvedRoot).StartsWith('idea-secret-check-test-', [System.StringComparison]::Ordinal)) {
        Remove-Item -LiteralPath $resolvedRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
