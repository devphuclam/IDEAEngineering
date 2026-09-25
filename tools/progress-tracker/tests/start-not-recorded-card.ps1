param(
    [int]$Port = 18117
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$testRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("idea-progress-tracker-start-test-" + [guid]::NewGuid().ToString('N'))
$trackerRoot = Join-Path $testRoot 'tools\progress-tracker'
$scriptsRoot = Join-Path $testRoot 'scripts'
$planningRoot = Join-Path $testRoot 'planning'
$kanbanRoot = Join-Path $testRoot 'docs\product\instances\idea-engineering\planning'
$specRoot = Join-Path $testRoot 'specs\004-technical-pilot-readiness'
$serverLog = Join-Path $testRoot 'server.log'
$serverErrorLog = Join-Path $testRoot 'server-error.log'
$process = $null

try {
    New-Item -ItemType Directory -Path $trackerRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $scriptsRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $planningRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $kanbanRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $specRoot -Force | Out-Null

    Copy-Item -LiteralPath (Join-Path $repoRoot 'tools\progress-tracker\idea-progress-tracker.ps1') -Destination $trackerRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'tools\progress-tracker\index.html') -Destination $trackerRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'scripts\pg4-authorization.ps1') -Destination $scriptsRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'planning\idea-technical-pilot-execution-register.json') -Destination $planningRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'planning\project-management-compiler-manifest.json') -Destination $planningRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'planning\idea-progress-work-journal.json') -Destination $planningRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'docs\product\instances\idea-engineering\planning\idea-technical-pilot-kanban-cario.md') -Destination $kanbanRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'specs\004-technical-pilot-readiness\tasks.md') -Destination $specRoot

    # Build a stable NOT_RECORDED fixture in the temporary copy. The repository's live P04 state
    # may legitimately be IN_PROGRESS, so a regression test must not inherit that state or its timer.
    $registerPath = Join-Path $planningRoot 'idea-technical-pilot-execution-register.json'
    $register = Get-Content -Raw -LiteralPath $registerPath | ConvertFrom-Json
    $record = @($register.records | Where-Object { $_.entity.id -eq 'P04' })[0]
    if ($null -eq $record) { throw 'P04 was absent from the copied execution register fixture.' }
    $record.recordingState = 'NOT_RECORDED'
    foreach ($property in @(
        'executionState', 'resultState', 'actualStart', 'actualFinish', 'actualEffortHours',
        'remainingEffortHours', 'forecastFinish', 'lastUpdatedAt', 'remainingReviewedAt',
        'recordedBy', 'unplannedWorkType', 'reserveUsedHours'
    )) {
        $record.PSObject.Properties.Remove($property)
    }
    $record.evidence = @()
    $record.blockers = @()
    $record.events = @()
    $register | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $registerPath -Encoding utf8

    $journalPath = Join-Path $planningRoot 'idea-progress-work-journal.json'
    $journal = Get-Content -Raw -LiteralPath $journalPath | ConvertFrom-Json
    $journal.sessions = @($journal.sessions | Where-Object { $_.deliveryCardId -ne 'P04' })
    $journal.corrections = @($journal.corrections | Where-Object { $_.deliveryCardId -ne 'P04' })
    $journal | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $journalPath -Encoding utf8

    $trackerScript = Join-Path $trackerRoot 'idea-progress-tracker.ps1'
    $process = Start-Process -FilePath 'pwsh' `
        -ArgumentList @('-NoProfile', '-File', $trackerScript, '-NoBrowser', '-Port', [string]$Port) `
        -WindowStyle Hidden `
        -RedirectStandardOutput $serverLog `
        -RedirectStandardError $serverErrorLog `
        -PassThru

    $ready = $false
    foreach ($attempt in 1..50) {
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:$Port/api/health" -TimeoutSec 1
            if ($health.ok -eq $true) {
                $ready = $true
                break
            }
        }
        catch { }
        Start-Sleep -Milliseconds 100
    }
    if (-not $ready) { throw 'Tracker test server did not become ready.' }

    $initialState = Invoke-RestMethod -Uri "http://localhost:$Port/api/state" -TimeoutSec 5
    $p07 = @($initialState.cards | Where-Object { $_.id -eq 'P07' })[0]
    if ($null -eq $p07) { throw 'P07 was absent from the tracker state.' }
    if (@($p07.substeps).Count -ne 6) { throw "Expected six P07 review substeps, got $(@($p07.substeps).Count)." }
    if (@($initialState.cards).Count -ne 53) { throw 'P07 substeps must not create new Delivery Cards.' }
    $scenarioStep = @($p07.substeps | Where-Object { $_.id -eq 'P07.1' })[0]
    $t011Line = @(Get-Content -LiteralPath (Join-Path $specRoot 'tasks.md') | Where-Object { $_ -match '^- \[[xX ]\] T011\b' })[0]
    if ($null -eq $t011Line) { throw 'T011 was absent from the copied Spec Kit checklist.' }
    $expectedChecklistState = if ($t011Line -match '^- \[[xX]\]') { 'ALL_CHECKED' } else { 'OPEN' }
    if ($scenarioStep.checklistState -ne $expectedChecklistState -or @($scenarioStep.taskIds)[0] -ne 'T011') {
        throw 'P07.1 must reflect the current T011 state from the Spec Kit checklist.'
    }
    if ($initialState.pg4.authorizesPh1 -ne $false) {
        throw 'A missing PG4 decision must not authorize PH1.'
    }

    $p07CompleteRequest = @{
        id = 'P07'
        action = 'complete'
        actualEffortHours = 1
        evidenceDescription = 'Fixture evidence is not a PG4 decision.'
        resultState = 'NOT_APPLICABLE'
    } | ConvertTo-Json
    $p07Response = Invoke-WebRequest -Uri "http://localhost:$Port/api/update" -Method Post `
        -ContentType 'application/json' -Body $p07CompleteRequest -SkipHttpErrorCheck
    if ([int]$p07Response.StatusCode -ne 400 -or $p07Response.Content -notmatch 'PG4') {
        throw "P07 completion without a PG4 decision was not refused: $($p07Response.Content)"
    }

    # Simulate a previously completed P07 in the temporary fixture. The PH1 boundary must
    # still reject F01-A when the separate PG4 gate record is absent.
    $register = Get-Content -Raw -LiteralPath $registerPath | ConvertFrom-Json
    $p07Record = @($register.records | Where-Object { $_.entity.id -eq 'P07' })[0]
    $p07Record.recordingState = 'RECORDED'
    $p07Record | Add-Member -NotePropertyName executionState -NotePropertyValue 'COMPLETED' -Force
    $register | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $registerPath -Encoding utf8

    $f01Request = @{
        id = 'F01-A'
        action = 'start'
        resultState = 'NOT_APPLICABLE'
    } | ConvertTo-Json
    $f01Response = Invoke-WebRequest -Uri "http://localhost:$Port/api/update" -Method Post `
        -ContentType 'application/json' -Body $f01Request -SkipHttpErrorCheck
    if ([int]$f01Response.StatusCode -ne 400 -or $f01Response.Content -notmatch 'PG4') {
        throw "F01-A start without PG4 authorization was not refused: $($f01Response.Content)"
    }
    $afterDenied = Get-Content -Raw -LiteralPath $registerPath | ConvertFrom-Json
    if ([int]$afterDenied.registerRevision -ne [int]$initialState.registerRevision) {
        throw 'A denied PG4 transition changed the Execution Register revision.'
    }

    $request = @{
        id = 'P04'
        action = 'start'
        actualEffortHours = $null
        remainingEffortHours = $null
        reason = ''
        blockerDescription = ''
        evidenceDescription = ''
        repoPath = ''
        commit = ''
        resultState = 'NOT_APPLICABLE'
        confirmLongSession = $false
    } | ConvertTo-Json

    $response = Invoke-WebRequest `
        -Uri "http://localhost:$Port/api/update" `
        -Method Post `
        -ContentType 'application/json' `
        -Body $request `
        -SkipHttpErrorCheck

    if ([int]$response.StatusCode -ne 200) {
        throw "Expected HTTP 200 when starting a NOT_RECORDED card, got $([int]$response.StatusCode): $($response.Content)"
    }

    $payload = $response.Content | ConvertFrom-Json
    $card = @($payload.cards | Where-Object { $_.id -eq 'P04' })[0]
    if ($null -eq $card) { throw 'P04 was absent from the returned tracker state.' }
    if ($card.recordingState -ne 'RECORDED') { throw "Expected P04 recordingState RECORDED, got $($card.recordingState)." }
    if ($card.executionState -ne 'IN_PROGRESS') { throw "Expected P04 executionState IN_PROGRESS, got $($card.executionState)." }
    if ([double]$card.actualEffortHours -ne 0.0) { throw "Expected P04 actualEffortHours 0, got $($card.actualEffortHours)." }
    if ([double]$card.remainingEffortHours -ne 4.0) { throw "Expected P04 remainingEffortHours 4, got $($card.remainingEffortHours)." }
    if ($null -eq $card.activeSession) { throw 'Expected P04 to have an active work session.' }

    Write-Output 'PASS: starting P04 initializes optional execution fields and opens a work session.'
    Write-Output 'PASS: P07 shows six read-only Spec Kit review substeps without adding Delivery Cards.'
    Write-Output 'PASS: P07 cannot close without a PG4 decision; F01-A cannot start from P07 completion alone.'
}
finally {
    if ($null -ne $process -and -not $process.HasExited) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        $process.WaitForExit(3000) | Out-Null
    }

    $resolvedTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    $resolvedTestRoot = [System.IO.Path]::GetFullPath($testRoot)
    if ($resolvedTestRoot.StartsWith($resolvedTemp, [System.StringComparison]::OrdinalIgnoreCase) -and
        [System.IO.Path]::GetFileName($resolvedTestRoot).StartsWith('idea-progress-tracker-start-test-', [System.StringComparison]::Ordinal)) {
        Remove-Item -LiteralPath $resolvedTestRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
