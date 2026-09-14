param(
    [string]$FlutterCommand = 'flutter',
    [string]$OutputDirectory = '',
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $q15Root '.runtime/option-b-web'
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$OutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
$flutterRoot = "$q15Root/option-b/flutter"
$browserRoot = "$q15Root/shared/browser-tests"
$apiProject = "$q15Root/shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj"
$pythonServer = "$q15Root/scripts/serve_flutter_web.py"
$api = $null
$web = $null
$results = [Collections.Generic.List[object]]::new()

function Invoke-Checked {
    param([string]$Command, [string[]]$Arguments)
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Command exited with code $LASTEXITCODE." }
}

if (-not $SkipBuild) {
    Push-Location $flutterRoot
    try {
        Invoke-Checked $FlutterCommand @('build', 'web', '--release')
        Copy-Item -LiteralPath (Join-Path $flutterRoot 'build/web') -Destination (Join-Path $OutputDirectory 'web-js') -Recurse -Force
        Invoke-Checked $FlutterCommand @('build', 'web', '--wasm', '--release')
        Copy-Item -LiteralPath (Join-Path $flutterRoot 'build/web') -Destination (Join-Path $OutputDirectory 'web-wasm') -Recurse -Force
    }
    finally { Pop-Location }
}

try {
    $api = Start-Process dotnet -ArgumentList @('run', '--project', $apiProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'api.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'api.stderr.log')
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri 'http://127.0.0.1:5115/health' -TimeoutSec 1
            if ($health.status -eq 'ready') { break }
        } catch { Start-Sleep -Milliseconds 250 }
        if ($attempt -eq 59) { throw 'Q-15 API harness did not become ready.' }
    }

    foreach ($surface in @(@{ Name = 'js'; Directory = 'web-js' }, @{ Name = 'wasm'; Directory = 'web-wasm' })) {
        $port = if ($surface.Name -eq 'js') { 5174 } else { 5175 }
        $log = Join-Path $OutputDirectory "$($surface.Name)-server.log"
        $web = Start-Process python -ArgumentList @($pythonServer, '--directory', (Join-Path $OutputDirectory $surface.Directory), '--port', "$port") `
            -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput $log -RedirectStandardError (Join-Path $OutputDirectory "$($surface.Name)-server.err.log")
        $base = "http://127.0.0.1:$port"
        $ready = $false
        for ($attempt = 0; $attempt -lt 60; $attempt++) {
            try { $response = Invoke-WebRequest -Uri $base -TimeoutSec 1; if ($response.StatusCode -eq 200) { $ready = $true; break } }
            catch { Start-Sleep -Milliseconds 250 }
        }
        if (-not $ready) { throw "Flutter Web $($surface.Name) server did not become ready." }
        Push-Location $browserRoot
        try {
            $env:Q15_BROWSER_BASE_URL = $base
            $resultLog = Join-Path $OutputDirectory "$($surface.Name)-playwright.log"
            # The committed Playwright config already enables list output plus a JSON
            # reporter writing test-results/option-b-web.json.  Do not override the
            # reporter on the CLI: doing so streams JSON into the human log and loses
            # the standalone machine-readable artifact.
            & npm exec -- playwright test option-b-web.spec.ts 2>&1 | Tee-Object -FilePath $resultLog
            if ($LASTEXITCODE -ne 0) { throw "Flutter Web $($surface.Name) browser tests exited with code $LASTEXITCODE." }
            $json = Join-Path $browserRoot 'test-results/option-b-web.json'
            if (Test-Path $json) { Copy-Item -LiteralPath $json -Destination (Join-Path $OutputDirectory "$($surface.Name)-playwright.json") -Force }
            $results.Add([ordered]@{ surface = $surface.Name; result = 'PASS'; rawRunnerOutput = $resultLog; rawPlaywrightJson = (Join-Path $OutputDirectory "$($surface.Name)-playwright.json") })
        }
        finally {
            Pop-Location
            Remove-Item Env:Q15_BROWSER_BASE_URL -ErrorAction SilentlyContinue
        }
        if ($null -ne $web -and -not $web.HasExited) { Stop-Process -Id $web.Id -Force; $web.WaitForExit() }
        $web = $null
    }
}
finally {
    foreach ($process in @($web, $api)) {
        if ($null -ne $process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force; $process.WaitForExit() }
    }
}

$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'web-summary.json') -Encoding utf8
Write-Host "Q-15 Option B Web integration completed. Raw outputs: $OutputDirectory"
