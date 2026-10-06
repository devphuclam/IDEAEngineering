# First-party in-memory HTTP source research; no third-party files retained.
$ErrorActionPreference='Stop'
$commit='bec650f15b457f3bffb6d79b65bf74bfcbaecdce'
$base="https://raw.githubusercontent.com/oxc-project/oxc/$commit/"
$license=(Invoke-WebRequest ($base+'LICENSE') -TimeoutSec 25).Content
$licenseHash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($license))).ToLowerInvariant()
if($license -notmatch 'Permission is hereby granted, free of charge' -or $license -notmatch 'sell\s+copies' -or $license -notmatch 'permission notice'){throw 'Unexpected source grant'}
$tree=(Invoke-WebRequest "https://api.github.com/repos/oxc-project/oxc/git/trees/$commit`?recursive=1" -TimeoutSec 25).Content|ConvertFrom-Json
$paths=@($tree.tree.path|Where-Object{$_ -match '^(crates|napi)/[^/]+/Cargo.toml$'})
$rows=@($paths|ForEach-Object -Parallel {
 $path=$_; $base=$using:base
 try{
  $text=(Invoke-WebRequest ($base+$path) -TimeoutSec 25).Content
  $name=[regex]::Match($text,'(?m)^name\s*=\s*"([^"]+)"').Groups[1].Value
  $version=[regex]::Match($text,'(?m)^version\s*=\s*"([^"]+)"').Groups[1].Value
  if($version -eq '0.151.0'){
   [pscustomobject]@{name=$name;version=$version;manifest=$base+$path;manifestSha256=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($text))).ToLowerInvariant();licenseInherited=($text -match '(?m)^license\.workspace\s*=\s*true')}
  }
 }catch{[pscustomobject]@{path=$path;error=$_.Exception.Message}}
} -ThrottleLimit 4)
[pscustomobject]@{commit=$commit;licenseUrl=$base+'LICENSE';licenseSha256=$licenseHash;legalPaths=@($tree.tree.path|Where-Object{$_ -match '(?i)(license|notice|copying)'});rows=$rows}|ConvertTo-Json -Depth 5 -Compress
