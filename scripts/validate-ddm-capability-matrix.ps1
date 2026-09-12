[CmdletBinding()]
param(
    [string]$Path = (Join-Path $PSScriptRoot '..\docs\product\knowledge\2026-09-12-ddm-capability-inventory-and-idea-gap-matrix.md')
)

$ErrorActionPreference = 'Stop'

function Fail([string]$Message) {
    throw "FAIL: $Message"
}

function Cells([string]$Line) {
    return @($Line.Trim('|').Split('|') | ForEach-Object { $_.Trim() })
}

if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    Fail "matrix not found: $Path"
}

$lines = @(Get-Content -LiteralPath $Path)
$headerIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -eq '| Capability ID | Category | DDM Capability | Observable User Behavior | DDM Evidence | Evidence Authority | Evidence Mode | Temporal Applicability | DDM Context / Version | IDEA FTR Mapping | IDEA REQ Mapping | IDEA Other Source | IDEA Coverage | IDEA Product Disposition | Gap Criticality | Product Priority | Gate Effect | Gap Description | Recommendation | Required Next Artifact |') {
        $headerIndex = $i
        break
    }
}
if ($headerIndex -lt 0) { Fail 'canonical matrix header not found' }

$summaryIndex = -1
$sourceCatalogueIndex = -1
$sourceCatalogueEnd = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -eq '## 7. Category summary') { $summaryIndex = $i }
    if ($lines[$i] -eq '## 4. Source catalogue') { $sourceCatalogueIndex = $i }
}
if ($sourceCatalogueIndex -ge 0) {
    for ($i = $sourceCatalogueIndex + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -eq '## 5. DDM-native taxonomy') {
            $sourceCatalogueEnd = $i
            break
        }
    }
}
if ($summaryIndex -lt 0) { Fail 'category summary section not found' }
if ($sourceCatalogueIndex -lt 0 -or $sourceCatalogueEnd -lt 0) { Fail 'source catalogue bounds not found' }

$sourceIds = @{}
foreach ($line in $lines[$sourceCatalogueIndex..($sourceCatalogueEnd - 1)]) {
    if ($line -match '^\| `(DDM-SRC-\d{3})` \|') { $sourceIds[$Matches[1]] = $true }
}
if ($sourceIds.Count -eq 0) { Fail 'no DDM-SRC source IDs found' }

$rowLines = @($lines[($headerIndex + 2)..($summaryIndex - 1)] | Where-Object { $_ -match '^\| `DDM-CAP-[A-Z]+-\d{3}` \|' })
if ($rowLines.Count -ne 100) { Fail "expected 100 matrix rows, found $($rowLines.Count)" }

$allowedAuthority = @('PUBLISHER-PRIMARY', 'AUTHORIZED-PARTNER', 'OFFICIAL-DEMONSTRATION', 'SECONDARY', 'UNKNOWN')
$allowedMode = @('DOCUMENTED', 'OBSERVED', 'INFERRED', 'UNKNOWN')
$allowedTemporal = @('CURRENT-PUBLIC', 'HISTORICAL', 'RELEASE-SPECIFIC', 'TARGET-UNKNOWN')
$allowedCoverage = @('COVERED', 'PARTIAL', 'ABSENT', 'UNKNOWN')
$allowedDisposition = @('CORE-V0', 'POST-CORE', 'OUT-OF-SCOPE', 'NOT-APPLICABLE', 'RESEARCH-REQUIRED', 'UNDECIDED')
$allowedCriticality = @('CRITICAL', 'MAJOR', 'MINOR', 'N/A')
$allowedPriority = @('P0', 'P1', 'P2', 'P3', 'UNDECIDED')
$allowedGate = @('PG4-BLOCKING', 'PG4-NONBLOCKING', 'LATER-VERIFICATION', 'ROLLOUT-BLOCKING', 'NONE', 'UNASSESSED')
$categories = @{}
$ids = @{}
$counts = @{}
$ftrs = @{}
$summaryRows = @()

function CountValue([string]$Name, [string]$Value) {
    $key = "$Name=$Value"
    if (-not $script:counts.ContainsKey($key)) { $script:counts[$key] = 0 }
    $script:counts[$key]++
}

for ($i = 0; $i -lt $rowLines.Count; $i++) {
    $row = Cells $rowLines[$i]
    if ($row.Count -ne 20) { Fail "row $($i + 1) has $($row.Count) columns, expected 20" }
    $id = $row[0].Trim('`')
    if ($id -notmatch '^DDM-CAP-[A-Z]+-\d{3}$') { Fail "invalid capability ID: $id" }
    if ($ids.ContainsKey($id)) { Fail "duplicate capability ID: $id" }
    $ids[$id] = $true

    $category = $row[1]
    if ($category -notmatch '^[A-S] ') { Fail "invalid category '$category' at $id" }
    $categories[$category] = $true
    foreach ($source in [regex]::Matches($row[4], 'DDM-SRC-\d{3}')) {
        if (-not $sourceIds.ContainsKey($source.Value)) { Fail "$id references unknown source $($source.Value)" }
    }
    if ($row[5] -notin $allowedAuthority) { Fail "$id has invalid Evidence Authority '$($row[5])'" }
    if ($row[6] -notin $allowedMode) { Fail "$id has invalid Evidence Mode '$($row[6])'" }
    if ($row[7] -notin $allowedTemporal) { Fail "$id has invalid Temporal Applicability '$($row[7])'" }
    if ($row[12] -notin $allowedCoverage) { Fail "$id has invalid IDEA Coverage '$($row[12])'" }
    if ($row[13] -notin $allowedDisposition) { Fail "$id has invalid Product Disposition '$($row[13])'" }
    if ($row[14] -notin $allowedCriticality) { Fail "$id has invalid Gap Criticality '$($row[14])'" }
    if ($row[15] -notin $allowedPriority) { Fail "$id has invalid Product Priority '$($row[15])'" }
    if ($row[16] -notin $allowedGate) { Fail "$id has invalid Gate Effect '$($row[16])'" }
    if ($row[12] -in @('PARTIAL', 'ABSENT')) {
        if ($row[14] -eq 'N/A' -and $row[13] -notin @('OUT-OF-SCOPE', 'NOT-APPLICABLE')) {
            Fail "$id has N/A criticality for $($row[12]) coverage without an excluded disposition"
        }
    } elseif ($row[14] -ne 'N/A') {
        Fail "$id must use N/A criticality when coverage is $($row[12])"
    }
    if (($row -join ' ') -match '\b(?:MISSING|DEFERRED)\b') {
        Fail "$id uses retired coverage terminology"
    }
    foreach ($ftr in [regex]::Matches($row[9], 'FTR-\d{3}')) {
        if ([int]$ftr.Value.Substring(4) -lt 1 -or [int]$ftr.Value.Substring(4) -gt 14) { Fail "$id has out-of-range $($ftr.Value)" }
        $ftrs[$ftr.Value] = $true
    }
    foreach ($req in [regex]::Matches($row[10], 'REQ-[A-Z0-9-]+')) {
        if ($req.Value -notmatch '^REQ-[A-Z0-9-]+$') { Fail "$id has malformed requirement mapping $($req.Value)" }
    }
    foreach ($nameValue in @(@('authority', $row[5]), @('mode', $row[6]), @('temporal', $row[7]), @('coverage', $row[12]), @('disposition', $row[13]), @('criticality', $row[14]), @('priority', $row[15]), @('gate', $row[16]))) {
        CountValue $nameValue[0] $nameValue[1]
    }
    CountValue 'category' $category
}

foreach ($letter in 'A'..'S') {
    if (-not ($categories.Keys | Where-Object { $_ -like "$letter *" })) { Fail "category $letter is not represented" }
}
foreach ($ftrNumber in 1..14) {
    $ftr = 'FTR-{0:D3}' -f $ftrNumber
    if (-not $ftrs.ContainsKey($ftr)) { Fail "$ftr is missing from the matrix crosswalk" }
}

$summaryHeader = -1
for ($i = $summaryIndex + 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -eq '| Category | Total | Evidence sourced | COVERED | PARTIAL | ABSENT | UNKNOWN | CORE-V0 | POST-CORE | OUT-OF-SCOPE | NOT-APPLICABLE | RESEARCH-REQUIRED | UNDECIDED |') {
        $summaryHeader = $i
        break
    }
}
if ($summaryHeader -lt 0) { Fail 'category summary header not found' }
for ($i = $summaryHeader + 2; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\| (?:\*\*)?(?:[A-S] |Total)') {
        $summaryRows += ,(Cells $lines[$i])
    } elseif ($summaryRows.Count -gt 0) {
        break
    }
}
if ($summaryRows.Count -ne 20) { Fail "expected 19 category rows plus total, found $($summaryRows.Count)" }

foreach ($summary in $summaryRows) {
    if ($summary.Count -ne 13) { Fail "summary row has $($summary.Count) columns" }
    $label = $summary[0].Trim('*')
    $expected = if ($label -eq 'Total') { $rowLines.Count } else { $counts["category=$label"] }
    if ([int]$summary[1].Trim('*') -ne $expected) { Fail "summary total mismatch for $label" }
    $fields = @('coverage=COVERED', 'coverage=PARTIAL', 'coverage=ABSENT', 'coverage=UNKNOWN', 'disposition=CORE-V0', 'disposition=POST-CORE', 'disposition=OUT-OF-SCOPE', 'disposition=NOT-APPLICABLE', 'disposition=RESEARCH-REQUIRED', 'disposition=UNDECIDED')
    for ($j = 0; $j -lt $fields.Count; $j++) {
        $actual = [int]$summary[$j + 3].Trim('*')
        $name = $fields[$j].Split('=')[0]
        $value = $fields[$j].Split('=')[1]
        $expected = if ($label -eq 'Total') { $counts["$name=$value"] } else { 0 }
        if ($label -ne 'Total') {
            foreach ($line in $rowLines) {
                $row = Cells $line
                if ($row[1] -eq $label -and (($name -eq 'coverage' -and $row[12] -eq $value) -or ($name -eq 'disposition' -and $row[13] -eq $value))) { $expected++ }
            }
        }
        if ($actual -ne $expected) { Fail "summary $name/$value mismatch for $label (expected $expected, got $actual)" }
    }
}

Write-Output ("PASS: {0} unique DDM-CAP rows; {1} sources; {2} categories; FTR-001…014 present; enums and summary totals valid." -f $ids.Count, $sourceIds.Count, $categories.Count)
