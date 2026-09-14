param(
    [Parameter(Mandatory)]
    [string]$ExecutablePath,
    [string]$OutputDirectory = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) { $OutputDirectory = Join-Path $q15Root '.runtime/api-workspace-smoke' }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$OutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
$report = Join-Path $OutputDirectory 'option-b-api-workspace-smoke.json'
$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$pipeName = "idea-q15-smoke-$([Guid]::NewGuid().ToString('N'))"
$apiProject = "$q15Root/shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj"
$workspaceProject = "$q15Root/shared/dotnet/Idea.Q15.Workspace/Idea.Q15.Workspace.csproj"
$api = $null
$workspace = $null
$candidate = $null
$previous = @{}
foreach ($name in @('IDEA_Q15_WORKSPACE_SECRET', 'IDEA_Q15_PIPE_NAME', 'IDEA_Q15_WORKSPACE_ID', 'IDEA_Q15_WORKSPACE_SESSION', 'IDEA_Q15_CUSTODY_ROOT', 'IDEA_Q15_AUTOMATED_SMOKE_REPORT', 'IDEA_Q15_SMOKE_KIND', 'IDEA_Q15_UI_READY_REPORT')) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_PIPE_NAME = $pipeName
$env:IDEA_Q15_WORKSPACE_ID = 'WS-Q15-001'
$env:IDEA_Q15_WORKSPACE_SESSION = 'SESSION-Q15-001'
$env:IDEA_Q15_CUSTODY_ROOT = Join-Path $OutputDirectory 'custody'
$env:IDEA_Q15_AUTOMATED_SMOKE_REPORT = $report
$env:IDEA_Q15_SMOKE_KIND = 'api-workspace-smoke'
$env:IDEA_Q15_UI_READY_REPORT = ''

try {
    $api = Start-Process dotnet -ArgumentList @('run', '--project', $apiProject, '-c', 'Release', '--no-build') -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'api.stdout.log') -RedirectStandardError (Join-Path $OutputDirectory 'api.stderr.log')
    $workspace = Start-Process dotnet -ArgumentList @('run', '--project', $workspaceProject, '-c', 'Release', '--no-build') -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'workspace.stdout.log') -RedirectStandardError (Join-Path $OutputDirectory 'workspace.stderr.log')
    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try { $health = Invoke-RestMethod -Uri 'http://127.0.0.1:5115/health' -TimeoutSec 1; if ($health.status -eq 'ready') { $ready = $true; break } }
        catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $ready) { throw 'Q-15 API harness did not become ready.' }
    $candidate = Start-Process -FilePath ((Resolve-Path -LiteralPath $ExecutablePath).Path) -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'candidate.stdout.log') -RedirectStandardError (Join-Path $OutputDirectory 'candidate.stderr.log')
    $candidate.WaitForExit()
    if (-not (Test-Path $report)) { throw 'API/Workspace smoke did not produce a report.' }
    $smoke = Get-Content $report -Raw | ConvertFrom-Json
    if ($smoke.result -ne 'PASS') { throw "API/Workspace smoke reported $($smoke.result): $($smoke.error)" }
}
finally {
    foreach ($process in @($candidate, $workspace, $api)) {
        if ($null -ne $process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force; $process.WaitForExit() }
    }
    foreach ($name in $previous.Keys) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}

Write-Host "Q-15 API/Workspace smoke completed. Raw report: $report"
