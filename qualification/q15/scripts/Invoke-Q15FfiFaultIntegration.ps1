param(
    [string]$FlutterCommand = 'flutter',
    [string]$OutputDirectory = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $q15Root '.runtime/ffi-faults'
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$pipeName = "idea-q15-fault-$([Guid]::NewGuid().ToString('N'))"
$faultProject = "$q15Root/shared/dotnet/Idea.Q15.WorkspaceFaultServer/Idea.Q15.WorkspaceFaultServer.csproj"
$flutterRoot = "$q15Root/option-b/flutter"
$previous = @{}
foreach ($name in @('IDEA_Q15_WORKSPACE_SECRET', 'IDEA_Q15_PIPE_NAME', 'IDEA_Q15_WORKSPACE_ID', 'IDEA_Q15_WORKSPACE_SESSION', 'IDEA_Q15_FAULT_MODE', 'IDEA_Q15_FAULT_CASE', 'IDEA_Q15_FAULT_EXPECTED')) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_PIPE_NAME = $pipeName
$env:IDEA_Q15_WORKSPACE_ID = 'WS-Q15-001'
$env:IDEA_Q15_WORKSPACE_SESSION = 'SESSION-Q15-001'

$cases = @(
    @{ Name = 'pipe-unavailable'; Mode = ''; Expected = 'PIPE_UNAVAILABLE' },
    @{ Name = 'disconnect-after-connect'; Mode = 'disconnect-after-connect'; Expected = 'PIPE_BROKEN' },
    @{ Name = 'close-during-read'; Mode = 'close-during-read'; Expected = 'PIPE_BROKEN' },
    @{ Name = 'close-during-write'; Mode = 'close-during-write'; Expected = 'PIPE_BROKEN' },
    @{ Name = 'malformed-response'; Mode = 'malformed-response'; Expected = 'MALFORMED_RESPONSE' },
    @{ Name = 'oversized-response'; Mode = 'oversized-response'; Expected = 'OVERSIZED_RESPONSE' },
    @{ Name = 'truncated-response'; Mode = 'truncated-response'; Expected = 'PIPE_BROKEN' },
    @{ Name = 'invalid-response-mac'; Mode = 'invalid-response-mac'; Expected = 'INVALID_RESPONSE_MAC' },
    @{ Name = 'response-request-id-mismatch'; Mode = 'response-request-id-mismatch'; Expected = 'RESPONSE_REQUEST_ID_MISMATCH' },
    @{ Name = 'timeout'; Mode = 'timeout'; Expected = 'TIMEOUT' }
)
$results = [Collections.Generic.List[object]]::new()

try {
    Push-Location $flutterRoot
    foreach ($case in $cases) {
        $env:IDEA_Q15_FAULT_CASE = $case.Name
        $env:IDEA_Q15_FAULT_EXPECTED = $case.Expected
        $env:IDEA_Q15_FAULT_MODE = $case.Mode
        $server = $null
        $stdout = Join-Path $OutputDirectory "$($case.Name)-server.stdout.log"
        $stderr = Join-Path $OutputDirectory "$($case.Name)-server.stderr.log"
        if ($case.Mode) {
            $server = Start-Process dotnet -ArgumentList @('run', '--project', $faultProject, '-c', 'Release', '--no-build') `
                -WorkingDirectory $repositoryRoot -WindowStyle Hidden -PassThru `
                -RedirectStandardOutput $stdout -RedirectStandardError $stderr
            $ready = $false
            for ($attempt = 0; $attempt -lt 40; $attempt++) {
                if ((Test-Path $stdout) -and (Select-String -Path $stdout -Pattern 'Q15_FAULT_SERVER_READY' -Quiet)) {
                    $ready = $true
                    break
                }
                Start-Sleep -Milliseconds 100
            }
            if (-not $ready) { throw "Fault server did not become ready for $($case.Name)." }
        }
        $runnerOutput = Join-Path $OutputDirectory "$($case.Name)-flutter.machine.jsonl"
        & $FlutterCommand test integration_test/ffi_fault_integration_test.dart -d windows --reporter expanded 2>&1 | Tee-Object -FilePath $runnerOutput
        if ($LASTEXITCODE -ne 0) { throw "Fault case $($case.Name) exited with code $LASTEXITCODE." }
        $results.Add([ordered]@{
            case = $case.Name
            expectedClassification = $case.Expected
            result = 'PASS'
            rawRunnerOutput = $runnerOutput
            rawServerOutput = if ($case.Mode) { $stdout } else { $null }
        })
        if ($null -ne $server -and -not $server.HasExited) {
            Stop-Process -Id $server.Id -Force
            $server.WaitForExit()
        }
    }
}
finally {
    Pop-Location
    if ($null -ne $server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $server.WaitForExit()
    }
    foreach ($name in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process')
    }
}

$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'fault-summary.json') -Encoding utf8
Write-Host "Q-15 FFI fault integration completed. Raw outputs: $OutputDirectory"
