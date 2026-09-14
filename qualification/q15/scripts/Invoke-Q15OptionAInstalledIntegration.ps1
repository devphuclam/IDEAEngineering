param(
    [string]$OutputDirectory = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $q15Root '.runtime/option-a-installed'
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$pipeName = "idea-q15-option-a-$([Guid]::NewGuid().ToString('N'))"
$apiProject = "$q15Root/shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj"
$workspaceProject = "$q15Root/shared/dotnet/Idea.Q15.Workspace/Idea.Q15.Workspace.csproj"
$desktopProject = "$q15Root/option-a/desktop/Idea.Q15.OptionA.Desktop/Idea.Q15.OptionA.Desktop.csproj"
$report = Join-Path $OutputDirectory 'option-a-installed-ui-integration.json'
$api = $null
$workspace = $null
$desktop = $null
$previous = @{}
foreach ($name in @('IDEA_Q15_WORKSPACE_SECRET', 'IDEA_Q15_PIPE_NAME', 'IDEA_Q15_WORKSPACE_ID', 'IDEA_Q15_WORKSPACE_SESSION', 'IDEA_Q15_CUSTODY_ROOT', 'IDEA_Q15_INSTALLED_FLOW_REPORT', 'IDEA_Q15_UI_READY_REPORT')) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_PIPE_NAME = $pipeName
$env:IDEA_Q15_WORKSPACE_ID = 'WS-Q15-001'
$env:IDEA_Q15_WORKSPACE_SESSION = 'SESSION-Q15-001'
$env:IDEA_Q15_CUSTODY_ROOT = Join-Path $OutputDirectory 'custody'
$env:IDEA_Q15_INSTALLED_FLOW_REPORT = $report
$env:IDEA_Q15_UI_READY_REPORT = ''

try {
    $api = Start-Process dotnet -ArgumentList @('run', '--project', $apiProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'api.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'api.stderr.log')
    $workspace = Start-Process dotnet -ArgumentList @('run', '--project', $workspaceProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'workspace.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'workspace.stderr.log')
    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri 'http://127.0.0.1:5115/health' -TimeoutSec 1
            if ($health.status -eq 'ready') { $ready = $true; break }
        } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $ready) { throw 'Q-15 API harness did not become ready within 15 seconds.' }

    $desktop = Start-Process dotnet -ArgumentList @('run', '--project', $desktopProject, '-c', 'Release', '--no-build') `
        -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $OutputDirectory 'desktop.stdout.log') `
        -RedirectStandardError (Join-Path $OutputDirectory 'desktop.stderr.log')
    for ($attempt = 0; $attempt -lt 240; $attempt++) {
        if (Test-Path $report) { break }
        if ($desktop.HasExited) { throw "Option A desktop exited with code $($desktop.ExitCode) before writing its report." }
        Start-Sleep -Milliseconds 250
    }
    if (-not (Test-Path $report)) { throw 'Option A installed flow did not produce a report within 60 seconds.' }
    $result = Get-Content $report -Raw | ConvertFrom-Json
    if ($result.result -ne 'PASS') { throw "Option A installed flow reported $($result.result): $($result.stageError)" }
}
finally {
    foreach ($process in @($desktop, $workspace, $api)) {
        if ($null -ne $process -and -not $process.HasExited) {
            Stop-Process -Id $process.Id -Force
            $process.WaitForExit()
        }
    }
    foreach ($name in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process')
    }
}

Write-Host "Q-15 Option A installed UI integration completed. Raw outputs: $OutputDirectory"
