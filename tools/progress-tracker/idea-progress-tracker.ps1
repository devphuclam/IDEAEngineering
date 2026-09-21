param(
    [int]$Port = 8097,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$registerPath = Join-Path $repoRoot 'planning\idea-technical-pilot-execution-register.json'
$manifestPath = Join-Path $repoRoot 'planning\project-management-compiler-manifest.json'
$kanbanPath = Join-Path $repoRoot 'docs\product\instances\idea-engineering\planning\idea-technical-pilot-kanban-cario.md'
$readinessPath = Join-Path $repoRoot 'specs\004-technical-pilot-readiness\readiness-register.md'
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
                definitionOfDone = ($contentValue.Trim() -replace '\s+', ' ')
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
        warning = 'Local preview: sau khi ghi nhận cần commit lên IDEAEngineering để Compiler nhập snapshot chính thức.'
        summary = [pscustomobject]@{
            total = $records.Count
            recorded = @($records | Where-Object { $_.recordingState -eq 'RECORDED' }).Count
            notRecorded = @($records | Where-Object { $_.recordingState -eq 'NOT_RECORDED' }).Count
            inProgress = @($records | Where-Object { $_.executionState -eq 'IN_PROGRESS' }).Count
            completed = @($records | Where-Object { $_.executionState -eq 'COMPLETED' }).Count
            suspended = @($records | Where-Object { $_.executionState -eq 'SUSPENDED' }).Count
            completedPlannedHours = [double]$completedHours
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
    if ($number -lt 0 -or ([math]::Abs(($number * 2) - [math]::Round($number * 2))) -gt 0.00001) { throw "$name phải là số >= 0 theo bước 0.5 giờ." }
    return $number
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
    if ([string]::IsNullOrWhiteSpace($reason)) { $reason = "Cập nhật $id từ công cụ ghi nhận tiến độ cục bộ." }

    $otherActive = @($register.records | Where-Object { $_.entity.id -ne $id -and $_.executionState -eq 'IN_PROGRESS' })
    if (($action -in @('start', 'resume') -or ($action -eq 'save' -and $request.executionState -eq 'IN_PROGRESS')) -and $otherActive.Count -gt 0) {
        throw "Chỉ được có một card ở trạng thái Đang thực hiện. Card đang mở: $($otherActive[0].entity.id)."
    }
    if ($action -in @('start', 'resume')) {
        $blockedBy = @($definition.predecessors | Where-Object {
            $pre = Get-Record $register $_
            $null -eq $pre -or $pre.executionState -ne 'COMPLETED'
        })
        if ($blockedBy.Count -gt 0) { throw "Chưa thể bắt đầu $id. Cần hoàn thành trước: $($blockedBy -join ', ')." }
    }

    $newState = if ($request.executionState) { [string]$request.executionState } else { [string]$record.executionState }
    if ($action -eq 'start' -or $action -eq 'resume') { $newState = 'IN_PROGRESS' }
    if ($action -eq 'pause') { $newState = 'SUSPENDED' }
    if ($action -eq 'complete') { $newState = 'COMPLETED' }
    if ($action -eq 'cancel') { $newState = 'CANCELLED' }
    if ($null -eq $newState -or $newState -eq '') { $newState = 'NOT_STARTED' }

    $actual = Assert-NumberOrNull $request.actualEffortHours 'Giờ đã làm'
    $remaining = Assert-NumberOrNull $request.remainingEffortHours 'Giờ còn lại'
    if ($action -eq 'complete') {
        if ($null -eq $actual) { throw 'Khi hoàn thành phải nhập Giờ đã làm.' }
        $remaining = 0.0
        if ($id -eq 'P01') {
            $readinessText = Get-Content -LiteralPath $readinessPath -Raw -Encoding UTF8
            if ($readinessText -match 'Reviewer / date[^\r\n]*NOT-RUN|\| Result \| `NOT-RUN`') {
                throw 'P01 còn chờ T006: Project Reviewer phải ghi disposition vào readiness register trước khi đóng card.'
            }
        }
        Add-Evidence $record $request $now
    }
    if ($action -eq 'pause' -and [string]::IsNullOrWhiteSpace([string]$request.blockerDescription)) { throw 'Tạm dừng phải ghi lý do đang bị chặn.' }

    $record.recordingState = 'RECORDED'
    $record.executionState = $newState
    $record.resultState = if ($request.resultState) { [string]$request.resultState } else { if ($null -eq $record.resultState) { 'NOT_APPLICABLE' } else { [string]$record.resultState } }
    if ($request.actualStart) { $record.actualStart = [string]$request.actualStart }
    elseif ($newState -eq 'IN_PROGRESS' -and $null -eq $record.actualStart) { $record.actualStart = $now }
    if ($action -eq 'complete') { $record.actualFinish = $now }
    $record.actualEffortHours = $actual
    $record.remainingEffortHours = $remaining
    $record.lastUpdatedAt = $now
    if ($null -ne $remaining) { $record.remainingReviewedAt = $now }
    $record.recordedBy = 'LEAD'
    $record.disposition = 'ACTIVE'

    if ($action -eq 'pause') {
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
        'pause' { 'BLOCKER_UPDATE' }
        'start' { 'STATE_CHANGE' }
        'resume' { 'STATE_CHANGE' }
        default { 'EFFORT_UPDATE' }
    }
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
    return Get-StatePayload
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
        Send-Json $context 200 ([pscustomobject]@{ ok = $true; generatedAt = Get-NowIso })
        return
    }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq '/api/update') {
        try { Send-Json $context 200 (Update-Record (Parse-RequestBody $context)) }
        catch { Send-Json $context 400 ([pscustomobject]@{ error = $_.Exception.Message }) }
        return
    }
    Send-Json $context 404 ([pscustomobject]@{ error = 'Không tìm thấy đường dẫn.' })
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "IDEA Engineering Progress Tracker đang chạy tại http://localhost:$Port/"
Write-Host "Nguồn: $registerPath"
Write-Host 'Đóng cửa sổ PowerShell để dừng. Đây là công cụ local; sau khi cập nhật hãy commit register và manifest.'
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
