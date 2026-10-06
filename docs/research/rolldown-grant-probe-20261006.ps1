# First-party, read-only reference research. HTTP source/legal responses remain in memory.
# Emits evidence summaries only; does not install, execute or retain any upstream material.
$ErrorActionPreference = 'Stop'
$commit = '8df421985114ecfaf52cce038d4a5a6ea8c05408'
$lockUrl = "https://raw.githubusercontent.com/rolldown/rolldown/$commit/Cargo.lock"
$lock = (Invoke-WebRequest $lockUrl -TimeoutSec 30).Content
$lockHash = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($lock))).ToLowerInvariant()
$packages = @([regex]::Matches($lock, '(?ms)^\[\[package\]\]\r?\n(.*?)(?=^\[\[package\]\]|\z)') | ForEach-Object {
    $block = $_.Groups[1].Value
    [pscustomobject]@{
        name = [regex]::Match($block, 'name = "([^"]+)"').Groups[1].Value
        version = [regex]::Match($block, 'version = "([^"]+)"').Groups[1].Value
        source = [regex]::Match($block, 'source = "([^"]+)"').Groups[1].Value
        checksum = [regex]::Match($block, 'checksum = "([^"]+)"').Groups[1].Value
        dependencies = @([regex]::Matches([regex]::Match($block, '(?s)dependencies = \[(.*?)\]').Groups[1].Value, '"([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
    }
})
$rateLimitState = [System.Collections.Concurrent.ConcurrentDictionary[string,bool]]::new()
$results = @($packages | ForEach-Object -Parallel {
    $p = $_
    $base = "https://docs.rs/crate/$($p.name)/$([uri]::EscapeDataString($p.version))/source/"
    $row = [ordered]@{name=$p.name;version=$p.version;source=$p.source;checksum=$p.checksum;status='UNKNOWN';grant='';evidence=@();detail='';directory=$base}
    if (-not $p.source) {
        $row.status = 'WORKSPACE-SOURCE'; $row.detail = 'Local package; exact repository grant is examined separately'; [pscustomobject]$row; return
    }
    $stopState = $using:rateLimitState
    if ($stopState.ContainsKey('stop')) { $row.detail='NOT-RUN: host rate-limit circuit breaker'; [pscustomobject]$row; return }
    try {
        $listing = (Invoke-WebRequest $base -TimeoutSec 25).Content
        $paths = @([regex]::Matches($listing, 'href="\./([^"/]+)"') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -match '^(LICENSE|LICENCE|COPYING|UNLICENSE|NOTICE|Copyright)' } | Select-Object -Unique)
        if (-not $paths) { $row.detail='No root legal file found in exact source listing'; [pscustomobject]$row; return }
        foreach ($path in $paths) {
            if ($stopState.ContainsKey('stop')) { $row.detail += ' NOT-RUN: host rate-limit circuit breaker;'; break }
            $url = $base + $path
            try {
                $html=(Invoke-WebRequest $url -TimeoutSec 25).Content
                $match=[regex]::Match($html,'(?s)<div id="source-code"[^>]*>\s*<pre><code>(.*?)</code></pre>')
                if (-not $match.Success) { continue }
                $plain=[Net.WebUtility]::HtmlDecode([regex]::Replace($match.Groups[1].Value,'<[^>]+>',''))
                $sha=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($plain))).ToLowerInvariant()
                $grant=''
                if ($plain -match 'Permission is hereby granted, free of charge' -and $plain -match 'sell\s+copies' -and $plain -match 'permission notice') { $grant='MIT' }
                elseif ($plain -match 'Apache License' -and $plain -match 'Version 2\.0' -and $plain -match 'Grant of Copyright License' -and $plain -match 'Grant of Patent License') { $grant='Apache-2.0' }
                elseif ($plain -match 'Mozilla Public License' -and $plain -match '2\.0' -and $plain -match 'Contributor Grants') { $grant='MPL-2.0' }
                elseif ($plain -match 'Redistribution and use in source and binary forms' -and $plain -match 'are permitted') { $grant= if($plain -match 'Neither the name'){ 'BSD-3-Clause' }else{'BSD-2-Clause'} }
                elseif ($plain -match 'Permission to use, copy, modify, and.*distribute' -and $plain -match 'with or without fee') { $grant='ISC' }
                elseif ($plain -match 'This software is provided.*as.is' -and $plain -match 'Permission is granted to anyone to use this software for any purpose' -and $plain -match 'commercial applications') { $grant='Zlib' }
                elseif ($plain -match 'free and unencumbered software released into the public domain' -and $plain -match 'commercial or non-commercial') { $grant='Unlicense' }
                $row.evidence += [pscustomobject]@{url=$url;sha256=$sha;bytes=[Text.Encoding]::UTF8.GetByteCount($plain);grant=$grant}
                if ($grant -and -not $row.grant) { $row.grant=$grant; $row.status='GRANT-TEXT-VERIFIED' }
            } catch {
                if ($_.Exception.Message -match '429') { $stopState.TryAdd('stop',$true) | Out-Null }
                $row.detail += " Legal fetch failed: $path ($($_.Exception.Message));"
            }
        }
        if($row.status -eq 'UNKNOWN'){$row.detail += ' Root text read but no complete recognized grant established; manual review required'}
    } catch {
        if ($_.Exception.Message -match '429') { $stopState.TryAdd('stop',$true) | Out-Null }
        $row.detail = "Exact docs.rs source listing unavailable: $($_.Exception.Message)"
    }
    [pscustomobject]$row
} -ThrottleLimit 2)
$seen=[System.Collections.Generic.HashSet[string]]::new()
$pending=[System.Collections.Generic.Queue[object]]::new()
$packages|Where-Object name -eq 'rolldown_binding'|ForEach-Object{$pending.Enqueue($_)}
while($pending.Count){
    $p=$pending.Dequeue()
    if(-not $seen.Add("$($p.name)@$($p.version)")){continue}
    foreach($dep in $p.dependencies){
        $parts=$dep.Split(' ')
        $matches=@($packages|Where-Object{$_.name -eq $parts[0] -and ($parts.Count -eq 1 -or $_.version -eq $parts[1])})
        if($matches.Count -ne 1){throw "Ambiguous lock edge: $dep"}
        $pending.Enqueue($matches[0])
    }
}
$results|ForEach-Object{$_|Add-Member bindingLockReachable ($seen.Contains("$($_.name)@$($_.version)"))}
[pscustomobject]@{lockUrl=$lockUrl;lockSha256=$lockHash;date='2026-10-06';rows=@($results|Sort-Object name,version)} | ConvertTo-Json -Depth 7 -Compress
