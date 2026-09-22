param(
    [int]$Port = 8097,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$registerPath = Join-Path $repoRoot 'planning\idea-technical-pilot-execution-register.json'
$manifestPath = Join-Path $repoRoot 'planning\project-management-compiler-manifest.json'
$journalPath = Join-Path $repoRoot 'planning\idea-progress-work-journal.json'
$kanbanPath = Join-Path $repoRoot 'docs\product\instances\idea-engineering\planning\idea-technical-pilot-kanban-cario.md'
$validatorPath = Join-Path $repoRoot 'scripts\validate-project-management-source.ps1'
$indexPath = Join-Path $PSScriptRoot 'index.html'

function Get-NowIso {
    return [DateTimeOffset]::Now.ToOffset([TimeSpan]::FromHours(7)).ToString('o')
}

function Get-JsonFile([string]$path) {
    return Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Convert-ToObjectArray($value) {
    if ($null -eq $value) { return ,([object[]]@()) }
    if ($value -is [System.Array]) { return ,([object[]]$value) }
    return ,([object[]]@($value))
}

function Ensure-ArrayProperty($object, [string]$name) {
    $object.$name = Convert-ToObjectArray $object.$name
}

function Write-JsonFileAtomic([string]$path, $value) {
    $json = $value | ConvertTo-Json -Depth 100
    $tempPath = "$path.$([guid]::NewGuid().ToString('N')).tmp"
    [System.IO.File]::WriteAllText($tempPath, $json, [System.Text.UTF8Encoding]::new($false))
    Move-Item -LiteralPath $tempPath -Destination $path -Force
}

function Get-WorkJournal {
    if (-not (Test-Path -LiteralPath $journalPath -PathType Leaf)) {
        return [pscustomobject]@{
            journalVersion = '0.1.0'
            journalId = 'IE-PROGRESS-WORK-JOURNAL-001'
            timeZone = 'Asia/Ho_Chi_Minh'
            sessions = @()
            corrections = @()
        }
    }
    $journal = Get-JsonFile $journalPath
    Ensure-ArrayProperty $journal 'sessions'
    Ensure-ArrayProperty $journal 'corrections'
    return $journal
}

function Get-ActiveSession($journal, [string]$id) {
    return @($journal.sessions | Where-Object { $_.deliveryCardId -eq $id -and $_.state -eq 'RUNNING' })[0]
}

function Open-WorkSession($journal, [string]$id, [string]$now) {
    if ($null -ne (Get-ActiveSession $journal $id)) { throw "$id đã có bộ đếm giờ đang chạy." }
    $journal.sessions += [pscustomobject]@{
        sessionId = "SESSION-$([guid]::NewGuid().ToString('N'))"
        deliveryCardId = $id
        startedAt = $now
        stoppedAt = $null
        durationMinutes = $null
        state = 'RUNNING'
        recordedBy = 'LEAD'
    }
}

function Close-WorkSession($journal, $record, $definition, [string]$now, [bool]$confirmLongSession) {
    $session = Get-ActiveSession $journal ([string]$record.entity.id)
    if ($null -eq $session) { return 0 }

    $started = [DateTimeOffset]::Parse([string]$session.startedAt)
    $stopped = [DateTimeOffset]::Parse($now)
    $minutes = [int][math]::Round(($stopped - $started).TotalMinutes, 0, [MidpointRounding]::AwayFromZero)
    if ($minutes -lt 1) { $minutes = 1 }
    $offset = [TimeSpan]::FromHours(7)
    $crossesDay = $started.ToOffset($offset).Date -ne $stopped.ToOffset($offset).Date
    if (($minutes -gt 480 -or $crossesDay) -and -not $confirmLongSession) {
        throw "Phiên đang chạy kéo dài $minutes phút hoặc đi qua ngày mới. Hãy xác nhận thời gian này trước khi ghi nhận."
    }

    $session.stoppedAt = $now
    $session.durationMinutes = $minutes
    $session.state = 'CLOSED'

    $actualBefore = if ($null -eq $record.actualEffortHours) { 0.0 } else { [double]$record.actualEffortHours }
    $remainingBefore = if ($null -eq $record.remainingEffortHours) { [double]$definition.plannedHours } else { [double]$record.remainingEffortHours }
    $hours = $minutes / 60.0
    $record.actualEffortHours = [math]::Round($actualBefore + $hours, 4)
    $record.remainingEffortHours = [math]::Round([math]::Max(0, $remainingBefore - $hours), 4)
    return $minutes
}

function Add-EffortCorrection($journal, $record, $actual, $remaining, [string]$reason, [string]$now) {
    $previousActual = $record.actualEffortHours
    $previousRemaining = $record.remainingEffortHours
    if ([string]::IsNullOrWhiteSpace($reason)) { throw 'Sửa giờ đã làm hoặc giờ còn lại phải ghi lý do.' }
    $journal.corrections += [pscustomobject]@{
        correctionId = "CORRECTION-$([guid]::NewGuid().ToString('N'))"
        deliveryCardId = [string]$record.entity.id
        previousActualEffortHours = $previousActual
        newActualEffortHours = $actual
        previousRemainingEffortHours = $previousRemaining
        newRemainingEffortHours = $remaining
        reason = $reason.Trim()
        recordedAt = $now
        recordedBy = 'LEAD'
    }
    $record.actualEffortHours = $actual
    $record.remainingEffortHours = $remaining
}

function Get-CardDefinitions {
    $phase = ''
    $cards = @()
    foreach ($line in (Get-Content -LiteralPath $kanbanPath -Encoding UTF8)) {
        if ($line -match '^###\s+(.+?)\s+—') {
            $phase = ($Matches[1].Trim() -replace '^\d+(?:\.\d+)*\s+', '')
            continue
        }

        if ($line -match '^\|\s*`(?<id>[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)`\s*\|\s*(?<title>.*?)\s*\|\s*(?<hours>\d+(?:\.\d+)?)\s*\|\s*(?<dates>.*?)\s*\|\s*(?<before>.*?)\s*\|\s*(?<content>.*?)\s*\|\s*$') {
            # Copy captures before any further -match/-notmatch operation changes $Matches.
            $idValue = [string]$Matches.id
            $titleValue = [string]$Matches.title
            $hoursValue = [string]$Matches.hours
            $datesValue = [string]$Matches.dates
            $beforeValue = [string]$Matches.before
            $contentValue = [string]$Matches.content
            $before = $beforeValue.Trim().Replace('`', '')
            $predecessors = @()
            if ($before -and $before -notmatch '^(—|-|–)$') {
                $predecessors = @($before -split '\s*[,;]\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ -and $_ -notmatch '^(—|-|–)$' })
            }

            $cards += [pscustomobject]@{
                id = $idValue
                title = $titleValue.Trim().Replace('`', '')
                phase = $phase
                plannedHours = [double]$hoursValue
                plannedDates = $datesValue.Trim()
                predecessors = $predecessors
                definitionOfDone = (($contentValue.Trim() -replace '\s+', ' ') -replace '\*\*', '')
            }
        }
    }
    return $cards
}

function Get-Record([object]$register, [string]$id) {
    return @($register.records | Where-Object { $_.entity.id -eq $id })[0]
}

function Get-StatePayload {
    $register = Get-JsonFile $registerPath
    $manifest = Get-JsonFile $manifestPath
    $journal = Get-WorkJournal
    $definitions = @(Get-CardDefinitions)
    $records = @()
    foreach ($definition in $definitions) {
        $record = Get-Record $register $definition.id
        $records += [pscustomobject]@{
            id = $definition.id
            title = $definition.title
            phase = $definition.phase
            plannedHours = $definition.plannedHours
            plannedDates = $definition.plannedDates
            predecessors = @($definition.predecessors)
            definitionOfDone = $definition.definitionOfDone
            recordingState = if ($null -ne $record) { [string]$record.recordingState } else { 'NOT_RECORDED' }
            executionState = if ($null -ne $record -and $null -ne $record.executionState) { [string]$record.executionState } else { $null }
            resultState = if ($null -ne $record -and $null -ne $record.resultState) { [string]$record.resultState } else { $null }
            actualStart = if ($null -ne $record) { $record.actualStart } else { $null }
            actualFinish = if ($null -ne $record) { $record.actualFinish } else { $null }
            actualEffortHours = if ($null -ne $record) { $record.actualEffortHours } else { $null }
            remainingEffortHours = if ($null -ne $record) { $record.remainingEffortHours } else { $null }
            forecastFinish = if ($null -ne $record) { $record.forecastFinish } else { $null }
            lastUpdatedAt = if ($null -ne $record) { $record.lastUpdatedAt } else { $null }
            remainingReviewedAt = if ($null -ne $record) { $record.remainingReviewedAt } else { $null }
            recordedBy = if ($null -ne $record) { $record.recordedBy } else { $null }
            disposition = if ($null -ne $record) { $record.disposition } else { 'ACTIVE' }
            evidence = if ($null -ne $record) { Convert-ToObjectArray $record.evidence } else { [object[]]@() }
            blockers = if ($null -ne $record) { Convert-ToObjectArray $record.blockers } else { [object[]]@() }
            events = if ($null -ne $record) { Convert-ToObjectArray $record.events } else { [object[]]@() }
            activeSession = if ($null -ne $record) { Get-ActiveSession $journal $definition.id } else { $null }
            workSessions = @($journal.sessions | Where-Object { $_.deliveryCardId -eq $definition.id })
            effortCorrections = @($journal.corrections | Where-Object { $_.deliveryCardId -eq $definition.id })
        }
    }

    $completedHours = (($records | Where-Object { $_.executionState -eq 'COMPLETED' } | Measure-Object -Property plannedHours -Sum).Sum)
    if ($null -eq $completedHours) { $completedHours = 0 }
    $actualKnown = @($records | Where-Object { $null -ne $_.actualEffortHours -and $null -ne $_.remainingEffortHours })
    $actualSum = (($actualKnown | Measure-Object -Property actualEffortHours -Sum).Sum)
    $remainingSum = (($actualKnown | Measure-Object -Property remainingEffortHours -Sum).Sum)
    if ($null -eq $actualSum) { $actualSum = 0 }
    if ($null -eq $remainingSum) { $remainingSum = 0 }

    return [pscustomobject]@{
        generatedAt = Get-NowIso
        repoRoot = $repoRoot
        registerRevision = [int]$register.registerRevision
        registerStatus = [string]$register.status
        baselineId = [string]$register.baselineId
        expectedRegisterRevision = [int]$manifest.execution.expectedRegisterRevision
        plannedWorkHours = [double]$manifest.expectedSourceTotals.plannedWorkHours
        controlledReserveHours = [double]$manifest.expectedSourceTotals.controlledReserveHours
        operationalBufferHours = [double]$manifest.expectedSourceTotals.operationalBufferHours
        warning = 'Bản nháp cục bộ chỉ trở thành snapshot chính thức sau khi bấm Ghi nhận & công bố thành công.'
        summary = [pscustomobject]@{
            total = $records.Count
            recorded = @($records | Where-Object { $_.recordingState -eq 'RECORDED' }).Count
            notRecorded = @($records | Where-Object { $_.recordingState -eq 'NOT_RECORDED' }).Count
            inProgress = @($records | Where-Object { $_.executionState -eq 'IN_PROGRESS' }).Count
            completed = @($records | Where-Object { $_.executionState -eq 'COMPLETED' }).Count
            suspended = @($records | Where-Object { $_.executionState -eq 'SUSPENDED' }).Count
            completedPlannedHours = [double]$completedHours
            baselineRemainingHours = [math]::Max(0, [double]$manifest.expectedSourceTotals.plannedWorkHours - [double]$completedHours)
            deliveryRatio = if ([double]$manifest.expectedSourceTotals.plannedWorkHours -gt 0) { [math]::Round(($completedHours / [double]$manifest.expectedSourceTotals.plannedWorkHours) * 100, 1) } else { 0 }
            actualKnownCount = $actualKnown.Count
            actualEffortHours = [double]$actualSum
            remainingEffortHours = [double]$remainingSum
            estimatedWorkProgress = if (($actualSum + $remainingSum) -gt 0) { [math]::Round(($actualSum / ($actualSum + $remainingSum)) * 100, 1) } else { $null }
        }
        cards = $records
    }
}

function Send-Response($context, [int]$statusCode, [string]$contentType, [string]$body) {
    $bytes = [System.Text.UTF8Encoding]::new($false).GetBytes($body)
    $context.Response.StatusCode = $statusCode
    $context.Response.ContentType = $contentType
    $context.Response.ContentEncoding = [System.Text.Encoding]::UTF8
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.Headers['Cache-Control'] = 'no-store'
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
}

function Send-Json($context, [int]$statusCode, $value) {
    Send-Response $context $statusCode 'application/json; charset=utf-8' ($value | ConvertTo-Json -Depth 100)
}

function Parse-RequestBody($context) {
    $reader = [System.IO.StreamReader]::new($context.Request.InputStream, $context.Request.ContentEncoding)
    try { return $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
}

function Assert-NumberOrNull($value, [string]$name) {
    if ($null -eq $value -or [string]::IsNullOrWhiteSpace([string]$value)) { return $null }
    $number = 0.0
    if (-not [double]::TryParse([string]$value, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) { throw "$name phải là số." }
    if ($number -lt 0) { throw "$name phải là số >= 0." }
    return [math]::Round($number, 4)
}

function Add-WorkEvent($record, [string]$kind, [string]$reason, [string]$now) {
    if ($null -eq $record.events) { $record.events = @() }
    $record.events += [pscustomobject]@{
        eventId = "$($record.entity.id)-EVENT-$($record.events.Count + 1)"
        effectiveAt = $now
        recordedAt = $now
        recordedBy = 'LEAD'
        kind = $kind
        reason = $reason
    }
}

function Add-Evidence($record, $request, [string]$now) {
    $description = [string]$request.evidenceDescription
    if ([string]::IsNullOrWhiteSpace($description)) { throw 'Khi hoàn thành phải ghi mô tả bằng chứng.' }
    $type = [string]$request.evidenceType
    if ([string]::IsNullOrWhiteSpace($type)) { $type = if ($request.commit) { 'COMMIT' } else { 'ARTIFACT' } }
    if ($null -eq $record.evidence) { $record.evidence = @() }
    $record.evidence += [pscustomobject]@{
        evidenceId = "$($record.entity.id)-EVIDENCE-$($record.evidence.Count + 1)"
        type = $type
        repoPath = if ([string]::IsNullOrWhiteSpace([string]$request.repoPath)) { $null } else { [string]$request.repoPath }
        commit = if ([string]::IsNullOrWhiteSpace([string]$request.commit)) { $null } else { [string]$request.commit }
        sha256 = $null
        externalUri = $null
        description = $description.Trim()
        result = if ($request.resultState) { [string]$request.resultState } else { 'NOT_APPLICABLE' }
        recordedAt = $now
        recordedBy = 'LEAD'
    }
}

function Update-Record($request) {
    $register = Get-JsonFile $registerPath
    $manifest = Get-JsonFile $manifestPath
    $journal = Get-WorkJournal
    $id = [string]$request.id
    if ([string]::IsNullOrWhiteSpace($id)) { throw 'Thiếu mã card.' }
    $record = Get-Record $register $id
    if ($null -eq $record) { throw "Không tìm thấy Delivery Card $id." }
    Ensure-ArrayProperty $register 'records'
    Ensure-ArrayProperty $register 'changeHistory'
    Ensure-ArrayProperty $record 'evidence'
    Ensure-ArrayProperty $record 'blockers'
    Ensure-ArrayProperty $record 'events'
    Ensure-ArrayProperty $record 'successorRefs'
    $definition = @(Get-CardDefinitions | Where-Object { $_.id -eq $id })[0]
    if ($null -eq $definition) { throw "Không tìm thấy thông tin kế hoạch của $id." }

    $action = [string]$request.action
    $now = Get-NowIso
    $reason = [string]$request.reason
    $confirmLongSession = [bool]$request.confirmLongSession

    $otherActive = @($register.records | Where-Object { $_.entity.id -ne $id -and $_.executionState -eq 'IN_PROGRESS' })
    if ($action -in @('start', 'resume') -and $otherActive.Count -gt 0) {
        throw "Chỉ được có một card ở trạng thái Đang thực hiện. Card đang mở: $($otherActive[0].entity.id)."
    }
    if ($action -in @('start', 'resume')) {
        $blockedBy = @($definition.predecessors | Where-Object {
            $pre = Get-Record $register $_
            $null -eq $pre -or $pre.executionState -ne 'COMPLETED'
        })
        if ($blockedBy.Count -gt 0) { throw "Chưa thể bắt đầu $id. Cần hoàn thành trước: $($blockedBy -join ', ')." }
    }

    $newState = if ($null -ne $record.executionState) { [string]$record.executionState } else { 'NOT_STARTED' }
    if ($action -eq 'start' -or $action -eq 'resume') { $newState = 'IN_PROGRESS' }
    if ($action -eq 'suspend' -or $action -eq 'pause') { $newState = 'SUSPENDED' }
    if ($action -eq 'stop') { $newState = 'IN_PROGRESS' }
    if ($action -eq 'complete') { $newState = 'COMPLETED' }
    if ($action -eq 'cancel') { $newState = 'CANCELLED' }

    $activeSession = Get-ActiveSession $journal $id
    $closedMinutes = 0
    if ($action -in @('start', 'resume')) {
        if ($newState -eq 'COMPLETED' -or $newState -eq 'CANCELLED') { throw 'Không thể chạy bộ đếm cho card đã đóng.' }
        if ($null -eq $record.actualEffortHours) { $record.actualEffortHours = 0.0 }
        if ($null -eq $record.remainingEffortHours) { $record.remainingEffortHours = [double]$definition.plannedHours }
        Open-WorkSession $journal $id $now
    }
    elseif ($action -in @('stop', 'suspend', 'pause', 'complete')) {
        if ($action -eq 'stop' -and $null -eq $activeSession) { throw 'Card này không có bộ đếm giờ đang chạy.' }
        $closedMinutes = Close-WorkSession $journal $record $definition $now $confirmLongSession
    }

    if ($action -eq 'save') {
        $actual = Assert-NumberOrNull $request.actualEffortHours 'Giờ đã làm'
        $remaining = Assert-NumberOrNull $request.remainingEffortHours 'Giờ còn lại'
        if ($null -eq $actual) { $actual = $record.actualEffortHours }
        if ($null -eq $remaining) { $remaining = $record.remainingEffortHours }
        $actualChanged = [string]$actual -ne [string]$record.actualEffortHours
        $remainingChanged = [string]$remaining -ne [string]$record.remainingEffortHours
        if ($actualChanged -and $null -ne $activeSession) { throw 'Hãy dừng bộ đếm giờ trước khi sửa tổng giờ đã làm.' }
        if ($actualChanged -or $remainingChanged) {
            Add-EffortCorrection $journal $record $actual $remaining $reason $now
        }
        elseif ([string]::IsNullOrWhiteSpace($reason)) {
            $reason = "Đã xem lại giờ còn lại của $id; không thay đổi số liệu."
        }
    }

    if ($action -eq 'complete') {
        if ($null -eq $record.actualEffortHours) {
            $manualActual = Assert-NumberOrNull $request.actualEffortHours 'Giờ đã làm'
            if ($null -eq $manualActual) { throw 'Chưa có giờ làm thực tế. Hãy ghi nhận hoặc hiệu chỉnh trước khi hoàn thành.' }
            Add-EffortCorrection $journal $record $manualActual 0.0 $reason $now
        }
        $record.remainingEffortHours = 0.0
        Add-Evidence $record $request $now
    }
    if ($action -in @('suspend', 'pause') -and [string]::IsNullOrWhiteSpace([string]$request.blockerDescription)) { throw 'Tạm ngưng công việc phải ghi lý do đang bị chặn.' }

    if ([string]::IsNullOrWhiteSpace($reason)) {
        $reason = switch ($action) {
            'start' { "Bắt đầu làm $id và mở bộ đếm giờ." }
            'resume' { "Tiếp tục làm $id và mở phiên làm việc mới." }
            'stop' { "Dừng bộ đếm giờ của $id; card vẫn đang thực hiện." }
            'suspend' { "Tạm ngưng $id do có blocker." }
            'pause' { "Tạm ngưng $id do có blocker." }
            'complete' { "Hoàn thành $id và đóng giờ còn lại về 0." }
            default { "Cập nhật $id từ công cụ ghi nhận tiến độ cục bộ." }
        }
    }

    $record.recordingState = 'RECORDED'
    $record.executionState = $newState
    $record.resultState = if ($request.resultState) { [string]$request.resultState } else { if ($null -eq $record.resultState) { 'NOT_APPLICABLE' } else { [string]$record.resultState } }
    if ($request.actualStart) { $record.actualStart = [string]$request.actualStart }
    elseif ($newState -eq 'IN_PROGRESS' -and $null -eq $record.actualStart) { $record.actualStart = $now }
    if ($action -eq 'complete') { $record.actualFinish = $now }
    $record.lastUpdatedAt = $now
    if ($null -ne $record.remainingEffortHours) { $record.remainingReviewedAt = $now }
    $record.recordedBy = 'LEAD'
    $record.disposition = 'ACTIVE'

    if ($action -in @('suspend', 'pause')) {
        if ($null -eq $record.blockers) { $record.blockers = @() }
        $record.blockers += [pscustomobject]@{
            blockerId = "$id-BLOCKER-$($record.blockers.Count + 1)"
            category = if ($request.blockerCategory) { [string]$request.blockerCategory } else { 'OTHER' }
            description = ([string]$request.blockerDescription).Trim()
            owner = 'LEAD'
            openedAt = $now
            targetResolutionAt = $null
            closedAt = $null
            affectedMilestones = @()
            state = 'OPEN'
        }
    }
    if ($action -eq 'resume') {
        foreach ($blocker in @($record.blockers | Where-Object { $_.state -eq 'OPEN' })) {
            $blocker.state = 'RESOLVED'
            $blocker.closedAt = $now
        }
    }

    $eventKind = switch ($action) {
        'complete' { 'STATE_CHANGE' }
        'suspend' { 'BLOCKER_UPDATE' }
        'pause' { 'BLOCKER_UPDATE' }
        'start' { 'STATE_CHANGE' }
        'resume' { 'STATE_CHANGE' }
        default { 'EFFORT_UPDATE' }
    }
    if ($closedMinutes -gt 0) { $reason = "$reason Ghi nhận $closedMinutes phút làm việc thực tế." }
    Add-WorkEvent $record $eventKind $reason $now
    $nextRevision = [int]$register.registerRevision + 1
    $register.registerRevision = $nextRevision
    $register.statusDate = $now.Substring(0, 10)
    $register.changeHistory += [pscustomobject]@{
        revision = $nextRevision
        recordedAt = $now
        recordedBy = 'LEAD'
        reason = $reason
        sourceEvidence = "Local progress tracker: $id"
    }
    $manifest.execution.expectedRegisterRevision = $nextRevision
    Write-JsonFileAtomic $registerPath $register
    Write-JsonFileAtomic $manifestPath $manifest
    Write-JsonFileAtomic $journalPath $journal
    return Get-StatePayload
}

function Publish-Progress {
    $branch = (& git -C $repoRoot branch --show-current 2>&1 | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Không đọc được nhánh Git hiện tại.' }
    if ($branch -ne 'main') { throw "Chỉ công bố từ nhánh main. Nhánh hiện tại: $branch." }

    $allowed = @(
        'planning/idea-technical-pilot-execution-register.json',
        'planning/project-management-compiler-manifest.json',
        'planning/idea-progress-work-journal.json'
    )
    $statusLines = @(& git -C $repoRoot status --porcelain --untracked-files=all 2>&1)
    if ($LASTEXITCODE -ne 0) { throw 'Không đọc được trạng thái Git.' }
    $changedPaths = @($statusLines | ForEach-Object {
        $line = [string]$_
        if ($line.Length -lt 4) { return }
        $path = $line.Substring(3).Trim().Replace('\', '/')
        if ($path -match ' -> ') { $path = ($path -split ' -> ')[-1] }
        $path.Trim('"')
    } | Where-Object { $_ })
    $unrelated = @($changedPaths | Where-Object { $allowed -notcontains $_ })
    if ($unrelated.Count -gt 0) {
        throw "Không thể công bố vì working tree còn thay đổi ngoài phạm vi tiến độ: $($unrelated -join ', ')."
    }
    if ($changedPaths.Count -eq 0) { throw 'Không có thay đổi tiến độ mới để công bố.' }

    $previewOutput = @(& pwsh -NoProfile -File $validatorPath -RunFixtures 2>&1)
    if ($LASTEXITCODE -ne 0) { throw "Validator không đạt. Chưa commit hoặc push.`n$($previewOutput -join [Environment]::NewLine)" }

    & git -C $repoRoot add -- $allowed 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Không stage được các file tiến độ.' }
    $register = Get-JsonFile $registerPath
    $message = "chore(progress): publish register revision $($register.registerRevision)"
    $commitOutput = @(& git -C $repoRoot commit -m $message 2>&1)
    if ($LASTEXITCODE -ne 0) { throw "Không tạo được commit tiến độ.`n$($commitOutput -join [Environment]::NewLine)" }
    $commit = (& git -C $repoRoot rev-parse HEAD 2>&1 | Out-String).Trim()

    $cleanOutput = @(& pwsh -NoProfile -File $validatorPath -RunFixtures 2>&1)
    if ($LASTEXITCODE -ne 0) { throw "Commit đã tạo nhưng kiểm tra snapshot sạch không đạt; chưa push.`n$($cleanOutput -join [Environment]::NewLine)" }
    $pushOutput = @(& git -C $repoRoot push origin main 2>&1)
    if ($LASTEXITCODE -ne 0) { throw "Commit $commit đã tạo nhưng push thất bại.`n$($pushOutput -join [Environment]::NewLine)" }

    $payload = Get-StatePayload
    $payload | Add-Member -NotePropertyName publication -NotePropertyValue ([pscustomobject]@{
        commit = $commit
        branch = 'main'
        pushed = $true
    })
    return $payload
}

function Handle-Request($context) {
    $path = $context.Request.Url.AbsolutePath
    if ($context.Request.HttpMethod -eq 'GET' -and ($path -eq '/' -or $path -eq '/index.html')) {
        Send-Response $context 200 'text/html; charset=utf-8' (Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8)
        return
    }
    if ($context.Request.HttpMethod -eq 'GET' -and $path -eq '/api/state') {
        Send-Json $context 200 (Get-StatePayload)
        return
    }
    if ($context.Request.HttpMethod -eq 'GET' -and $path -eq '/api/health') {
        Send-Json $context 200 ([pscustomobject]@{
            ok = $true
            service = 'IDEA_PROGRESS_TRACKER'
            port = $Port
            generatedAt = Get-NowIso
        })
        return
    }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq '/api/update') {
        try { Send-Json $context 200 (Update-Record (Parse-RequestBody $context)) }
        catch { Send-Json $context 400 ([pscustomobject]@{ error = $_.Exception.Message }) }
        return
    }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq '/api/publish') {
        try { Send-Json $context 200 (Publish-Progress) }
        catch { Send-Json $context 400 ([pscustomobject]@{ error = $_.Exception.Message }) }
        return
    }
    Send-Json $context 404 ([pscustomobject]@{ error = 'Không tìm thấy đường dẫn.' })
}

function Test-ExistingTracker([int]$CandidatePort) {
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:$CandidatePort/api/health" -TimeoutSec 1
        if ($health.ok -ne $true) { return $false }
        if ([string]$health.service -eq 'IDEA_PROGRESS_TRACKER') { return $true }

        # Compatibility with tracker processes started before the service marker was added.
        $state = Invoke-RestMethod -Uri "http://localhost:$CandidatePort/api/state" -TimeoutSec 1
        return (-not [string]::IsNullOrWhiteSpace([string]$state.baselineId) -and $null -ne $state.cards)
    }
    catch { return $false }
}

$listener = $null
$selectedPort = $null
$lastListenError = $null
foreach ($candidatePort in $Port..($Port + 10)) {
    $candidateUrl = "http://localhost:$candidatePort/"
    if (Test-ExistingTracker $candidatePort) {
        Write-Host "IDEA Engineering Progress Tracker đã chạy tại $candidateUrl"
        if (-not $NoBrowser) { Start-Process $candidateUrl }
        exit 0
    }

    $candidateListener = [System.Net.HttpListener]::new()
    $candidateListener.Prefixes.Add($candidateUrl)
    try {
        $candidateListener.Start()
        $listener = $candidateListener
        $selectedPort = $candidatePort
        break
    }
    catch {
        $lastListenError = $_.Exception.Message
        $candidateListener.Close()
    }
}

if ($null -eq $listener) {
    throw "Không mở được tracker trên các cổng $Port–$($Port + 10). Lỗi cuối: $lastListenError"
}

$Port = $selectedPort
Write-Host "IDEA Engineering Progress Tracker đang chạy tại http://localhost:$Port/"
Write-Host "Nguồn: $registerPath"
Write-Host 'Đóng cửa sổ PowerShell để dừng. Bản nháp chỉ được push khi người dùng bấm Ghi nhận & công bố.'
if (-not $NoBrowser) { Start-Process "http://localhost:$Port/" }

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try { Handle-Request $context }
        catch {
            Write-Host ("Request failed: " + $_.Exception.ToString())
            Write-Host ("At: " + $_.InvocationInfo.PositionMessage)
            try { Send-Json $context 500 ([pscustomobject]@{ error = $_.Exception.Message }) } catch { }
        }
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
