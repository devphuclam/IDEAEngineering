# Read-only cached-POM audit. Not a Maven resolver or execution approval.
# Outputs JSON for review; writes nothing to the repository, cache, or server.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$cache = '/home/phuclam/.m2/repository'
$remote = @'
set -eu
find /home/phuclam/.m2/repository -type f -name '*.pom' | sort | while IFS= read -r p; do
  printf '%s\t' "$p"
  base64 -w 0 "$p"
  printf '\n'
done
'@
$lines = & ssh -i C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519 -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=5 phuclam@192.168.137.33 $remote
if ($LASTEXITCODE -ne 0) { throw 'Read-only cached POM capture failed' }
$poms = @{}
foreach ($line in $lines) {
    $pair = $line -split "`t", 2
    if ($pair.Count -ne 2) { throw 'Malformed POM capture' }
    $bytes = [Convert]::FromBase64String($pair[1])
    $parts = $pair[0].Substring($cache.Length + 1).Split('/')
    $artifact = $parts[-3]; $version = $parts[-2]
    $group = ($parts[0..($parts.Count - 4)] -join '.')
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $hash = [BitConverter]::ToString($sha.ComputeHash($bytes)).Replace('-', '').ToLowerInvariant() } finally { $sha.Dispose() }
    $poms["${group}:${artifact}:${version}"] = @{ Path=$pair[0]; Hash=$hash; Xml=[xml][Text.Encoding]::UTF8.GetString($bytes) }
}
$models = @{}; $visiting = @{}; $modelTrace = [Collections.Generic.List[object]]::new()
$profileTrace = [Collections.Generic.List[object]]::new()
function Expand-Value([string]$value, [hashtable]$props) {
    for ($i=0; $i -lt 30 -and $value -match '\$\{'; $i++) {
        $old = $value
        $value = [regex]::Replace($value, '\$\{([^}]+)\}', { param($m) if ($props.ContainsKey($m.Groups[1].Value)) { [string]$props[$m.Groups[1].Value] } else { $m.Value } })
        if ($value -eq $old) { break }
    }
    return $value
}
function Child-Text($node, [string]$name) {
    $child = $node.SelectSingleNode("*[local-name()='$name']")
    if ($child) { return $child.InnerText } else { return '' }
}
function Parse-Dependency($node, [hashtable]$props) {
    $g = Expand-Value (Child-Text $node 'groupId') $props
    $a = Expand-Value (Child-Text $node 'artifactId') $props
    $v = Expand-Value (Child-Text $node 'version') $props
    $t = Expand-Value (Child-Text $node 'type') $props; if (!$t) { $t='jar' }
    $s = Expand-Value (Child-Text $node 'scope') $props
    $c = Expand-Value (Child-Text $node 'classifier') $props
    $ex = @($node.SelectNodes("*[local-name()='exclusions']/*[local-name()='exclusion']") | ForEach-Object { (Expand-Value (Child-Text $_ 'groupId') $props) + ':' + (Expand-Value (Child-Text $_ 'artifactId') $props) })
    return @{ G=$g; A=$a; V=$v; Type=$t; Scope=$s; Classifier=$c; Optional=((Child-Text $node 'optional') -eq 'true'); Ex=$ex; Key="${g}:${a}:${t}:${c}" }
}
function Get-Model([string]$coordinate) {
    if ($models.ContainsKey($coordinate)) { return $models[$coordinate] }
    if ($visiting[$coordinate]) { throw "Cyclic model $coordinate" }
    if (!$poms.ContainsKey($coordinate)) { throw "MISSING_CACHED_POM=$coordinate" }
    $visiting[$coordinate]=$true
    $node = $poms[$coordinate].Xml.DocumentElement
    $props=@{}; $dm=@{}; $rawDM=@{}; $rawDeps=@{}; $deps=@{}; $order=[Collections.Generic.List[string]]::new()
    $parent = $node.SelectSingleNode("*[local-name()='parent']")
    $parentId=''
    if ($parent) {
        $parentId=(Child-Text $parent 'groupId')+':'+(Child-Text $parent 'artifactId')+':'+(Child-Text $parent 'version')
        if ($parentId -match '\$\{') { throw "Unsupported variable parent $coordinate" }
        $pm=Get-Model $parentId
        foreach ($k in $pm.RawProps.Keys) { $props[$k]=$pm.RawProps[$k] }
        foreach ($k in $pm.DM.Keys) { $dm[$k]=$pm.DM[$k] }
        foreach ($k in $pm.RawDM.Keys) { $rawDM[$k]=$pm.RawDM[$k] }
        foreach ($k in $pm.Order) { $rawDeps[$k]=$pm.RawDeps[$k]; $order.Add($k) }
        $props['project.parent.groupId']=$pm.G; $props['project.parent.artifactId']=$pm.A; $props['project.parent.version']=$pm.V
    }
    $id=$coordinate.Split(':'); $g=$id[0]; $a=$id[1]; $v=$id[2]
    foreach ($prefix in @('project','pom')) { $props["$prefix.groupId"]=$g; $props["$prefix.artifactId"]=$a; $props["$prefix.version"]=$v }
    foreach ($p in $node.SelectNodes("*[local-name()='properties']/*")) { $props[$p.LocalName]=$p.InnerText }
    $rawProps=@{}; foreach ($k in $props.Keys) { $rawProps[$k]=$props[$k] }
    for ($i=0;$i -lt 10;$i++) { foreach ($k in @($props.Keys)) { $props[$k]=Expand-Value $props[$k] $props } }
    # Parent property expressions are interpolated in the child effective model.
    foreach ($k in $rawDM.Keys) { $dm[$k]=Parse-Dependency $rawDM[$k] $props }
    foreach ($profile in $node.SelectNodes("*[local-name()='profiles']/*[local-name()='profile']")) {
        if ($profile.SelectNodes("*[local-name()='dependencies']/* | *[local-name()='dependencyManagement']/* | *[local-name()='properties']/*").Count -gt 0) {
            $profileTrace.Add(@{ Model=$coordinate; Id=(Child-Text $profile 'id'); Activation=($profile.SelectSingleNode("*[local-name()='activation']")).OuterXml; Properties=($profile.SelectSingleNode("*[local-name()='properties']")).OuterXml; Dependencies=($profile.SelectSingleNode("*[local-name()='dependencies']")).OuterXml; Management=($profile.SelectSingleNode("*[local-name()='dependencyManagement']")).OuterXml })
        }
    }
    $managedNodes=@($node.SelectNodes("*[local-name()='dependencyManagement']/*[local-name()='dependencies']/*[local-name()='dependency']"))
    $own=@{}; $imports=[Collections.Generic.List[string]]::new()
    foreach ($mn in $managedNodes) {
        $d=Parse-Dependency $mn $props
        if ($d.Scope -eq 'import' -and $d.Type -eq 'pom') { $imports.Add("$($d.G):$($d.A):$($d.V)") }
        else { $dm[$d.Key]=$d; $rawDM[$d.Key]=$mn; $own[$d.Key]=$true }
    }
    $imported=@{}
    foreach ($imp in $imports) {
        $im=Get-Model $imp
        foreach ($k in $im.DM.Keys) { if (!$own.ContainsKey($k) -and !$imported.ContainsKey($k)) { $dm[$k]=$im.DM[$k]; $imported[$k]=$true } }
    }
    foreach ($depNode in $node.SelectNodes("*[local-name()='dependencies']/*[local-name()='dependency']")) {
        $d=Parse-Dependency $depNode $props
        if (!$rawDeps.ContainsKey($d.Key)) { $order.Add($d.Key) }
        $rawDeps[$d.Key]=$depNode
    }
    foreach ($depKey in $order) {
        $depNode=$rawDeps[$depKey]
        $d=Parse-Dependency $depNode $props
        if ($dm.ContainsKey($d.Key)) {
            $md=$dm[$d.Key]
            if (!$d.V) { $d.V=$md.V }; if (!$d.Scope) { $d.Scope=$md.Scope }
            $d.Ex=@($d.Ex)+@($md.Ex)
        }
        if (!$d.Scope) { $d.Scope='compile' }
        $deps[$d.Key]=$d
    }
    $result=@{ G=$g; A=$a; V=$v; Props=$props; RawProps=$rawProps; DM=$dm; RawDM=$rawDM; Deps=$deps; RawDeps=$rawDeps; Order=$order }
    $models[$coordinate]=$result; $visiting.Remove($coordinate)
    $modelTrace.Add(@{ Coordinate=$coordinate; Parent=$parentId; Imports=@($imports); Path=$poms[$coordinate].Path; SHA256=$poms[$coordinate].Hash })
    return $result
}
function Resolve-Graph([string]$realm, [string[]]$roots, [hashtable]$rootDM, [string[]]$initialEx) {
    $q=[Collections.Generic.Queue[object]]::new(); $chosen=@{}; $rows=[Collections.Generic.List[object]]::new(); $omits=[Collections.Generic.List[object]]::new()
    foreach ($r in $roots) { $q.Enqueue(@{ Id=$r; Via='ROOT'; Ex=$initialEx; Depth=0; Scope='compile' }) }
    while ($q.Count -gt 0) {
        $item=$q.Dequeue(); $c=$item.Id; $parts=$c.Split(':'); $ga=$parts[0]+':'+$parts[1]
        if ($chosen.ContainsKey($ga)) { $omits.Add(@{ Realm=$realm; Coordinate=$c; Via=$item.Via; Reason=('nearest/first selected '+$chosen[$ga]) }); continue }
        $chosen[$ga]=$c
        $m=Get-Model $c
        $rows.Add(@{ Realm=$realm; Coordinate=$c; Via=$item.Via; Depth=$item.Depth; Scope=$item.Scope; PomPath=$poms[$c].Path; PomSHA256=$poms[$c].Hash })
        foreach ($key in $m.Order) {
            $d=@{}; foreach ($k in $m.Deps[$key].Keys) { $d[$k]=$m.Deps[$key][$k] }
            # Direct explicit declarations win over their own dependencyManagement.
            # Application rows are transitive to the synthetic project; plugin root rows are not.
            if (($realm -eq 'application' -or $item.Depth -gt 0) -and $rootDM.ContainsKey($key)) { $md=$rootDM[$key]; if ($md.V) { $d.V=$md.V }; if ($md.Scope) { $d.Scope=$md.Scope }; $d.Ex=@($d.Ex)+@($md.Ex) }
            $di="$($d.G):$($d.A):$($d.V)"; $dga="$($d.G):$($d.A)"
            $why=''
            foreach ($ex in $item.Ex) { if ($dga -like $ex) { $why='path exclusion'; break } }
            # Plugin root is an actual CollectRequest dependency; its direct optional
            # children are level-one dependencies, retained by OptionalDependencySelector.
            if ($d.Optional -and ($realm -eq 'application' -or $item.Depth -gt 0)) { $why='optional' }
            if ($d.Scope -notin @('compile','runtime')) { $why='scope '+$d.Scope }
            if ($why) { $omits.Add(@{ Realm=$realm; Coordinate=$di; Via=$c; Reason=$why }); continue }
            if ($d.Type -notin @('jar','bundle') -or $d.Classifier) { throw "Unsupported artifact kind $di $($d.Type) $($d.Classifier)" }
            if (!$d.V -or $d.V -match '\$\{') { throw "Unresolved version $di" }
            $scope=$d.Scope; if ($item.Scope -eq 'runtime') { $scope='runtime' }
            $q.Enqueue(@{ Id=$di; Via=$c; Ex=@($item.Ex)+@($d.Ex); Depth=($item.Depth+1); Scope=$scope })
        }
    }
    return @{ Realm=$realm; Rows=@($rows); Omitted=@($omits) }
}
$parent=Get-Model 'org.springframework.boot:spring-boot-starter-parent:4.1.1'
$graphs=[Collections.Generic.List[object]]::new()
$graphs.Add((Resolve-Graph 'application' @('org.springframework.boot:spring-boot-starter-webmvc:4.1.1','org.springframework.boot:spring-boot-starter-log4j2:4.1.1') $parent.DM @('org.springframework.boot:spring-boot-starter-logging')))
foreach ($plugin in @('org.apache.maven.plugins:maven-resources-plugin:3.5.0','org.apache.maven.plugins:maven-compiler-plugin:3.15.0','org.apache.maven.plugins:maven-jar-plugin:3.5.1','org.springframework.boot:spring-boot-maven-plugin:4.1.1')) {
    $pm=Get-Model $plugin
    $graphs.Add((Resolve-Graph $plugin @($plugin) $pm.DM @()))
}
@{ Graphs=@($graphs); Models=@($modelTrace); Profiles=@($profileTrace) } | ConvertTo-Json -Depth 15
