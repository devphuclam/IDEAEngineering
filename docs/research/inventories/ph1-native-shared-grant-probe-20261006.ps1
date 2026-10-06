# REFERENCE-ONLY: publisher lock, Git ref and legal HTTP responses stay in RAM.
# No registry, archive, install, cache, build or upstream material write.
$ErrorActionPreference='Stop'
$pairs=@(@('rolldown/rolldown','8df421985114ecfaf52cce038d4a5a6ea8c05408'),@('parcel-bundler/lightningcss','c6a0c3cebf3395635e61075d2c81a96a710d4910'))
$rows=@(foreach($pair in $pairs){
 $lock=(Invoke-WebRequest "https://raw.githubusercontent.com/$($pair[0])/$($pair[1])/Cargo.lock").Content
 foreach($m in [regex]::Matches($lock,'(?ms)^\[\[package\]\]\r?\n(.*?)(?=^\[\[package\]\]|\z)')){
  $b=$m.Groups[1].Value;$n=[regex]::Match($b,'name = "([^"]+)"').Groups[1].Value
  if($n -match '^(serde|syn$|proc-macro2$|quote$|rayon|windows|napi|anyhow$|thiserror|crossbeam)'){
   [pscustomobject]@{lock=$pair[0];name=$n;version=[regex]::Match($b,'version = "([^"]+)"').Groups[1].Value;checksum=[regex]::Match($b,'checksum = "([^"]+)"').Groups[1].Value}
  }
 }
})
$refs=@{}
foreach($repo in @('serde-rs/serde','serde-rs/json','serde-rs/bytes','dtolnay/syn','dtolnay/proc-macro2','dtolnay/quote','dtolnay/anyhow','dtolnay/thiserror','rayon-rs/rayon','crossbeam-rs/crossbeam','napi-rs/napi-rs','microsoft/windows-rs')){
 $map=@{};foreach($line in (git ls-remote --tags "https://github.com/$repo.git")){
  $parts=$line -split "`t"; $tag=$parts[1] -replace '^refs/tags/','';$map[$tag]=$parts[0]
 };$refs[$repo]=$map
}
$items=@($rows|Group-Object name,version|ForEach-Object {
 $p=$_.Group[0];$n=$p.name;$v=$p.version;$repo='';$tag='';$manifest='Cargo.toml';$legal=@('LICENSE-MIT','LICENSE-APACHE')
 switch -Regex ($n){
  '^serde(_core|_derive)?$' {$repo='serde-rs/serde';$tag="v$v";$manifest="$n/Cargo.toml";break}
  '^serde_json$' {$repo='serde-rs/json';$tag="v$v";break}
  '^serde_bytes$' {$repo='serde-rs/bytes';$tag="$v";break}
  '^(syn|proc-macro2|quote|anyhow)$' {$repo="dtolnay/$n";$tag="$v";break}
  '^thiserror' {$repo='dtolnay/thiserror';$tag="$v";if($n -eq 'thiserror-impl'){$manifest='impl/Cargo.toml'};break}
  '^rayon' {$repo='rayon-rs/rayon';$tag=if($n -eq 'rayon') {"v$v"}else{"rayon-core-v$v"};if($n -eq 'rayon-core'){$manifest='rayon-core/Cargo.toml'};break}
  '^crossbeam' {$repo='crossbeam-rs/crossbeam';$tag="$n-$v";$manifest="$n/Cargo.toml";break}
  '^napi' {$repo='napi-rs/napi-rs';$tag=if([version]($v -replace '\+.*','') -ge [version]'3.0.0' -or ($n -eq 'napi-build' -and $v -eq '2.5.0')){"$n-v$v"}else{"$n@$v"};$sub=switch($n){'napi'{'napi'} 'napi-build'{'build'} 'napi-derive'{'macro'} 'napi-derive-backend'{'backend'} 'napi-sys'{'sys'}};$manifest="crates/$sub/Cargo.toml";$legal=@('LICENSE');break}
  '^windows' {$repo='microsoft/windows-rs';$tag="$v";$legal=@('license-mit','license-apache');$sub=$n -replace '^windows-','';$manifest=if($n -eq 'windows'){'crates/libs/windows/Cargo.toml'}elseif($n -match '^windows_') {"crates/targets/$($n -replace '^windows_','')/Cargo.toml"}else{"crates/libs/$sub/Cargo.toml"};break}
 }
 $commit='';if($repo -and $refs[$repo].ContainsKey($tag)){$commit=$refs[$repo][$tag];if($refs[$repo].ContainsKey("$tag^{}")){$commit=$refs[$repo]["$tag^{}"]}}
 [pscustomobject]@{name=$n;version=$v;checksum=$p.checksum;locks=($_.Group.lock -join ';');repo=$repo;tag=$tag;commit=$commit;manifest=$manifest;legal=$legal}
})
$result=@($items|ForEach-Object -Parallel {
 $p=$_;$r=[ordered]@{name=$p.name;version=$p.version;checksum=$p.checksum;locks=$p.locks;repo=$p.repo;tag=$p.tag;commit=$p.commit;manifest_url='';manifest_hash='';version_verified=$false;legal=@();status='UNKNOWN';gap=''}
 if(-not $p.commit){$r.gap='No matching canonical release tag resolved; no grant substituted';[pscustomobject]$r;return}
 $base="https://raw.githubusercontent.com/$($p.repo)/$($p.commit)/"
 try{
  $r.manifest_url=$base+$p.manifest;$text=(Invoke-WebRequest $r.manifest_url -TimeoutSec 25).Content
  $r.manifest_hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($text))).ToLowerInvariant()
  $r.version_verified=$text -match ('(?m)^version\s*=\s*"'+[regex]::Escape($p.version)+'"')
  if(-not $r.version_verified){$r.gap='Exact crate manifest version not directly established'}
 }catch{$r.gap='Exact manifest fetch failed: '+$_.Exception.Message}
 foreach($file in $p.legal){try{
  $url=$base+$file;$text=(Invoke-WebRequest $url -TimeoutSec 25).Content
  $hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($text))).ToLowerInvariant()
  $grant=if($text -match 'Permission is hereby granted, free of charge' -and $text -match 'sell\s+copies'){'MIT'}elseif($text -match 'Grant of Copyright License' -and $text -match 'Grant of Patent License'){'Apache-2.0'}else{'UNRECOGNIZED'}
  $notices=([regex]::Matches($text,'(?im)^\s*copyright\s+(?:\(c\)|\d|\[).*$')|ForEach-Object{$_.Value.Trim()}) -join ' | '
  $r.legal+= [pscustomobject]@{url=$url;sha256=$hash;grant=$grant;copyright=$notices;bytes=[Text.Encoding]::UTF8.GetByteCount($text)}
 }catch{ $r.gap+='; Legal file unavailable: '+$file }}
 if($r.version_verified -and @($r.legal|Where-Object{$_.grant -ne 'UNRECOGNIZED'}).Count){$r.status='EXACT-SOURCE-GRANT-TEXT-OBSERVED'}
 [pscustomobject]$r
} -ThrottleLimit 6)
$result|Sort-Object name,version|ConvertTo-Json -Depth 5 -Compress
