[CmdletBinding()]
param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$ManifestPath = 'planning/project-management-compiler-manifest.json',
    [switch]$RunFixtures
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$SupportedContractVersions = @('0.1.0')
$RequiredSourceRoles = @(
    'ROADMAP_AUTHORITY',
    'WORK_PACKAGE_AUTHORITY',
    'DELIVERY_CARD_AUTHORITY',
    'EXECUTION_AUTHORITY',
    'RENDITION_CROSS_CHECK',
    'READINESS_EVIDENCE',
    'NAVIGATION_ONLY'
)
$AllowedExecutionStates = @('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED', 'CANCELLED')
$AllowedResultStates = @('NOT_RUN', 'PASS', 'FAIL', 'BLOCKED', 'NOT_APPLICABLE')
$AllowedPriorities = @('URGENT', 'HIGH', 'NORMAL', 'LOW')
$script:UnsupportedProductionContract = $false

function New-DiagnosticList {
    # Prevent PowerShell from enumerating an empty List into `$null` on return.
    return ,([System.Collections.Generic.List[object]]::new())
}

function Add-Diagnostic {
    param(
        [System.Collections.Generic.List[object]]$List,
        [string]$Code,
        [ValidateSet('ERROR', 'WARNING', 'INFO')][string]$Severity,
        [string]$Message,
        [string]$RecommendedAction,
        [string]$SourcePath = '',
        [string]$Field = '',
        [string]$EntityKind = '',
        [string]$EntityId = ''
    )

    $List.Add([pscustomobject]@{
        code = $Code
        severity = $Severity
        entityKind = $EntityKind
        entityId = $EntityId
        sourcePath = $SourcePath
        field = $Field
        message = $Message
        recommendedAction = $RecommendedAction
    })
}

function Has-Property {
    param([object]$Object, [string]$Name)
    return $null -ne $Object -and $Object.PSObject.Properties.Name -contains $Name
}

function Get-PropertyValue {
    param([object]$Object, [string]$Name, [object]$Default = $null)
    if (Has-Property $Object $Name) { return $Object.$Name }
    return $Default
}

function Read-JsonFile {
    param([string]$Path)
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json -Depth 100
}

function Test-JsonAgainstSchema {
    param(
        [string]$InstancePath,
        [string]$SchemaPath,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath
    )

    if ($null -eq (Get-Command Test-Json -ErrorAction SilentlyContinue)) {
        throw 'PowerShell Test-Json is required to validate the Execution Register schema.'
    }

    $schemaErrors = @()
    $isValid = Get-Content -LiteralPath $InstancePath -Raw -Encoding UTF8 |
        Test-Json -SchemaFile $SchemaPath -ErrorAction SilentlyContinue -ErrorVariable schemaErrors
    if (-not $isValid) {
        Add-Diagnostic $Diagnostics 'PMC-SCHEMA-001' 'ERROR' 'JSON instance does not conform to the selected Execution Register schema.' 'Correct the instance or publish a reviewed contract/schema successor.' $SourcePath 'schema'
    }
}

function Resolve-RepositoryPath {
    param(
        [string]$Root,
        [string]$RelativePath,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$Field,
        [bool]$MustExist = $true
    )

    if ([string]::IsNullOrWhiteSpace($RelativePath) -or [System.IO.Path]::IsPathRooted($RelativePath)) {
        Add-Diagnostic $Diagnostics 'PMC-PATH-001' 'ERROR' "Path must be repository-relative: $RelativePath" 'Use a non-empty repository-relative path.' $RelativePath $Field
        return $null
    }

    $rootFull = [System.IO.Path]::GetFullPath($Root).TrimEnd('\', '/')
    $candidate = [System.IO.Path]::GetFullPath((Join-Path $rootFull $RelativePath))
    $prefix = $rootFull + [System.IO.Path]::DirectorySeparatorChar
    if (-not $candidate.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        Add-Diagnostic $Diagnostics 'PMC-PATH-001' 'ERROR' "Path escapes repository root: $RelativePath" 'Keep every declared source inside repositoryRoot.' $RelativePath $Field
        return $null
    }

    if ($MustExist -and -not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        Add-Diagnostic $Diagnostics 'PMC-PATH-002' 'ERROR' "Declared file does not exist: $RelativePath" 'Restore the file or correct the declared path.' $RelativePath $Field
        return $null
    }

    if ($MustExist) {
        $item = Get-Item -LiteralPath $candidate -Force
        if (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
            Add-Diagnostic $Diagnostics 'PMC-PATH-002' 'ERROR' "Declared file is a reparse point and is not accepted: $RelativePath" 'Use a regular file within repositoryRoot.' $RelativePath $Field
            return $null
        }
    }

    return $candidate
}

function Test-ContractVersion {
    param(
        [object]$Object,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath,
        [bool]$Production
    )

    $version = [string](Get-PropertyValue $Object 'contractVersion' '')
    if ($version -notmatch '^\d+\.\d+\.\d+$') {
        Add-Diagnostic $Diagnostics 'PMC-CONTRACT-001' 'ERROR' "Missing or malformed contractVersion '$version'." 'Use an explicitly supported Semantic Version.' $SourcePath 'contractVersion'
        return
    }
    if ($SupportedContractVersions -notcontains $version) {
        Add-Diagnostic $Diagnostics 'PMC-CONTRACT-002' 'ERROR' "Unsupported contractVersion '$version'." "Use one of: $($SupportedContractVersions -join ', '), or add a reviewed migration." $SourcePath 'contractVersion'
        if ($Production) { $script:UnsupportedProductionContract = $true }
    }
}

function Test-BaselineReference {
    param(
        [object]$Reference,
        [object]$Manifest,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath
    )

    Test-ContractVersion $Reference $Diagnostics $SourcePath $true
    if ([string](Get-PropertyValue $Reference 'baselineId' '') -ne [string]$Manifest.activeBaseline.baselineId) {
        Add-Diagnostic $Diagnostics 'PMC-SNAPSHOT-002' 'ERROR' 'Baseline reference and manifest use different Baseline IDs.' 'Update the candidate snapshot atomically.' $SourcePath 'baselineId'
    }
    if ((Get-PropertyValue $Reference 'renditionOnly' $null) -ne $true) {
        Add-Diagnostic $Diagnostics 'PMC-SOURCE-001' 'ERROR' 'Baseline reference must remain a rendition-only cross-check.' 'Keep DOC-07 sources authoritative and mark this reference renditionOnly.' $SourcePath 'renditionOnly'
    }

    $totals = Get-PropertyValue $Reference 'totals' $null
    foreach ($field in @('phases', 'workPackages', 'deliveryCards', 'gatesAndMilestones', 'plannedWorkHours', 'controlledReserveHours', 'totalBaselineCapacityHours')) {
        $actual = Get-PropertyValue $totals $field $null
        $expected = Get-PropertyValue $Manifest.expectedSourceTotals $field $null
        if ($null -eq $actual -or $null -eq $expected -or [int]$actual -ne [int]$expected) {
            Add-Diagnostic $Diagnostics 'PMC-SOURCE-001' 'ERROR' "Baseline reference total '$field' does not match the manifest." 'Reconcile the owning planning source, manifest and reference in one change.' $SourcePath "totals.$field"
        }
    }
    if ($null -ne $totals) {
        $calculatedCapacity = [int]$totals.plannedWorkHours + [int]$totals.controlledReserveHours
        if ($calculatedCapacity -ne [int]$totals.totalBaselineCapacityHours) {
            Add-Diagnostic $Diagnostics 'PMC-SOURCE-001' 'ERROR' 'Baseline capacity does not equal planned work plus controlled reserve.' 'Correct the controlled planning totals.' $SourcePath 'totals.totalBaselineCapacityHours'
        }
    }
}

function Test-ProjectCalendar {
    param(
        [object]$Calendar,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath,
        [string]$Root
    )

    Test-ContractVersion $Calendar $Diagnostics $SourcePath $true
    if ([string](Get-PropertyValue $Calendar 'timeZone' '') -ne 'Asia/Ho_Chi_Minh') {
        Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' "Unexpected timezone '$($Calendar.timeZone)'." 'Use Asia/Ho_Chi_Minh.' $SourcePath 'timeZone'
    }
    $hours = Get-PropertyValue $Calendar 'hoursPerWorkingDay' $null
    if ($null -eq $hours -or -not ($hours -is [ValueType]) -or [double]$hours -le 0 -or [double]$hours -gt 24) {
        Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' 'hoursPerWorkingDay must be numeric and greater than zero but no more than 24.' 'Correct the calendar workday duration.' $SourcePath 'hoursPerWorkingDay'
    }

    $allowedDays = @('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
    foreach ($calendarName in @('baselineCalendar', 'forecastCalendar')) {
        $definition = Get-PropertyValue $Calendar $calendarName $null
        if ($null -eq $definition) {
            Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' "Calendar is missing $calendarName." 'Declare both Baseline and forecast calendars.' $SourcePath $calendarName
            continue
        }
        $days = @(Get-PropertyValue $definition 'regularWorkingDays' @())
        if ($days.Count -eq 0 -or @($days | Sort-Object -Unique).Count -ne $days.Count -or @($days | Where-Object { [string]$_ -notin $allowedDays }).Count -gt 0) {
            Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' "$calendarName has missing, duplicate or unsupported regular working days." 'Use unique uppercase weekday names.' $SourcePath "$calendarName.regularWorkingDays"
        }
        foreach ($rule in @(Get-PropertyValue $definition 'monthlyWorkingDayRules' @())) {
            $day = [string](Get-PropertyValue $rule 'dayOfWeek' '')
            $occurrences = @(Get-PropertyValue $rule 'occurrences' @())
            $ruleHours = Get-PropertyValue $rule 'hours' $null
            if ($day -notin $allowedDays -or $occurrences.Count -eq 0 -or @($occurrences | Sort-Object -Unique).Count -ne $occurrences.Count -or @($occurrences | Where-Object { [int]$_ -lt 1 -or [int]$_ -gt 5 }).Count -gt 0 -or $null -eq $ruleHours -or [double]$ruleHours -le 0 -or [double]$ruleHours -gt 24) {
                Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' "$calendarName contains an invalid monthly working-day rule." 'Use a valid weekday, unique occurrences 1-5 and hours greater than zero but no more than 24.' $SourcePath "$calendarName.monthlyWorkingDayRules"
            }
        }
    }

    if ([string](Get-PropertyValue $Calendar 'baselineChangeState' '') -notin @('ALIGNED', 'REBASELINE_REQUIRED')) {
        Add-Diagnostic $Diagnostics 'PMC-CALENDAR-002' 'ERROR' 'baselineChangeState is missing or unsupported.' 'Use ALIGNED or REBASELINE_REQUIRED.' $SourcePath 'baselineChangeState'
    }
    $baselineDefinition = Get-PropertyValue $Calendar 'baselineCalendar' $null
    $baselineSource = [string](Get-PropertyValue $baselineDefinition 'sourcePath' '')
    if (-not [string]::IsNullOrWhiteSpace($baselineSource)) {
        [void](Resolve-RepositoryPath $Root $baselineSource $Diagnostics 'baselineCalendar.sourcePath' $true)
    }
}

function Get-ValidationResult {
    param([System.Collections.Generic.List[object]]$Diagnostics)
    if (@($Diagnostics | Where-Object severity -eq 'ERROR').Count -gt 0) { return 'FAIL' }
    if (@($Diagnostics | Where-Object severity -eq 'WARNING').Count -gt 0) { return 'PASS_WITH_WARNINGS' }
    return 'PASS'
}

function Get-WorkingDaysBetween {
    param([datetime]$From, [datetime]$To)
    $count = 0
    $cursor = $From.Date.AddDays(1)
    while ($cursor -le $To.Date) {
        if ($cursor.DayOfWeek -notin @([DayOfWeek]::Saturday, [DayOfWeek]::Sunday)) { $count++ }
        $cursor = $cursor.AddDays(1)
    }
    return $count
}

function Test-ExecutionRegister {
    param(
        [object]$Register,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath,
        [string]$Root,
        [bool]$Production = $false,
        [bool]$ValidateEvidencePaths = $false
    )

    Test-ContractVersion $Register $Diagnostics $SourcePath $Production

    foreach ($required in @('registerId', 'registerRevision', 'status', 'projectId', 'baselineId', 'statusDate', 'timeZone', 'defaults', 'records', 'changeHistory')) {
        if (-not (Has-Property $Register $required)) {
            Add-Diagnostic $Diagnostics 'PMC-MANIFEST-001' 'ERROR' "Execution Register is missing '$required'." 'Add the required field according to the register schema.' $SourcePath $required
        }
    }
    if (-not (Has-Property $Register 'records')) { return }

    $ids = @{}
    $orders = @{}
    $statusDateValue = Get-PropertyValue $Register 'statusDate' $null
    $statusDate = $null
    if ($null -ne $statusDateValue) {
        try { $statusDate = [datetime]::Parse([string]$statusDateValue) } catch {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Invalid statusDate '$statusDateValue'." 'Use ISO 8601 date YYYY-MM-DD.' $SourcePath 'statusDate'
        }
    }

    foreach ($record in @($Register.records)) {
        $entity = Get-PropertyValue $record 'entity' $null
        $kind = [string](Get-PropertyValue $entity 'kind' '')
        $id = [string](Get-PropertyValue $entity 'id' '')
        if ($kind -ne 'DeliveryCard' -or [string]::IsNullOrWhiteSpace($id)) {
            Add-Diagnostic $Diagnostics 'PMC-IDENTITY-001' 'ERROR' 'Every execution record requires entity kind DeliveryCard and a stable id.' 'Correct entity.kind and entity.id.' $SourcePath 'entity' $kind $id
            continue
        }
        $identity = "$kind`:$id"
        if ($ids.ContainsKey($identity)) {
            Add-Diagnostic $Diagnostics 'PMC-IDENTITY-001' 'ERROR' "Duplicate identity $identity." 'Keep one record for each kind + id.' $SourcePath 'entity' $kind $id
        } else {
            $ids[$identity] = $true
        }

        $order = Get-PropertyValue $record 'forecastPlannedOrder' $null
        if ($null -eq $order -or [int]$order -lt 1) {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Delivery Card $id has invalid forecastPlannedOrder." 'Use a positive deterministic order.' $SourcePath 'forecastPlannedOrder' $kind $id
        } elseif ($orders.ContainsKey([string]$order)) {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "forecastPlannedOrder $order is duplicated." 'Assign a unique order within the register.' $SourcePath 'forecastPlannedOrder' $kind $id
        } else {
            $orders[[string]$order] = $id
        }

        $recordingState = [string](Get-PropertyValue $record 'recordingState' '')
        $executionState = Get-PropertyValue $record 'executionState' $null
        $resultState = Get-PropertyValue $record 'resultState' $null
        $priority = [string](Get-PropertyValue $record 'priority' '')

        if ($recordingState -notin @('NOT_RECORDED', 'RECORDED')) {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Invalid recordingState '$recordingState'." 'Use NOT_RECORDED or RECORDED.' $SourcePath 'recordingState' $kind $id
        }
        if ($priority -notin $AllowedPriorities) {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Invalid priority '$priority'." 'Use URGENT, HIGH, NORMAL or LOW.' $SourcePath 'priority' $kind $id
        }
        if ($recordingState -eq 'RECORDED') {
            if ([string]$executionState -notin $AllowedExecutionStates) {
                Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' 'A RECORDED item requires a valid executionState.' 'Record one controlled execution state.' $SourcePath 'executionState' $kind $id
            }
            if ([string]$resultState -notin $AllowedResultStates) {
                Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' 'A RECORDED item requires a valid resultState.' 'Record one controlled result state.' $SourcePath 'resultState' $kind $id
            }
            if ([string]::IsNullOrWhiteSpace([string](Get-PropertyValue $record 'recordedBy' ''))) {
                Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' 'A RECORDED item requires recordedBy.' 'Record the accountable human role/person.' $SourcePath 'recordedBy' $kind $id
            }
        } elseif ($null -ne $executionState -or $null -ne $resultState) {
            Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' 'NOT_RECORDED must not contain inferred execution/result state.' 'Remove inferred state or supply attributable evidence and mark RECORDED.' $SourcePath 'recordingState' $kind $id
        }

        foreach ($field in @('actualEffortHours', 'remainingEffortHours', 'reserveUsedHours')) {
            $value = Get-PropertyValue $record $field $null
            if ($null -ne $value -and ((-not ($value -is [ValueType])) -or [double]$value -lt 0 -or (([double]$value * 2) % 1 -ne 0))) {
                Add-Diagnostic $Diagnostics 'PMC-EFFORT-001' 'ERROR' "$field for $id must be a non-negative 0.5-hour increment." 'Correct the value and retain correction history.' $SourcePath $field $kind $id
            }
        }

        if ([string]$executionState -eq 'COMPLETED') {
            $actualFinish = Get-PropertyValue $record 'actualFinish' $null
            $remaining = Get-PropertyValue $record 'remainingEffortHours' $null
            $actual = Get-PropertyValue $record 'actualEffortHours' $null
            $evidence = @(Get-PropertyValue $record 'evidence' @())
            if ($null -eq $actualFinish -or $null -eq $actual -or $null -eq $remaining -or [double]$remaining -ne 0 -or $evidence.Count -eq 0) {
                Add-Diagnostic $Diagnostics 'PMC-COMPLETE-001' 'ERROR' "Completed Delivery Card $id lacks finish, actual effort, zero remaining effort or evidence." 'Supply completion facts/evidence or revert the execution state.' $SourcePath 'executionState' $kind $id
            }
        }

        if ($ValidateEvidencePaths) {
            foreach ($evidenceItem in @(Get-PropertyValue $record 'evidence' @())) {
                $repoPath = [string](Get-PropertyValue $evidenceItem 'repoPath' '')
                if (-not [string]::IsNullOrWhiteSpace($repoPath)) {
                    $resolved = Resolve-RepositoryPath $Root $repoPath $Diagnostics 'evidence.repoPath' $true
                    if ($null -eq $resolved) {
                        Add-Diagnostic $Diagnostics 'PMC-EVIDENCE-001' 'ERROR' "Evidence path for $id is not controlled." 'Use an existing repository-relative evidence path.' $repoPath 'evidence.repoPath' $kind $id
                    }
                }
            }
        }

        if ($null -ne $statusDate -and [string]$executionState -eq 'IN_PROGRESS') {
            $lastUpdatedValue = Get-PropertyValue $record 'lastUpdatedAt' $null
            if ($null -ne $lastUpdatedValue) {
                try {
                    $lastUpdated = [datetime]::Parse([string]$lastUpdatedValue)
                    if ((Get-WorkingDaysBetween $lastUpdated $statusDate) -gt 2) {
                        Add-Diagnostic $Diagnostics 'EXEC-STALE-001' 'WARNING' "Delivery Card $id has not been updated for more than two working days." 'Record actual, remaining or an attributable no-change review.' $SourcePath 'lastUpdatedAt' $kind $id
                    }
                } catch {
                    Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Invalid lastUpdatedAt for $id." 'Use an ISO 8601 timestamp.' $SourcePath 'lastUpdatedAt' $kind $id
                }
            }

            $remainingReviewedValue = Get-PropertyValue $record 'remainingReviewedAt' $null
            if ($null -ne $remainingReviewedValue) {
                try {
                    $remainingReviewed = [datetime]::Parse([string]$remainingReviewedValue)
                    if (($statusDate.Date - $remainingReviewed.Date).TotalDays -gt 7) {
                        Add-Diagnostic $Diagnostics 'EXEC-REMAINING-001' 'WARNING' "Remaining effort for $id has not been reviewed within seven days." 'Review and record the current remaining effort.' $SourcePath 'remainingReviewedAt' $kind $id
                    }
                } catch {
                    Add-Diagnostic $Diagnostics 'PMC-STATE-001' 'ERROR' "Invalid remainingReviewedAt for $id." 'Use an ISO 8601 timestamp.' $SourcePath 'remainingReviewedAt' $kind $id
                }
            }
        }
    }
}

function Get-DeliveryCardRows {
    param([string]$Path)
    $rows = @()
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        if ($line -match '^\| `(?<id>[A-Z][A-Z0-9-]+)` \| `\[(?<phase>PH\d)\]\[[^\]]+\] (?<title>[^`]+)` \| (?<hours>\d+) \| (?<time>[^|]+) \| (?<deps>[^|]+) \|') {
            $rows += [pscustomobject]@{ id = $Matches.id; phase = $Matches.phase; hours = [int]$Matches.hours; dependencies = $Matches.deps.Trim() }
        }
    }
    return $rows
}

function Get-MilestoneRows {
    param([string]$Path)
    $rows = @()
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        if ($line -match '^\| `(?<id>G-[A-Z0-9]+)` \| `[^`]+` \| [^|]+ \| (?<deps>[^|]+) \|') {
            $rows += [pscustomobject]@{ id = $Matches.id; dependencies = $Matches.deps.Trim() }
        }
    }
    return $rows
}

function Get-WorkPackageRows {
    param([string]$Path)
    $rows = @{}
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        if ($line -match '^\| (?<id>[PFCWLQ]\d{2}) \| [^|]+ \| (?<hours>\d+) \|') {
            if (-not $rows.ContainsKey($Matches.id)) { $rows[$Matches.id] = [int]$Matches.hours }
        }
    }
    return $rows
}

function Test-DependencyGraph {
    param(
        [object[]]$Cards,
        [object[]]$Milestones,
        [System.Collections.Generic.List[object]]$Diagnostics,
        [string]$SourcePath
    )

    $nodes = @{}
    foreach ($row in @($Cards) + @($Milestones)) { $nodes[$row.id] = @() }
    foreach ($row in @($Cards) + @($Milestones)) {
        if ($row.dependencies -eq '—' -or [string]::IsNullOrWhiteSpace($row.dependencies)) { continue }
        foreach ($dependency in @($row.dependencies -split ',' | ForEach-Object { $_.Trim() })) {
            if (-not $nodes.ContainsKey($dependency)) {
                Add-Diagnostic $Diagnostics 'PMC-DEPENDENCY-001' 'ERROR' "Dependency '$dependency' referenced by '$($row.id)' does not exist." 'Correct the predecessor reference.' $SourcePath 'dependencies' 'PlanningEntity' $row.id
            } else {
                $nodes[$row.id] += $dependency
            }
        }
    }

    $visiting = @{}
    $visited = @{}
    function Visit-Node([string]$node) {
        if ($visiting.ContainsKey($node)) { return $true }
        if ($visited.ContainsKey($node)) { return $false }
        $visiting[$node] = $true
        foreach ($dependency in $nodes[$node]) {
            if (Visit-Node $dependency) { return $true }
        }
        $visiting.Remove($node)
        $visited[$node] = $true
        return $false
    }
    foreach ($node in @($nodes.Keys)) {
        if (Visit-Node $node) {
            Add-Diagnostic $Diagnostics 'PMC-DEPENDENCY-002' 'ERROR' "Dependency graph contains a cycle involving '$node'." 'Remove the circular dependency through planning review.' $SourcePath 'dependencies' 'PlanningEntity' $node
            break
        }
    }
}

function Test-Fixtures {
    param(
        [object]$Catalog,
        [string]$Root,
        [string]$SchemaPath,
        [System.Collections.Generic.List[object]]$Diagnostics
    )

    foreach ($fixture in @($Catalog.fixtures)) {
        $fixturePath = Resolve-RepositoryPath $Root ([string]$fixture.path) $Diagnostics 'fixture.path' $true
        if ($null -eq $fixturePath) { continue }
        $fixtureDiagnostics = New-DiagnosticList
        $register = Read-JsonFile $fixturePath
        Test-JsonAgainstSchema $fixturePath $SchemaPath $fixtureDiagnostics ([string]$fixture.path)
        Test-ExecutionRegister $register $fixtureDiagnostics ([string]$fixture.path) $Root $false $false
        $actualResult = Get-ValidationResult $fixtureDiagnostics
        $actualCodes = @($fixtureDiagnostics | ForEach-Object code | Sort-Object -Unique)
        $expectedCodes = @($fixture.expectedDiagnostics | ForEach-Object { [string]$_ } | Sort-Object -Unique)
        $codesMatch = ($actualCodes.Count -eq $expectedCodes.Count) -and (-not (Compare-Object $actualCodes $expectedCodes))
        if ($actualResult -ne [string]$fixture.expectedResult -or -not $codesMatch) {
            Add-Diagnostic $Diagnostics 'PMC-FIXTURE-001' 'ERROR' "Fixture $($fixture.fixtureId) expected $($fixture.expectedResult) [$($expectedCodes -join ', ')] but produced $actualResult [$($actualCodes -join ', ')]." 'Reconcile the validator, contract or fixture oracle.' ([string]$fixture.path) 'expectedResult' 'Fixture' ([string]$fixture.fixtureId)
        }
    }
}

try {
    $RepositoryRoot = [System.IO.Path]::GetFullPath($RepositoryRoot)
    if (-not (Test-Path -LiteralPath $RepositoryRoot -PathType Container)) {
        throw "Repository root does not exist: $RepositoryRoot"
    }

    $diagnostics = New-DiagnosticList
    $manifestFullPath = Resolve-RepositoryPath $RepositoryRoot $ManifestPath $diagnostics 'manifestPath' $true
    if ($null -eq $manifestFullPath) { throw 'Manifest cannot be read.' }
    $manifest = Read-JsonFile $manifestFullPath
    Test-ContractVersion $manifest $diagnostics $ManifestPath $true

    foreach ($required in @('manifestId', 'projectId', 'snapshotPolicy', 'activeBaseline', 'execution', 'calendarPath', 'diagnosticCataloguePath', 'sourceContractPath', 'fixtureCataloguePath', 'sources', 'expectedSourceTotals', 'sourceReadiness')) {
        if (-not (Has-Property $manifest $required)) {
            Add-Diagnostic $diagnostics 'PMC-MANIFEST-001' 'ERROR' "Manifest is missing '$required'." 'Add the required manifest field.' $ManifestPath $required
        }
    }
    if ([string](Get-PropertyValue $manifest 'status' '') -notin @('DRAFT_PREVIEW', 'CURRENT', 'SUPERSEDED')) {
        Add-Diagnostic $diagnostics 'PMC-MANIFEST-001' 'ERROR' 'Manifest status is missing or unsupported.' 'Use DRAFT_PREVIEW, CURRENT or SUPERSEDED.' $ManifestPath 'status'
    }
    $snapshotPolicy = Get-PropertyValue $manifest 'snapshotPolicy' $null
    $sourceReadiness = Get-PropertyValue $manifest 'sourceReadiness' $null
    if ([string](Get-PropertyValue $snapshotPolicy 'commitResolution' '') -ne 'IMPORT_CONTEXT' -or
        [string](Get-PropertyValue $sourceReadiness 'commitBinding' '') -ne 'IMPORT_CONTEXT') {
        Add-Diagnostic $diagnostics 'PMC-SNAPSHOT-002' 'ERROR' 'The source commit must be bound by import context rather than a self-referential in-tree hash.' 'Set snapshotPolicy.commitResolution and sourceReadiness.commitBinding to IMPORT_CONTEXT.' $ManifestPath 'snapshotPolicy'
    }

    $sourceRoles = @($manifest.sources | ForEach-Object { [string]$_.role })
    foreach ($role in $RequiredSourceRoles) {
        $matches = @($sourceRoles | Where-Object { $_ -eq $role }).Count
        if ($matches -ne 1) {
            Add-Diagnostic $diagnostics 'PMC-MANIFEST-001' 'ERROR' "Manifest requires exactly one $role source; found $matches." 'Declare exactly one source for this authority role.' $ManifestPath 'sources'
        }
    }

    $declaredPaths = @(
        [string]$manifest.activeBaseline.referencePath,
        [string]$manifest.execution.registerPath,
        [string]$manifest.execution.schemaPath,
        [string]$manifest.calendarPath,
        [string]$manifest.diagnosticCataloguePath,
        [string]$manifest.sourceContractPath,
        [string]$manifest.fixtureCataloguePath
    ) + @($manifest.sources | ForEach-Object { [string]$_.path })
    foreach ($path in $declaredPaths | Sort-Object -Unique) {
        [void](Resolve-RepositoryPath $RepositoryRoot $path $diagnostics 'manifest.path' $true)
    }

    $registerPath = Resolve-RepositoryPath $RepositoryRoot ([string]$manifest.execution.registerPath) $diagnostics 'execution.registerPath' $true
    $schemaPath = Resolve-RepositoryPath $RepositoryRoot ([string]$manifest.execution.schemaPath) $diagnostics 'execution.schemaPath' $true
    $baselineReferencePath = Resolve-RepositoryPath $RepositoryRoot ([string]$manifest.activeBaseline.referencePath) $diagnostics 'activeBaseline.referencePath' $true
    $calendarPath = Resolve-RepositoryPath $RepositoryRoot ([string]$manifest.calendarPath) $diagnostics 'calendarPath' $true
    $kanbanEntry = @($manifest.sources | Where-Object role -eq 'DELIVERY_CARD_AUTHORITY')[0]
    $appendixEntry = @($manifest.sources | Where-Object role -eq 'WORK_PACKAGE_AUTHORITY')[0]
    $kanbanPath = Resolve-RepositoryPath $RepositoryRoot ([string]$kanbanEntry.path) $diagnostics 'sources.DELIVERY_CARD_AUTHORITY' $true
    $appendixPath = Resolve-RepositoryPath $RepositoryRoot ([string]$appendixEntry.path) $diagnostics 'sources.WORK_PACKAGE_AUTHORITY' $true

    if ($null -ne $schemaPath) {
        $schema = Read-JsonFile $schemaPath
        if ([string](Get-PropertyValue $schema '$schema' '') -ne 'https://json-schema.org/draft/2020-12/schema') {
            Add-Diagnostic $diagnostics 'PMC-CONTRACT-001' 'ERROR' 'Execution schema does not declare JSON Schema Draft 2020-12.' 'Pin the selected dialect in $schema.' ([string]$manifest.execution.schemaPath) '$schema'
        }
        if ([string]::IsNullOrWhiteSpace([string](Get-PropertyValue $schema '$id' ''))) {
            Add-Diagnostic $diagnostics 'PMC-CONTRACT-001' 'ERROR' 'Execution schema is missing its canonical $id.' 'Add a stable schema-resource identity.' ([string]$manifest.execution.schemaPath) '$id'
        }
    }

    if ($null -ne $registerPath) {
        $register = Read-JsonFile $registerPath
        if ($null -ne $schemaPath) {
            Test-JsonAgainstSchema $registerPath $schemaPath $diagnostics ([string]$manifest.execution.registerPath)
        }
        Test-ExecutionRegister $register $diagnostics ([string]$manifest.execution.registerPath) $RepositoryRoot $true $true
        if ([int]$register.registerRevision -ne [int]$manifest.execution.expectedRegisterRevision) {
            Add-Diagnostic $diagnostics 'PMC-SNAPSHOT-002' 'ERROR' "Manifest expects register revision $($manifest.execution.expectedRegisterRevision), found $($register.registerRevision)." 'Update manifest and register atomically.' ([string]$manifest.execution.registerPath) 'registerRevision'
        }
        if ([string]$register.baselineId -ne [string]$manifest.activeBaseline.baselineId) {
            Add-Diagnostic $diagnostics 'PMC-SNAPSHOT-002' 'ERROR' 'Manifest and Execution Register use different Baseline IDs.' 'Update the candidate snapshot atomically.' ([string]$manifest.execution.registerPath) 'baselineId'
        }
    }

    if ($null -ne $baselineReferencePath) {
        $baselineReference = Read-JsonFile $baselineReferencePath
        Test-BaselineReference $baselineReference $manifest $diagnostics ([string]$manifest.activeBaseline.referencePath)
    }

    if ($null -ne $calendarPath) {
        $calendar = Read-JsonFile $calendarPath
        Test-ProjectCalendar $calendar $diagnostics ([string]$manifest.calendarPath) $RepositoryRoot
        if ([string]$calendar.baselineChangeState -eq 'REBASELINE_REQUIRED') {
            Add-Diagnostic $diagnostics 'PMC-CALENDAR-001' 'WARNING' 'Forecast calendar includes recurring Saturdays that are absent from the approved DOC-07 Baseline calendar.' 'Use the forecast calendar without rewriting Baseline; rebaseline only after an attributable decision.' ([string]$manifest.calendarPath) 'baselineChangeState'
        }
    }

    if ($null -ne $kanbanPath -and $null -ne $appendixPath) {
        $cards = @(Get-DeliveryCardRows $kanbanPath)
        $milestones = @(Get-MilestoneRows $kanbanPath)
        $workPackages = Get-WorkPackageRows $appendixPath
        $expected = $manifest.expectedSourceTotals
        $cardHours = ($cards | Measure-Object hours -Sum).Sum
        $workPackageHours = ($workPackages.Values | Measure-Object -Sum).Sum

        $sourceMismatches = @()
        if ($cards.Count -ne [int]$expected.deliveryCards) { $sourceMismatches += "Delivery Cards $($cards.Count)/$($expected.deliveryCards)" }
        if ($milestones.Count -ne [int]$expected.gatesAndMilestones) { $sourceMismatches += "gates/milestones $($milestones.Count)/$($expected.gatesAndMilestones)" }
        if ($workPackages.Count -ne [int]$expected.workPackages) { $sourceMismatches += "Work Packages $($workPackages.Count)/$($expected.workPackages)" }
        if ([int]$cardHours -ne [int]$expected.plannedWorkHours) { $sourceMismatches += "card hours $cardHours/$($expected.plannedWorkHours)" }
        if ([int]$workPackageHours -ne [int]$expected.plannedWorkHours) { $sourceMismatches += "package hours $workPackageHours/$($expected.plannedWorkHours)" }
        if ($sourceMismatches.Count -gt 0) {
            Add-Diagnostic $diagnostics 'PMC-SOURCE-001' 'ERROR' "Source totals do not reconcile: $($sourceMismatches -join '; ')." 'Correct the owning planning source; do not patch the rendition alone.' ([string]$kanbanEntry.path) 'expectedSourceTotals'
        }

        if ($null -ne $registerPath) {
            $registerIds = @($register.records | ForEach-Object { [string]$_.entity.id })
            foreach ($card in $cards) {
                if ($registerIds -notcontains $card.id) {
                    Add-Diagnostic $diagnostics 'PMC-IDENTITY-002' 'ERROR' "Baseline Delivery Card $($card.id) is absent from the Execution Register." 'Add an explicit NOT_RECORDED record or controlled disposition.' ([string]$manifest.execution.registerPath) 'records' 'DeliveryCard' $card.id
                }
            }
            foreach ($registerId in $registerIds) {
                if (@($cards.id) -notcontains $registerId) {
                    Add-Diagnostic $diagnostics 'PMC-IDENTITY-003' 'ERROR' "Execution Register contains unknown Delivery Card $registerId." 'Add it through planning change control or remove the invalid record.' ([string]$manifest.execution.registerPath) 'records' 'DeliveryCard' $registerId
                }
            }
        }
        Test-DependencyGraph $cards $milestones $diagnostics ([string]$kanbanEntry.path)
    }

    $gitStatus = & git -C $RepositoryRoot status --porcelain --untracked-files=all 2>$null
    if ($LASTEXITCODE -ne 0) { throw 'Unable to query Git working-tree state.' }
    if (@($gitStatus).Count -gt 0) {
        Add-Diagnostic $diagnostics 'PMC-SNAPSHOT-001' 'WARNING' 'Validation is running against an uncommitted working-tree preview.' 'Commit the exact source package and re-run validation before official handoff.' $ManifestPath 'snapshotPolicy'
    }

    if ($RunFixtures) {
        $catalogPath = Resolve-RepositoryPath $RepositoryRoot ([string]$manifest.fixtureCataloguePath) $diagnostics 'fixtureCataloguePath' $true
        if ($null -ne $catalogPath -and $null -ne $schemaPath) {
            $catalog = Read-JsonFile $catalogPath
            Test-ContractVersion $catalog $diagnostics ([string]$manifest.fixtureCataloguePath) $true
            Test-Fixtures $catalog $RepositoryRoot $schemaPath $diagnostics
        }
    }

    if (@($gitStatus).Count -eq 0 -and [string]$manifest.status -eq 'CURRENT') {
        $candidateResult = Get-ValidationResult $diagnostics
        $declaredWarnings = @($manifest.sourceReadiness.openWarnings | ForEach-Object { [string]$_ } | Sort-Object -Unique)
        $actualWarnings = @($diagnostics | Where-Object severity -eq 'WARNING' | ForEach-Object code | Sort-Object -Unique)
        $warningsMatch = ($declaredWarnings.Count -eq $actualWarnings.Count) -and (-not (Compare-Object $declaredWarnings $actualWarnings))
        if ([string]$manifest.sourceReadiness.gateState -ne 'PASS' -or
            [string]$manifest.sourceReadiness.validationResult -ne $candidateResult -or
            [string]::IsNullOrWhiteSpace([string]$manifest.sourceReadiness.acceptedAt) -or
            [string]::IsNullOrWhiteSpace([string]$manifest.sourceReadiness.acceptedBy) -or
            -not $warningsMatch) {
            Add-Diagnostic $diagnostics 'PMC-SNAPSHOT-002' 'ERROR' 'CURRENT manifest Source Readiness does not match clean-tree validation or acceptance metadata.' 'Update gate state, validation result, accepted attribution and open warnings in one reviewed snapshot.' $ManifestPath 'sourceReadiness'
        }
    }

    $result = Get-ValidationResult $diagnostics
    $summary = [pscustomobject]@{
        contractVersion = [string]$manifest.contractVersion
        projectId = [string]$manifest.projectId
        validationResult = $result
        mode = if (@($gitStatus).Count -gt 0) { 'UNCOMMITTED_PREVIEW' } else { 'GIT_COMMIT' }
        diagnostics = @($diagnostics)
        counts = [pscustomobject]@{
            errors = @($diagnostics | Where-Object severity -eq 'ERROR').Count
            warnings = @($diagnostics | Where-Object severity -eq 'WARNING').Count
            information = @($diagnostics | Where-Object severity -eq 'INFO').Count
        }
    }
    $summary | ConvertTo-Json -Depth 10

    if ($script:UnsupportedProductionContract) { exit 3 }
    if ($result -eq 'FAIL') { exit 1 }
    exit 0
}
catch {
    $failure = [pscustomobject]@{
        validationResult = 'FAIL'
        mode = 'ENVIRONMENT_FAILURE'
        diagnostics = @([pscustomobject]@{
            code = 'PMC-ENVIRONMENT-001'
            severity = 'ERROR'
            entityKind = ''
            entityId = ''
            sourcePath = $ManifestPath
            field = ''
            message = $_.Exception.Message
            recommendedAction = 'Correct repository access, JSON syntax or command environment, then retry.'
        })
    }
    $failure | ConvertTo-Json -Depth 6
    exit 2
}
