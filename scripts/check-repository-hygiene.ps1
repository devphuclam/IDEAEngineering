[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$violations = [System.Collections.Generic.List[object]]::new()

Push-Location -LiteralPath $repositoryRoot
try {
    $trackedFiles = @(git ls-files)
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to read the Git index.'
    }

    foreach ($trackedFile in $trackedFiles) {
        $path = $trackedFile.Replace('\\', '/')
        $fileName = [System.IO.Path]::GetFileName($path)

        if ($path -match '^(?:\.tmp|\.tmp-artifact|\.tmp-validation|tmp)/') {
            $violations.Add([pscustomobject]@{
                Rule = 'transient-directory'
                Path = $path
            })
        }

        if ($fileName.StartsWith('~$') -or $fileName -like '~WRL*.tmp') {
            $violations.Add([pscustomobject]@{
                Rule = 'application-lock-file'
                Path = $path
            })
        }

        if ($path -match '(^|/)__pycache__/|\.py[co]$') {
            $violations.Add([pscustomobject]@{
                Rule = 'runtime-cache'
                Path = $path
            })
        }
    }
}
finally {
    Pop-Location
}

if ($violations.Count -gt 0) {
    Write-Host 'Repository hygiene check: FAIL' -ForegroundColor Red
    $violations | Sort-Object Rule, Path | Format-Table -AutoSize
    exit 1
}

Write-Host 'Repository hygiene check: PASS'
Write-Host 'No tracked transient directories, application lock files, or runtime caches were found.'
