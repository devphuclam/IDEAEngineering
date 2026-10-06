param(
    [Parameter(Mandatory)][string]$Artifact,
    [Parameter(Mandatory)][ValidateSet('Server','Gateway')][string]$Profile,
    [string]$BaselineArtifact
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$expected = [ordered]@{
    'snakeyaml-2.6-LICENSE.txt' = 'a6cba85bc92e0cff7a450b1d873c0eaa2e9fc96bf472df0247a26bec77bf3ff9'
    'jspecify-1.0.1-LICENSE.txt' = 'cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30'
    'jspecify-1.0.1-AUTHORS.txt' = 'e70db5d4e0bd433a8b9357518dd8f8847c434826d9587cfc35eca1e1d5a57d3f'
}
if ($Profile -eq 'Server') {
    $expected['HikariCP-7.0.2-LICENSE.txt'] = '73ba74dfaa520b49a401b5d21459a8523a146f3b7518a833eea5efa85130bf68'
    $expected['jmolecules-2.0.1-LICENSE.txt'] = 'c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4'
    $expected['archunit-1.4.2-LICENSE.txt'] = 'cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30'
    $expected['archunit-1.4.2-NOTICE.txt'] = '60a54e77051d8d8fc6099934b335751254ea19f0ee3069fc090a263884a17c6f'
    $expected['guava-33.5.0-LICENSE.txt'] = 'cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30'
    $expected['flyway-12.4.0-LICENSE.txt'] = '6707b7b3ba3220ab64a81a5ab869ffecc3a6a023e9488ea08b897471b069c078'
}
function Hash-Entry($entry) {
    $stream = $entry.Open()
    try { return [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($stream)).ToLowerInvariant() }
    finally { $stream.Dispose() }
}
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $Artifact).Path)
try {
    if (@($zip.Entries | Group-Object FullName | Where-Object Count -gt 1).Count) { throw 'DUPLICATE_ZIP_ENTRY' }
    foreach ($pair in $expected.GetEnumerator()) {
        $entry = $zip.GetEntry("BOOT-INF/classes/third-party/ph1-runtime/$($pair.Key)")
        if (-not $entry) { throw "SUPPLEMENTAL_NOTICE_MISSING=$($pair.Key)" }
        if ((Hash-Entry $entry) -cne $pair.Value) { throw "SUPPLEMENTAL_NOTICE_HASH_MISMATCH=$($pair.Key)" }
    }
    $provenance = $zip.GetEntry('BOOT-INF/classes/third-party/ph1-runtime/SOURCES-NOTICE.txt')
    if (-not $provenance) { throw 'SUPPLEMENTAL_PROVENANCE_MISSING' }
    $reader = [System.IO.StreamReader]::new($provenance.Open())
    try { $text = $reader.ReadToEnd() } finally { $reader.Dispose() }
    foreach ($marker in @('SnakeYAML 2.6','Google Inc., 2008','JSpecify 1.0.1','EPL-2.0','SOURCE AVAILABILITY','No IDEA application source')) {
        if (-not $text.Contains($marker, [StringComparison]::Ordinal)) { throw "SUPPLEMENTAL_PROVENANCE_INCOMPLETE=$marker" }
    }
    "SUPPLEMENTAL_NOTICES=PASS; profile=$Profile; exact_upstream_hashes=$($expected.Count)"
    if ($BaselineArtifact) {
        $old = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $BaselineArtifact).Path)
        try {
            foreach ($entry in $old.Entries) {
                $new = $zip.GetEntry($entry.FullName)
                if (-not $new -or (Hash-Entry $new) -cne (Hash-Entry $entry)) { throw "ORIGINAL_ENTRY_CHANGED=$($entry.FullName)" }
            }
            $extras = @($zip.Entries | Where-Object { -not $old.GetEntry($_.FullName) })
            if (@($extras | Where-Object { -not $_.FullName.StartsWith('BOOT-INF/classes/third-party/ph1-runtime/', [StringComparison]::Ordinal) }).Count) {
                throw 'UNAUTHORIZED_PACKAGE_ADDITION'
            }
            if ($extras.Count -ne $expected.Count + 1) { throw 'SUPPLEMENTAL_ENTRY_SET_MISMATCH' }
            "ORIGINAL_CONTENT=PASS; entries=$($old.Entries.Count); supplemental_only=$($extras.Count)"
        } finally { $old.Dispose() }
    }
} finally { $zip.Dispose() }
