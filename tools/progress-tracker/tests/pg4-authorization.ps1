$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
. (Join-Path $repoRoot 'scripts\pg4-authorization.ps1')

$tempBase = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$testRoot = Join-Path $tempBase ('idea-pg4-authorization-test-' + [guid]::NewGuid().ToString('N'))
$specRoot = Join-Path $testRoot 'specs\004-technical-pilot-readiness'
$gatePath = Join-Path $specRoot 'pg4-gate-record.md'
$tasksPath = Join-Path $specRoot 'tasks.md'

function Assert-Gate([bool]$ExpectedDecision, [bool]$ExpectedAuthorization, [string]$Scenario) {
    $result = Get-Pg4Authorization -RepositoryRoot $testRoot
    if ($result.decisionRecorded -ne $ExpectedDecision -or $result.authorizesPh1 -ne $ExpectedAuthorization) {
        throw "$Scenario returned decision=$($result.decisionRecorded), authorization=$($result.authorizesPh1): $($result.reason)"
    }
}

function Write-Gate($Value) {
    $json = $Value | ConvertTo-Json -Depth 20
    [System.IO.File]::WriteAllText($gatePath, "# PG4 test fixture`n`n" + '```pg4-authorization' + "`n$json`n" + '```' + "`n")
}

try {
    New-Item -ItemType Directory -Path $specRoot -Force | Out-Null
    Assert-Gate $false $false 'No decision record'

    $gate = [ordered]@{
        gate_id = 'PG4'
        increment_id = 'IE-INC-READY-001'
        reviewed_manifest_id_and_hash = 'IE-READY-MANIFEST-001 SHA-256 ' + ('a' * 64)
        reviewed_git_commit = 'b' * 40
        execution_state = 'COMPLETE'
        outcome = 'BLOCKED'
        decision_date = (Get-Date).ToString('yyyy-MM-dd')
        decision_authority = 'Fixture PG4 Gate Authority'
        rationale = 'Mandatory input is missing.'
        authorized_successor_increment = 'NOT-APPLICABLE'
        authorized_first_delivery_card = 'NOT-APPLICABLE'
        authorization_state = 'INACTIVE'
        conditional_actions = @()
    }
    Write-Gate $gate
    Assert-Gate $true $false 'BLOCKED decision without PG2/PG3 evidence'

    $gate.outcome = 'PASS'
    $gate.approved_pg2_requirements_baseline_and_evidence = 'PG2 fixture baseline and review'
    $gate.approved_pg3_architecture_design_baseline_and_evidence = 'PG3 fixture baseline and review'
    $gate.authorized_successor_increment = 'IE-INC-PH1-FOUNDATION-CUSTODY-001'
    $gate.authorized_first_delivery_card = 'F01-A'
    $gate.authorization_limits = 'Only the named PH1 increment'
    $gate.authorization_state = 'ACTIVE'
    Write-Gate $gate
    Assert-Gate $false $false 'PASS before T011/T016 review'

    [System.IO.File]::WriteAllText($tasksPath, "- [x] T011 reviewed`n- [x] T016 reviewed`n")
    Assert-Gate $true $true 'PASS with reviewed prerequisites'

    $gate.outcome = 'PASS-WITH-ACTIONS'
    Write-Gate $gate
    Assert-Gate $false $false 'Conditional PASS without actions'

    $gate.conditional_actions = @([ordered]@{
        action_id = 'A-001'
        description = 'Complete bounded follow-up'
        owner = 'Fixture owner'
        affected_baseline = 'PH1 fixture baseline'
        due_condition_or_date = 'Before first release'
        expiry = (Get-Date).AddDays(30).ToString('yyyy-MM-dd')
        escalation_path = 'PG4 Gate Authority'
        non_invalidating_rationale = 'Does not remove a mandatory input'
        evidence_link = 'specs/004-technical-pilot-readiness/fixture.md'
    })
    Write-Gate $gate
    Assert-Gate $true $true 'Active conditional PASS'

    $gate.conditional_actions[0].expiry = (Get-Date).AddDays(-1).ToString('yyyy-MM-dd')
    Write-Gate $gate
    Assert-Gate $true $false 'Expired conditional PASS'

    $gate.conditional_actions[0].expiry = (Get-Date).AddDays(30).ToString('yyyy-MM-dd')
    $gate.authorization_state = 'REOPENED'
    Write-Gate $gate
    Assert-Gate $true $false 'Reopened decision'

    Write-Output 'PASS: PG4 decision and PH1 authorization stay separate across missing, blocked, pass, conditional, expired and reopened cases.'
}
finally {
    $resolvedRoot = [System.IO.Path]::GetFullPath($testRoot)
    if ($resolvedRoot.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase) -and
        [System.IO.Path]::GetFileName($resolvedRoot).StartsWith('idea-pg4-authorization-test-', [System.StringComparison]::Ordinal)) {
        Remove-Item -LiteralPath $resolvedRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
