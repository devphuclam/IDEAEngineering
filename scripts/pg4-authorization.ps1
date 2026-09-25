# Reads the machine-readable summary in the attributable PG4 gate record.
# This is a progress-control check, not a substitute for the authority's review.
function Get-Pg4Authorization {
    param([string]$RepositoryRoot)

    $relativePath = 'specs/004-technical-pilot-readiness/pg4-gate-record.md'
    $path = Join-Path $RepositoryRoot $relativePath
    $denied = {
        param([string]$Reason, [bool]$DecisionRecorded = $false, [string]$Outcome = 'NOT-APPLICABLE')
        [pscustomobject]@{
            decisionRecorded = $DecisionRecorded
            authorizesPh1 = $false
            outcome = $Outcome
            reason = $Reason
            sourcePath = $relativePath
        }
    }

    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        return & $denied 'Chưa có hồ sơ quyết định PG4.'
    }

    $content = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $blocks = [regex]::Matches($content, '(?ms)^```pg4-authorization[ \t]*\r?\n(?<json>.*?)\r?\n```[ \t]*$')
    if ($blocks.Count -ne 1) {
        return & $denied 'Hồ sơ PG4 phải có đúng một khối pg4-authorization.'
    }

    try {
        $gate = $blocks[0].Groups['json'].Value | ConvertFrom-Json -AsHashtable -Depth 30
    }
    catch {
        return & $denied 'Khối pg4-authorization không phải JSON hợp lệ.'
    }
    if ($gate -isnot [System.Collections.IDictionary]) {
        return & $denied 'Khối pg4-authorization phải là một JSON object.'
    }

    $required = @(
        'gate_id', 'increment_id', 'reviewed_manifest_id_and_hash', 'reviewed_git_commit',
        'execution_state', 'outcome', 'decision_date', 'decision_authority', 'rationale'
    )
    foreach ($field in $required) {
        $value = [string]($gate[$field])
        if ([string]::IsNullOrWhiteSpace($value) -or
            ($field -ne 'outcome' -and $value -in @('UNKNOWN', 'BLOCKED', 'NOT-RUN', 'NOT-APPLICABLE'))) {
            return & $denied "Hồ sơ PG4 thiếu $field."
        }
    }
    if ([string]$gate.gate_id -ne 'PG4' -or [string]$gate.increment_id -ne 'IE-INC-READY-001') {
        return & $denied 'Hồ sơ PG4 không khớp increment PH0 hiện hành.'
    }
    if ([string]$gate.execution_state -ne 'COMPLETE') {
        return & $denied 'PG4 chưa có quyết định hoàn tất.'
    }
    if ([string]$gate.outcome -notin @('PASS', 'PASS-WITH-ACTIONS', 'FAIL', 'BLOCKED')) {
        return & $denied 'PG4 COMPLETE phải có một trong bốn kết quả hợp lệ.'
    }
    if ([string]$gate.reviewed_git_commit -notmatch '^[0-9a-fA-F]{40}$' -or
        [string]$gate.reviewed_manifest_id_and_hash -notmatch '[0-9a-fA-F]{64}') {
        return & $denied 'PG4 chưa ghim commit 40 ký tự và SHA-256 của manifest.'
    }
    $decisionDate = [datetime]::MinValue
    if (-not [datetime]::TryParseExact([string]$gate.decision_date, 'yyyy-MM-dd',
            [Globalization.CultureInfo]::InvariantCulture,
            [Globalization.DateTimeStyles]::None, [ref]$decisionDate) -or
        $decisionDate.Date -gt [datetime]::Today) {
        return & $denied 'Ngày quyết định PG4 phải là ngày hợp lệ, không ở tương lai.'
    }

    $outcome = [string]$gate.outcome
    if ($outcome -in @('FAIL', 'BLOCKED')) {
        if ([string]$gate.authorized_successor_increment -ne 'NOT-APPLICABLE' -or
            [string]$gate.authorized_first_delivery_card -ne 'NOT-APPLICABLE' -or
            [string]$gate.authorization_state -ne 'INACTIVE') {
            return & $denied "PG4 $outcome không được ghi quyền bắt đầu PH1."
        }
        return & $denied "PG4 đã hoàn tất với kết quả $outcome; PH1 chưa được phép bắt đầu." $true $outcome
    }

    foreach ($field in @(
        'approved_pg2_requirements_baseline_and_evidence',
        'approved_pg3_architecture_design_baseline_and_evidence',
        'authorized_successor_increment', 'authorized_first_delivery_card', 'authorization_limits',
        'authorization_state'
    )) {
        $value = [string]($gate[$field])
        if ([string]::IsNullOrWhiteSpace($value) -or $value -in @('UNKNOWN', 'BLOCKED', 'NOT-RUN', 'NOT-APPLICABLE')) {
            return & $denied "PG4 $outcome thiếu $field."
        }
    }
    if ([string]$gate.authorized_successor_increment -ne 'IE-INC-PH1-FOUNDATION-CUSTODY-001' -or
        [string]$gate.authorized_first_delivery_card -ne 'F01-A') {
        return & $denied 'PG4 không cho phép đúng successor PH1/F01-A của kế hoạch hiện hành.'
    }
    if ([string]$gate.authorization_state -notin @('ACTIVE', 'REOPENED')) {
        return & $denied 'authorization_state của PG4 không hợp lệ.'
    }

    $tasksPath = Join-Path $RepositoryRoot 'specs/004-technical-pilot-readiness/tasks.md'
    if (-not (Test-Path -LiteralPath $tasksPath -PathType Leaf)) {
        return & $denied 'Không đọc được tasks.md để xác nhận T011 và T016.'
    }
    $taskLines = @(Get-Content -LiteralPath $tasksPath -Encoding UTF8)
    foreach ($taskId in @('T011', 'T016')) {
        if (@($taskLines | Where-Object { $_ -match "^- \[[xX]\] $taskId\b" }).Count -ne 1) {
            return & $denied "Chưa ghi hoàn thành $taskId; PG4 $outcome không thể mở PH1."
        }
    }

    if ($outcome -eq 'PASS' -and @($gate.conditional_actions).Count -gt 0) {
        return & $denied 'PG4 PASS không được có conditional actions; dùng PASS-WITH-ACTIONS nếu cần.'
    }

    if ($outcome -eq 'PASS-WITH-ACTIONS') {
        $actions = @($gate.conditional_actions)
        if ($actions.Count -eq 0) {
            return & $denied 'PG4 PASS-WITH-ACTIONS thiếu việc phải xử lý.'
        }
        foreach ($action in $actions) {
            foreach ($field in @(
                'action_id', 'description', 'owner', 'affected_baseline', 'due_condition_or_date',
                'expiry', 'escalation_path', 'non_invalidating_rationale', 'evidence_link'
            )) {
                if ([string]::IsNullOrWhiteSpace([string]($action[$field]))) {
                    return & $denied "Một conditional action thiếu $field."
                }
            }
            $expiry = [datetime]::MinValue
            if (-not [datetime]::TryParseExact([string]$action.expiry, 'yyyy-MM-dd',
                    [Globalization.CultureInfo]::InvariantCulture,
                    [Globalization.DateTimeStyles]::None, [ref]$expiry) -or
                $expiry.Date -lt [datetime]::Today) {
                return & $denied 'Một conditional action đã hết hạn hoặc không có ngày hết hạn hợp lệ.' $true $outcome
            }
        }
    }

    if ([string]$gate.authorization_state -eq 'REOPENED') {
        return & $denied 'Quyết định PG4 đã được mở lại; PH1 tạm dừng đến khi có quyết định mới.' $true $outcome
    }

    return [pscustomobject]@{
        decisionRecorded = $true
        authorizesPh1 = $true
        outcome = $outcome
        reason = "PG4 $outcome cho phép successor $($gate.authorized_successor_increment), bắt đầu bằng F01-A."
        sourcePath = $relativePath
    }
}
