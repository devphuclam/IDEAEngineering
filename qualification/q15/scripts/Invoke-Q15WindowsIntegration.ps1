param(
    [string]$FlutterCommand = 'flutter'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
$runtimeRoot = "$q15Root/.runtime/windows-integration"
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null

$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$previousSecret = [Environment]::GetEnvironmentVariable('IDEA_Q15_WORKSPACE_SECRET', 'Process')
$previousCustodyRoot = [Environment]::GetEnvironmentVariable('IDEA_Q15_CUSTODY_ROOT', 'Process')
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_CUSTODY_ROOT = "$runtimeRoot/custody"

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
        foreach ($testFile in @(
            'integration_test/direct_ffi_workspace_test.dart',
            'integration_test/critical_surface_test.dart'
        )) {
            & $FlutterCommand test $testFile -d windows --reporter expanded
            if ($LASTEXITCODE -ne 0) {
                throw "$testFile exited with code $LASTEXITCODE."
            }
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
    [Environment]::SetEnvironmentVariable('IDEA_Q15_WORKSPACE_SECRET', $previousSecret, 'Process')
    [Environment]::SetEnvironmentVariable('IDEA_Q15_CUSTODY_ROOT', $previousCustodyRoot, 'Process')
}

Write-Host 'Q-15 Windows integration completed. Repository verifiers were NOT-RUN.'
