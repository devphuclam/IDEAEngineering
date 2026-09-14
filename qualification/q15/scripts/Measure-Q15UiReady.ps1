param(
    [Parameter(Mandatory)]
    [ValidateSet('option-a', 'option-b')]
    [string]$Candidate,

    [Parameter(Mandatory)]
    [string]$ExecutablePath,

    [Parameter(Mandatory)]
    [string]$OutputDirectory,

    [ValidateRange(1, 100)]
    [int]$Repetitions = 20
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$resolvedExecutable = (Resolve-Path -LiteralPath $ExecutablePath).Path
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$resolvedOutput = (Resolve-Path -LiteralPath $OutputDirectory).Path
$samples = [Collections.Generic.List[object]]::new()
$previousReport = [Environment]::GetEnvironmentVariable('IDEA_Q15_UI_READY_REPORT', 'Process')
$previousExit = [Environment]::GetEnvironmentVariable('IDEA_Q15_UI_READY_EXIT', 'Process')

try {
    for ($sampleNumber = 0; $sampleNumber -le $Repetitions; $sampleNumber++) {
        $isWarmUp = $sampleNumber -eq 0
        $reportName = if ($isWarmUp) { 'warm-up.json' } else { "candidate-{0:d2}.json" -f $sampleNumber }
        $reportPath = Join-Path $resolvedOutput $reportName
        Remove-Item -LiteralPath $reportPath -Force -ErrorAction SilentlyContinue
        $env:IDEA_Q15_UI_READY_REPORT = $reportPath
        $env:IDEA_Q15_UI_READY_EXIT = '1'
        $clock = [Diagnostics.Stopwatch]::StartNew()
        $candidateProcess = Start-Process -FilePath $resolvedExecutable -WindowStyle Hidden -PassThru
        $candidateProcess.WaitForExit()
        $clock.Stop()
        if ($candidateProcess.ExitCode -ne 0) {
            throw "$Candidate sample $sampleNumber exited with code $($candidateProcess.ExitCode)."
        }
        if (-not (Test-Path -LiteralPath $reportPath)) {
            throw "$Candidate sample $sampleNumber produced no Q15_UI_READY report."
        }
        $internal = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json
        if ($internal.q15UiReady -ne $true -or $internal.loginVisible -ne $true -or $internal.loginEnabled -ne $true) {
            throw "$Candidate sample $sampleNumber did not establish Q15_UI_READY."
        }
        if ($isWarmUp) { continue }
        $samples.Add([ordered]@{
            sample = $sampleNumber
            externalProcessDurationMs = [Math]::Round($clock.Elapsed.TotalMilliseconds, 4)
            q15UiReady = $internal.q15UiReady
            loginVisible = $internal.loginVisible
            loginEnabled = $internal.loginEnabled
            bridgeAvailabilityKnown = $internal.bridgeAvailabilityKnown
        })
    }
}
finally {
    if ($null -eq $previousReport) { Remove-Item Env:IDEA_Q15_UI_READY_REPORT -ErrorAction SilentlyContinue }
    else { $env:IDEA_Q15_UI_READY_REPORT = $previousReport }
    if ($null -eq $previousExit) { Remove-Item Env:IDEA_Q15_UI_READY_EXIT -ErrorAction SilentlyContinue }
    else { $env:IDEA_Q15_UI_READY_EXIT = $previousExit }
}

$values = [double[]]@($samples | ForEach-Object { $_.externalProcessDurationMs })
$summary = [ordered]@{
    candidate = $Candidate
    surface = if ($Candidate -eq 'option-a') { 'React WebView2 WPF' } else { 'Flutter Windows' }
    sampleCount = $samples.Count
    readinessContract = 'Q15_UI_READY = rendered login visible and enabled; bridge availability is reported separately'
    thresholdState = if ($samples.Count -ge 20) { 'SAMPLED_20_PLUS' } else { 'BLOCKED' }
    unit = 'ms'
    minimum = [Math]::Round(($values | Measure-Object -Minimum).Minimum, 4)
    maximum = [Math]::Round(($values | Measure-Object -Maximum).Maximum, 4)
    mean = [Math]::Round(($values | Measure-Object -Average).Average, 4)
    samples = $samples
}
$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $resolvedOutput 'ui-ready-summary.json') -Encoding utf8
$summary | ConvertTo-Json -Depth 8
