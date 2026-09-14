param(
    [string]$FlutterCommand = 'flutter',
    [switch]$IncludeReleaseBuilds
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$q15Root = Split-Path -Parent $PSScriptRoot

function Invoke-NativeChecked {
    param(
        [Parameter(Mandatory)] [string]$Command,
        [Parameter(Mandatory)] [string[]]$Arguments
    )
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Command exited with code $LASTEXITCODE."
    }
}

Invoke-NativeChecked dotnet @(
    'test', "$q15Root/shared/dotnet/Idea.Q15.WorkspaceProtocol.Tests/Idea.Q15.WorkspaceProtocol.Tests.csproj",
    '-c', 'Release'
)
Invoke-NativeChecked dotnet @(
    'test', "$q15Root/shared/dotnet/Idea.Q15.ApiHarness.Tests/Idea.Q15.ApiHarness.Tests.csproj",
    '-c', 'Release'
)
Invoke-NativeChecked dotnet @(
    'test', "$q15Root/option-a/desktop/Idea.Q15.OptionA.Bridge.Tests/Idea.Q15.OptionA.Bridge.Tests.csproj",
    '-c', 'Release'
)
Invoke-NativeChecked dotnet @(
    'build', "$q15Root/option-a/desktop/Idea.Q15.OptionA.Desktop/Idea.Q15.OptionA.Desktop.csproj",
    '-c', 'Release'
)

Push-Location "$q15Root/option-a/web"
try {
    Invoke-NativeChecked npm @('ci')
    Invoke-NativeChecked npm @('test')
    Invoke-NativeChecked npm @('run', 'build')
}
finally {
    Pop-Location
}

Push-Location "$q15Root/option-b/flutter"
try {
    Invoke-NativeChecked $FlutterCommand @('pub', 'get')
    Invoke-NativeChecked $FlutterCommand @('analyze')
    Invoke-NativeChecked $FlutterCommand @('test', 'test', '--reporter', 'expanded')
    if ($IncludeReleaseBuilds) {
        Invoke-NativeChecked $FlutterCommand @('build', 'web', '--release')
        Invoke-NativeChecked $FlutterCommand @('build', 'web', '--wasm', '--release')
        Invoke-NativeChecked $FlutterCommand @('build', 'windows', '--release')
    }
}
finally {
    Pop-Location
}

Write-Host 'Q-15 isolated source checks completed. Repository verifiers were NOT-RUN.'
