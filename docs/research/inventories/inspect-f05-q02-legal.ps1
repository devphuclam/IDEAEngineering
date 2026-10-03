# Read-only inspection of the exact coordinate list. No Maven/plugin execution.
param([Parameter(Mandatory=$true)][string[]]$Coordinates)
$ErrorActionPreference='Stop'
foreach ($c in $Coordinates) { if ($c -notmatch '^[A-Za-z0-9_.-]+:[A-Za-z0-9_.-]+:[A-Za-z0-9_.-]+$') { throw 'Invalid coordinate' } }
$body=@'
set -eu
declare -A seen
for c in COORDINATES; do
 IFS=: read -r g a v <<EOF
$c
EOF
 p=/home/phuclam/.m2/repository/$(printf '%s' "$g" | tr . /)/$a/$v/$a-$v.jar
 if [ ! -f "$p" ]; then printf '@@MISSING\t%s\n' "$c"; continue; fi
 printf '@@JAR\t%s\t%s\t%s\n' "$c" "$p" "$(sha256sum "$p" | awk '{print $1}')"
 while IFS= read -r e; do
  h=$(/usr/bin/busybox unzip -p "$p" "$e" | sha256sum | awk '{print $1}')
  printf '@@LEGAL\t%s\t%s\t%s\n' "$c" "$e" "$h"
  if [ -z "${seen[$h]+present}" ]; then
   seen[$h]=1
   printf '@@TEXT\t%s\t' "$h"; /usr/bin/busybox unzip -p "$p" "$e" | base64 -w 0; printf '\n'
  fi
 done < <(/usr/bin/busybox unzip -l "$p" | awk 'tolower($NF) ~ /(license|notice|copyright)/ && $NF !~ /\/$/ && $NF !~ /\.class$/ {print $NF}')
done
'@
$body=$body.Replace('COORDINATES', (($Coordinates | ForEach-Object { "'$_'" }) -join ' '))
& ssh -i C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519 -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=5 phuclam@192.168.137.33 $body
if ($LASTEXITCODE -ne 0) { throw 'Legal capture failed' }
