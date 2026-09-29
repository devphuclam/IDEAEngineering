param()

$ErrorActionPreference = 'Stop'
$scannerSourcePath = Join-Path $PSScriptRoot 'check-no-secrets.ps1'
$manifestSourcePath = Join-Path $PSScriptRoot 'known-synthetic-fixtures.json'
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
    $scannerPath = Join-Path $root 'tests/ph1/check-no-secrets.ps1'
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
    $scannerDirectory = Join-Path $fixtureRoot 'tests/ph1'
    New-Item -ItemType Directory -Path $scannerDirectory -Force | Out-Null
    Copy-Item -LiteralPath $scannerSourcePath -Destination (Join-Path $scannerDirectory 'check-no-secrets.ps1')
    Copy-Item -LiteralPath $manifestSourcePath -Destination (Join-Path $scannerDirectory 'known-synthetic-fixtures.json')
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
    Invoke-Git $fixtureRoot @('add', '--', '.gitignore', 'config.example', 'README.md', 'tests/ph1/check-no-secrets.ps1', 'tests/ph1/known-synthetic-fixtures.json')
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

    # Shell permits an unquoted credential assignment as a literal value.
    $shellValue = 'ShellCredential' + [guid]::NewGuid().ToString('N')
    $shellPath = Join-Path $fixtureRoot 'deploy.sh'
    [System.IO.File]::WriteAllText($shellPath, "export -n SECRET_KEY=$shellValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'deploy.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic shell credential fixture')
    $shellResult = Invoke-Scanner $fixtureRoot
    Assert-True ($shellResult.ExitCode -eq 1) 'Expected an unquoted shell credential assignment to be detected.'
    Assert-True ($shellResult.Output -match 'deploy\.sh') 'Expected the unquoted shell credential finding to identify the file.'
    Assert-True ($shellResult.Output -notmatch [regex]::Escape($shellValue)) 'Scanner output exposed the unquoted shell credential value.'
    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'deploy.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove synthetic shell credential')

    $localShellValue = 'LocalCredential' + [guid]::NewGuid().ToString('N')
    $localShellPath = Join-Path $fixtureRoot 'local-secret.sh'
    [System.IO.File]::WriteAllText($localShellPath, "local -r SECRET_KEY=$localShellValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'local-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic local shell credential')
    $localShellResult = Invoke-Scanner $fixtureRoot
    Assert-True ($localShellResult.ExitCode -eq 1) 'Expected an unquoted local shell credential assignment to be detected.'
    Assert-True ($localShellResult.Output -match 'local-secret\.sh') 'Expected the local shell credential finding to identify the file.'
    Assert-True ($localShellResult.Output -notmatch [regex]::Escape($localShellValue)) 'Scanner output exposed the local shell credential value.'
    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'local-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove synthetic local shell credential')

    $readonlyShellValue = 'ReadonlyCredential' + [guid]::NewGuid().ToString('N')
    $readonlyShellPath = Join-Path $fixtureRoot 'readonly-secret.sh'
    [System.IO.File]::WriteAllText($readonlyShellPath, "readonly SECRET_KEY=$readonlyShellValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'readonly-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic readonly shell credential')
    $readonlyShellResult = Invoke-Scanner $fixtureRoot
    Assert-True ($readonlyShellResult.ExitCode -eq 1) 'Expected an unquoted readonly shell credential assignment to be detected.'
    Assert-True ($readonlyShellResult.Output -match 'readonly-secret\.sh') 'Expected the readonly shell credential finding to identify the file.'
    Assert-True ($readonlyShellResult.Output -notmatch [regex]::Escape($readonlyShellValue)) 'Scanner output exposed the readonly shell credential value.'
    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'readonly-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove synthetic readonly shell credential')

    $declareShellValue = 'DeclaredCredential' + [guid]::NewGuid().ToString('N')
    $declareShellPath = Join-Path $fixtureRoot 'declared-secret.sh'
    [System.IO.File]::WriteAllText($declareShellPath, "declare -x SECRET_KEY=$declareShellValue`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'declared-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic declared shell credential')
    $declareShellResult = Invoke-Scanner $fixtureRoot
    Assert-True ($declareShellResult.ExitCode -eq 1) 'Expected a declared unquoted shell credential assignment to be detected.'
    Assert-True ($declareShellResult.Output -match 'declared-secret\.sh') 'Expected the declared shell credential finding to identify the file.'
    Assert-True ($declareShellResult.Output -notmatch [regex]::Escape($declareShellValue)) 'Scanner output exposed the declared shell credential value.'
    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'declared-secret.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove synthetic declared shell credential')

    $nonSecretScriptPath = Join-Path $fixtureRoot 'shell-initialization.sh'
    [System.IO.File]::WriteAllText($nonSecretScriptPath, "WRITTEN_SECRET=()`nexport SECRET_KEY=`$(read-secret)`n", [System.Text.Encoding]::UTF8)
    Invoke-Git $fixtureRoot @('add', '--', 'shell-initialization.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'shell empty and dynamic values')
    $nonSecretScriptResult = Invoke-Scanner $fixtureRoot
    Assert-True ($nonSecretScriptResult.ExitCode -eq 0) 'Expected empty shell arrays and command substitutions not to be treated as committed secret values.'

    $sourceLiteralValue = 'SourceLiteralCredential' + [guid]::NewGuid().ToString('N')
    $sourceFieldName = 'SECRET' + '_KEY'
    $sourceCases = @(
        [pscustomobject]@{ Path = 'deploy.ps1'; Content = ('$env:' + $sourceFieldName + " = '$sourceLiteralValue'`n") }
        [pscustomobject]@{ Path = 'app.js'; Content = ('const ' + $sourceFieldName + ' = "' + $sourceLiteralValue + '";' + "`n") }
        [pscustomobject]@{ Path = 'app.ts'; Content = ('const ' + $sourceFieldName + ' = `' + $sourceLiteralValue + '`;' + "`n") }
    )
    foreach ($sourceCase in $sourceCases) {
        [System.IO.File]::WriteAllText((Join-Path $fixtureRoot $sourceCase.Path), $sourceCase.Content, [System.Text.Encoding]::UTF8)
    }
    Invoke-Git $fixtureRoot @('add', '--', 'deploy.ps1', 'app.js', 'app.ts')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'source-language credential literals')
    $sourceLiteralResult = Invoke-Scanner $fixtureRoot
    Assert-True ($sourceLiteralResult.ExitCode -eq 1) 'Expected quoted credentials in PowerShell, JavaScript, and TypeScript to be detected.'
    foreach ($sourceCase in $sourceCases) {
        Assert-True ($sourceLiteralResult.Output -match [regex]::Escape($sourceCase.Path)) "Expected the credential in $($sourceCase.Path) to be detected."
    }
    Assert-True ($sourceLiteralResult.Output -notmatch [regex]::Escape($sourceLiteralValue)) 'Scanner output exposed a source-language credential value.'
    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'deploy.ps1', 'app.js', 'app.ts')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove source-language credential fixtures')

    $newFixturePaths = @(
        'qualification/new-fixture/deploy.sh',
        'tools/agent-workspace/test/new-fixture/deploy.sh'
    )
    foreach ($relativePath in $newFixturePaths) {
        $path = Join-Path $fixtureRoot ($relativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
        $directory = Split-Path -Parent $path
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
        $fixtureSecret = 'ExcludedRootCredential' + [guid]::NewGuid().ToString('N')
        [System.IO.File]::WriteAllText($path, "SECRET_KEY=$fixtureSecret`n", [System.Text.Encoding]::UTF8)
        Invoke-Git $fixtureRoot @('add', '--', $relativePath)
        Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'synthetic fixture-root credential')
        $fixtureResult = Invoke-Scanner $fixtureRoot
        Assert-True ($fixtureResult.ExitCode -eq 1) "Expected a new credential under $relativePath to be detected."
        Assert-True ($fixtureResult.Output -match [regex]::Escape($relativePath)) "Expected the finding to identify $relativePath."
        Assert-True ($fixtureResult.Output -notmatch [regex]::Escape($fixtureSecret)) 'Scanner output exposed a fixture-root credential value.'
        Invoke-Git $fixtureRoot @('rm', '--quiet', '--', $relativePath)
        Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove synthetic fixture-root credential')
    }

    Invoke-Git $fixtureRoot @('rm', '--quiet', '--', 'shell-initialization.sh')
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'remove shell initialization fixture')

    $allowlistedRelativePath = 'qualification/q15/shared/fixtures/qualification-fixture.json'
    $allowlistedSourcePath = Join-Path $PSScriptRoot ('..\..\' + $allowlistedRelativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
    $allowlistedFixturePath = Join-Path $fixtureRoot ($allowlistedRelativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
    New-Item -ItemType Directory -Path (Split-Path -Parent $allowlistedFixturePath) -Force | Out-Null
    Copy-Item -LiteralPath $allowlistedSourcePath -Destination $allowlistedFixturePath
    Invoke-Git $fixtureRoot @('add', '--', $allowlistedRelativePath)
    Invoke-Git $fixtureRoot @('commit', '--quiet', '-m', 'known synthetic qualification fixture')
    $knownFixtureResult = Invoke-Scanner $fixtureRoot
    Assert-True ($knownFixtureResult.ExitCode -eq 0) 'Expected the exact approved synthetic fixture content to be exempted.'

    $changedFixtureSecret = 'ChangedFixtureCredential' + [guid]::NewGuid().ToString('N')
    [System.IO.File]::AppendAllText($allowlistedFixturePath, "`nSECRET_KEY = `"$changedFixtureSecret`"`n", [System.Text.Encoding]::UTF8)
    $changedFixtureResult = Invoke-Scanner $fixtureRoot
    Assert-True ($changedFixtureResult.ExitCode -eq 1) 'Expected modified content at an approved fixture path to be scanned.'
    Assert-True ($changedFixtureResult.Output -match [regex]::Escape($allowlistedRelativePath)) 'Expected a changed approved fixture to be identified by path.'
    Assert-True ($changedFixtureResult.Output -notmatch [regex]::Escape($changedFixtureSecret)) 'Scanner output exposed a credential appended to a known fixture.'

    # A worktree-only change to the exception manifest must not authorize staged fixture bytes.
    $stagedFixtureSecret = 'StagedFixtureCredential' + [guid]::NewGuid().ToString('N')
    $baselineFixtureText = [System.IO.File]::ReadAllText($allowlistedSourcePath)
    [System.IO.File]::WriteAllText($allowlistedFixturePath, $baselineFixtureText, [System.Text.Encoding]::UTF8)
    $stagedFixtureText = $baselineFixtureText + "`nSECRET_KEY = `"$stagedFixtureSecret`"`n"
    [System.IO.File]::WriteAllText($allowlistedFixturePath, $stagedFixtureText, [System.Text.Encoding]::UTF8)
    $stagedFixtureBytes = [System.IO.File]::ReadAllBytes($allowlistedFixturePath)
    Invoke-Git $fixtureRoot @('add', '--', $allowlistedRelativePath)
    [System.IO.File]::WriteAllText($allowlistedFixturePath, "{}`n", [System.Text.Encoding]::UTF8)

    $manifestPath = Join-Path $fixtureRoot 'tests/ph1/known-synthetic-fixtures.json'
    $manifest = [System.IO.File]::ReadAllText($manifestPath, [System.Text.UTF8Encoding]::new($false, $true)) |
        ConvertFrom-Json -AsHashtable
    $manifestEntry = @($manifest.files | Where-Object { $_.path -ceq $allowlistedRelativePath })[0]
    $stagedFixtureTextFromBytes = [System.Text.UTF8Encoding]::new($false, $true).GetString($stagedFixtureBytes)
    $canonicalStagedText = $stagedFixtureTextFromBytes.Replace("`r`n", "`n").Replace("`r", "`n")
    $canonicalBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($canonicalStagedText)
    $manifestEntry.sha256 = [System.Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($canonicalBytes))
    $updatedManifest = ConvertTo-Json -InputObject $manifest -Depth 10
    [System.IO.File]::WriteAllText($manifestPath, $updatedManifest + "`n", [System.Text.UTF8Encoding]::new($false))

    $unstagedManifestResult = Invoke-Scanner $fixtureRoot
    Assert-True ($unstagedManifestResult.ExitCode -eq 1) 'Expected a worktree-only manifest change not to exempt staged fixture credentials.'
    Assert-True ($unstagedManifestResult.Output -match [regex]::Escape($allowlistedRelativePath)) 'Expected the staged fixture credential to be reported.'
    Assert-True ($unstagedManifestResult.Output -notmatch [regex]::Escape($stagedFixtureSecret)) 'Scanner output exposed the staged fixture credential value.'

    Write-Output 'PASS: tracked credentials in JSON, YAML, and .env.local are detected across Git-index and working-tree states without printing values.'
    Write-Output 'PASS: direct/export/local/readonly/declare shell assignments, source-language literals, and new fixture-root files are detected without printing values.'
    Write-Output 'PASS: exact synthetic fixture content is exempted, but changed content at that path is scanned.'
    Write-Output 'PASS: an unstaged exception-manifest edit cannot exempt staged fixture content.'
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
