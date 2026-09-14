param(
    [string]$OutputDirectory = '',
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
$webRoot = "$q15Root/option-a/web"
$browserRoot = $webRoot
$apiProject = "$q15Root/shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj"
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $q15Root '.runtime/option-a-web'
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$OutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
$api = $null
$web = $null
$previousBase = [Environment]::GetEnvironmentVariable('Q15_BROWSER_BASE_URL', 'Process')

function Invoke-Checked {
    param([string]$Command, [string[]]$Arguments)
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Command exited with code $LASTEXITCODE." }
}

try {
    if (-not $SkipBuild) {
        Push-Location $webRoot
        try { Invoke-Checked npm @('run', 'build') }
        finally { Pop-Location }
    }
    $api = Start-Process dotnet -ArgumentList @('run', '--project', $apiProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'api.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'api.stderr.log')
    $apiReady = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri 'http://127.0.0.1:5115/health' -TimeoutSec 1
            if ($health.status -eq 'ready') { $apiReady = $true; break }
        } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $apiReady) { throw 'Q-15 API harness did not become ready.' }

    $web = Start-Process npm.cmd -ArgumentList @('run', 'preview', '--', '--host', '127.0.0.1', '--port', '5173') `
        -WorkingDirectory $webRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'web.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'web.stderr.log')
    $webReady = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri 'http://127.0.0.1:5173' -TimeoutSec 1
            if ($response.StatusCode -eq 200) { $webReady = $true; break }
        } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $webReady) { throw 'Option A production server did not become ready.' }

    $env:Q15_BROWSER_BASE_URL = 'http://127.0.0.1:5173'
    Push-Location $browserRoot
    try {
        $resultLog = Join-Path $OutputDirectory 'playwright.log'
        & npm exec -- playwright test 2>&1 | Tee-Object -FilePath $resultLog
        if ($LASTEXITCODE -ne 0) { throw "Option A production browser tests exited with code $LASTEXITCODE." }
        $json = Join-Path $browserRoot 'test-results/results.json'
        if (-not (Test-Path $json)) { throw 'Option A production Playwright JSON report was not produced.' }
        Copy-Item -LiteralPath $json -Destination (Join-Path $OutputDirectory 'playwright.json') -Force
    }
    finally { Pop-Location }
}
finally {
    if ($null -ne $web -and -not $web.HasExited) { Stop-Process -Id $web.Id -Force; $web.WaitForExit() }
    if ($null -ne $api -and -not $api.HasExited) { Stop-Process -Id $api.Id -Force; $api.WaitForExit() }
    [Environment]::SetEnvironmentVariable('Q15_BROWSER_BASE_URL', $previousBase, 'Process')
}

$report = [ordered]@{
    candidate = 'option-a'
    surface = 'React production Web'
    result = 'PASS'
    rawRunnerOutput = (Join-Path $OutputDirectory 'playwright.log')
    rawPlaywrightJson = (Join-Path $OutputDirectory 'playwright.json')
}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'web-summary.json') -Encoding utf8
Write-Host "Q-15 Option A production Web integration completed. Raw outputs: $OutputDirectory"
