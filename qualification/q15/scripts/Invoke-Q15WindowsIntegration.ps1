param(
    [string]$FlutterCommand = 'flutter',
    [string]$OutputDirectory = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
$runtimeRoot = if ([string]::IsNullOrWhiteSpace($OutputDirectory)) { "$q15Root/.runtime/windows-integration" } else { $OutputDirectory }
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
$runtimeRoot = (Resolve-Path -LiteralPath $runtimeRoot).Path

$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$pipeName = "idea-q15-workspace-$([Guid]::NewGuid().ToString('N'))"
$previous = @{}
foreach ($name in @('IDEA_Q15_WORKSPACE_SECRET', 'IDEA_Q15_CUSTODY_ROOT', 'IDEA_Q15_PIPE_NAME', 'IDEA_Q15_WORKSPACE_ID', 'IDEA_Q15_WORKSPACE_SESSION')) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_CUSTODY_ROOT = "$runtimeRoot/custody"
$env:IDEA_Q15_PIPE_NAME = $pipeName
$env:IDEA_Q15_WORKSPACE_ID = 'WS-Q15-001'
$env:IDEA_Q15_WORKSPACE_SESSION = 'SESSION-Q15-001'

$apiProject = "$q15Root/shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj"
$workspaceProject = "$q15Root/shared/dotnet/Idea.Q15.Workspace/Idea.Q15.Workspace.csproj"
$apiProcess = $null
$workspaceProcess = $null

try {
    $apiProcess = Start-Process dotnet -ArgumentList @('run', '--project', $apiProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput "$runtimeRoot/api.stdout.log" `
        -RedirectStandardError "$runtimeRoot/api.stderr.log"
    $workspaceProcess = Start-Process dotnet -ArgumentList @('run', '--project', $workspaceProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput "$runtimeRoot/workspace.stdout.log" `
        -RedirectStandardError "$runtimeRoot/workspace.stderr.log"

    $ready = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri 'http://127.0.0.1:5115/health' -TimeoutSec 1
            if ($health.status -eq 'ready') {
                $ready = $true
                break
            }
        }
        catch {
            Start-Sleep -Milliseconds 250
        }
    }
    if (-not $ready) {
        throw 'Q-15 API harness did not become ready within 10 seconds.'
    }

    Push-Location "$q15Root/option-b/flutter"
    try {
        $results = [Collections.Generic.List[object]]::new()
    foreach ($testFile in @(
            'integration_test/direct_ffi_workspace_test.dart',
            'integration_test/critical_surface_test.dart'
        )) {
            $kind = if ($testFile -like '*critical_surface*') { 'windows-ui-integration' } else { 'direct-ffi-ipc' }
            $logPath = Join-Path $runtimeRoot ("$kind.runner.log")
            & $FlutterCommand test $testFile -d windows --reporter expanded 2>&1 | Tee-Object -FilePath $logPath
            if ($LASTEXITCODE -ne 0) {
                throw "$testFile exited with code $LASTEXITCODE."
            }
            $results.Add([ordered]@{ test = $testFile; kind = $kind; result = 'PASS'; rawOutput = $logPath })
        }
    }
    finally {
        Pop-Location
    }
}
finally {
    foreach ($childProcess in @($workspaceProcess, $apiProcess)) {
        if ($null -ne $childProcess -and -not $childProcess.HasExited) {
            Stop-Process -Id $childProcess.Id -Force
            $childProcess.WaitForExit()
        }
    }
    foreach ($name in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process')
    }
}

$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $runtimeRoot 'windows-integration-summary.json') -Encoding utf8
Write-Host "Q-15 Windows integration completed. Raw outputs: $runtimeRoot. Repository verifiers were NOT-RUN."
