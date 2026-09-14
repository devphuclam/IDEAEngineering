param(
    [Parameter(Mandatory)]
    [ValidateSet('option-a', 'option-b')]
    [string]$Candidate,

    [Parameter(Mandatory)]
    [string]$ExecutablePath,

    [Parameter(Mandatory)]
    [string]$OutputDirectory,

    [ValidateRange(1, 100)]
    [int]$Repetitions = 10
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$resolvedExecutable = (Resolve-Path -LiteralPath $ExecutablePath).Path
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$resolvedOutput = (Resolve-Path -LiteralPath $OutputDirectory).Path
$samples = [Collections.Generic.List[object]]::new()

function Get-NearestRank {
    param([double[]]$Values, [double]$Percentile)
    $ordered = @($Values | Sort-Object)
    $index = [Math]::Max(0, [Math]::Ceiling($ordered.Count * $Percentile) - 1)
    return $ordered[$index]
}

for ($sampleNumber = 0; $sampleNumber -le $Repetitions; $sampleNumber++) {
    $isWarmUp = $sampleNumber -eq 0
    $reportName = if ($isWarmUp) { 'warm-up.json' } else { "candidate-{0:d2}.json" -f $sampleNumber }
    $reportPath = Join-Path $resolvedOutput $reportName
    if ($Candidate -eq 'option-a') {
        $env:IDEA_Q15_SMOKE_REPORT = $reportPath
        Remove-Item Env:IDEA_Q15_AUTOMATED_SMOKE_REPORT -ErrorAction SilentlyContinue
        Remove-Item Env:IDEA_Q15_SMOKE_KIND -ErrorAction SilentlyContinue
    }
    else {
        $env:IDEA_Q15_AUTOMATED_SMOKE_REPORT = $reportPath
        $env:IDEA_Q15_SMOKE_KIND = 'startup'
        Remove-Item Env:IDEA_Q15_SMOKE_REPORT -ErrorAction SilentlyContinue
    }

    $clock = [Diagnostics.Stopwatch]::StartNew()
    $candidateProcess = Start-Process -FilePath $resolvedExecutable -WindowStyle Hidden -PassThru
    $candidateProcess.WaitForExit()
    $clock.Stop()
    if ($candidateProcess.ExitCode -ne 0) {
        throw "$Candidate sample $sampleNumber exited with code $($candidateProcess.ExitCode)."
    }
    if (-not (Test-Path -LiteralPath $reportPath)) {
        throw "$Candidate sample $sampleNumber produced no readiness report."
    }

    $internal = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json
    if ($Candidate -eq 'option-a') {
        $internalReadiness = $internal.startupToRoundTripMs
        $candidateResult = $internal.workspaceRoundTrip
        $candidateCode = $internal.code
    }
    else {
        $internalReadiness = $internal.startupToWorkspaceRoundTripMs
        $candidateResult = $internal.result
        $candidateCode = $internal.workspaceCode
    }
    if ($isWarmUp) {
        continue
    }
    $samples.Add([ordered]@{
        sample = $sampleNumber
        externalProcessDurationMs = [Math]::Round($clock.Elapsed.TotalMilliseconds, 4)
        internalReadinessMs = [Math]::Round([double]$internalReadiness, 4)
        candidateResult = $candidateResult
        candidateCode = $candidateCode
    })
}

$values = [double[]]@($samples | ForEach-Object { $_.externalProcessDurationMs })
$summary = [ordered]@{
    candidate = $Candidate
    sampleCount = $samples.Count
    definition = 'process launch to process exit after candidate readiness report; warm/restart samples'
    thresholdState = 'BLOCKED'
    unit = 'ms'
    minimum = [Math]::Round(($values | Measure-Object -Minimum).Minimum, 4)
    maximum = [Math]::Round(($values | Measure-Object -Maximum).Maximum, 4)
    mean = [Math]::Round(($values | Measure-Object -Average).Average, 4)
    p50NearestRank = [Math]::Round((Get-NearestRank $values 0.50), 4)
    p95NearestRank = [Math]::Round((Get-NearestRank $values 0.95), 4)
    p99NearestRank = [Math]::Round((Get-NearestRank $values 0.99), 4)
    samples = $samples
}

$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $resolvedOutput 'startup-summary.json') -Encoding utf8
Remove-Item Env:IDEA_Q15_SMOKE_REPORT -ErrorAction SilentlyContinue
Remove-Item Env:IDEA_Q15_AUTOMATED_SMOKE_REPORT -ErrorAction SilentlyContinue
Remove-Item Env:IDEA_Q15_SMOKE_KIND -ErrorAction SilentlyContinue

$summary | ConvertTo-Json -Depth 8
