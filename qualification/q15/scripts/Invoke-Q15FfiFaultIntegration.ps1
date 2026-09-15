param(
    [string]$FlutterCommand = 'flutter',
    [string]$OutputDirectory = '',
    [ValidateRange(100, 10000)]
    [int]$Cycles = 100,
    [string]$FaultServerDll = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot
$repositoryRoot = (Resolve-Path "$q15Root/../..").Path
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $q15Root '.runtime/ffi-faults'
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$OutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
if (Test-Path -LiteralPath (Join-Path $OutputDirectory 'fault-summary.json')) {
    throw 'Use a fresh OutputDirectory to preserve previous fault evidence.'
}

$secretBytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$encodedSecret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$pipeName = "idea-q15-fault-$([Guid]::NewGuid().ToString('N'))"
if ([string]::IsNullOrWhiteSpace($FaultServerDll)) {
    $FaultServerDll = "$q15Root/shared/dotnet/Idea.Q15.WorkspaceFaultServer/bin/Release/net10.0/Idea.Q15.WorkspaceFaultServer.dll"
}
$flutterRoot = "$q15Root/option-b/flutter"
$previous = @{}
foreach ($name in @('IDEA_Q15_WORKSPACE_SECRET', 'IDEA_Q15_PIPE_NAME', 'IDEA_Q15_WORKSPACE_ID', 'IDEA_Q15_WORKSPACE_SESSION', 'IDEA_Q15_FAULT_MODE', 'IDEA_Q15_FAULT_CASE', 'IDEA_Q15_FAULT_EXPECTED', 'IDEA_Q15_FAULT_CYCLES', 'IDEA_Q15_FAULT_OUTPUT', 'IDEA_Q15_FAULT_SERVER_DLL', 'IDEA_Q15_FAULT_READY_FILE')) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$env:IDEA_Q15_WORKSPACE_SECRET = $encodedSecret
$env:IDEA_Q15_PIPE_NAME = $pipeName
$env:IDEA_Q15_WORKSPACE_ID = 'WS-Q15-001'
$env:IDEA_Q15_WORKSPACE_SESSION = 'SESSION-Q15-001'
$env:IDEA_Q15_FAULT_CYCLES = "$Cycles"
$env:IDEA_Q15_FAULT_OUTPUT = $OutputDirectory
$env:IDEA_Q15_FAULT_SERVER_DLL = $FaultServerDll
$env:IDEA_Q15_FAULT_READY_FILE = ''

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
    @{ Name = 'timeout'; Mode = 'timeout'; Expected = 'TIMEOUT' },
    @{ Name = 'repeated-cycles'; Mode = ''; Expected = 'RECORDED_RACE_AND_RECONNECT' }
)
$results = [Collections.Generic.List[object]]::new()
$server = $null
$locationPushed = $false
$failed = $false
foreach ($case in $cases) {
    $results.Add([ordered]@{
        case = $case.Name
        expectedClassification = $case.Expected
        result = 'NOT-RUN'
        reason = $null
        rawRunnerOutput = $null
        rawServerOutput = $null
    })
}

try {
    $missing = [Collections.Generic.List[string]]::new()
    if (-not (Get-Command $FlutterCommand -ErrorAction SilentlyContinue)) { $missing.Add('Flutter executable') }
    if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { $missing.Add('dotnet executable') }
    if (-not (Test-Path -LiteralPath $FaultServerDll -PathType Leaf)) { $missing.Add('prebuilt Release fault-server assembly') }
    if ($missing.Count -gt 0) {
        foreach ($result in $results) {
            $result.result = 'BLOCKED'
            $result.reason = "Missing prerequisite: $($missing -join ', '). No installation attempted."
        }
        throw $results[0].reason
    }
    $env:IDEA_Q15_FAULT_SERVER_DLL = (Resolve-Path -LiteralPath $FaultServerDll).Path
    Push-Location $flutterRoot
    $locationPushed = $true
    for ($caseIndex = 0; $caseIndex -lt $cases.Count; $caseIndex++) {
        $case = $cases[$caseIndex]
        $result = $results[$caseIndex]
        try {
        $env:IDEA_Q15_FAULT_CASE = $case.Name
        $env:IDEA_Q15_FAULT_EXPECTED = $case.Expected
        $env:IDEA_Q15_FAULT_MODE = $case.Mode
        $server = $null
        $stdout = Join-Path $OutputDirectory "$($case.Name)-server.stdout.log"
        $stderr = Join-Path $OutputDirectory "$($case.Name)-server.stderr.log"
        if ($case.Mode) {
            $server = Start-Process dotnet -ArgumentList @('"' + $env:IDEA_Q15_FAULT_SERVER_DLL + '"') `
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
        $result.rawRunnerOutput = $runnerOutput
        $result.rawServerOutput = if ($case.Mode) { $stdout } else { $null }
        & $FlutterCommand test integration_test/ffi_fault_integration_test.dart -d windows --no-pub --reporter expanded 2>&1 | Tee-Object -FilePath $runnerOutput
        if ($LASTEXITCODE -ne 0) { throw "Fault case $($case.Name) exited with code $LASTEXITCODE." }
        if ($case.Name -eq 'repeated-cycles') {
            $records = @(Get-Content -LiteralPath (Join-Path $OutputDirectory 'repeated-cycles.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
            if ($records.Count -ne $Cycles -or @($records | Where-Object result -ne 'PASS').Count -ne 0) {
                throw 'Repeated cycle evidence is incomplete or contains non-PASS outcomes.'
            }
            $result['recordedCycles'] = $records.Count
            $result['raceOutcomes'] = @($records | Group-Object { $_.outcomes.race.classification } | Select-Object Name,Count)
            $result['resourceSnapshots'] = if (@($records | Where-Object { $_.resourcesBefore.status -ne 'PASS' -or $_.resourcesAfter.status -ne 'PASS' }).Count -eq 0) { 'PASS' } else { 'BLOCKED' }
        }
        $result.result = 'PASS'
        }
        catch {
            $result.result = 'FAIL'
            $result.reason = $_.Exception.Message
            $failed = $true
        }
        finally {
        if ($null -ne $server -and -not $server.HasExited) {
            Stop-Process -Id $server.Id -Force
            $server.WaitForExit()
        }
        $server = $null
        $results | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'fault-summary.json') -Encoding utf8
        }
    }
}
finally {
    if ($locationPushed) { Pop-Location }
    if ($null -ne $server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $server.WaitForExit()
    }
    foreach ($name in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process')
    }
    $results | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'fault-summary.json') -Encoding utf8
}

if ($failed) { throw "FFI fault integration has failed cases. See $OutputDirectory/fault-summary.json" }
Write-Host "Q-15 FFI fault integration completed. Raw outputs: $OutputDirectory"
