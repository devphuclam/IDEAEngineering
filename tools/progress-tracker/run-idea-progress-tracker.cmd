@echo off
setlocal
cd /d "%~dp0\..\.."
set "SCRIPT=%~dp0idea-progress-tracker.ps1"
set "PWSH="
for /f "delims=" %%P in ('where.exe pwsh.exe 2^>nul') do (
  set "PWSH=%%P"
  goto :run
)
if exist "%ProgramFiles%\PowerShell\7\pwsh.exe" set "PWSH=%ProgramFiles%\PowerShell\7\pwsh.exe"
if not defined PWSH if exist "%LOCALAPPDATA%\Programs\PowerShell\7\pwsh.exe" set "PWSH=%LOCALAPPDATA%\Programs\PowerShell\7\pwsh.exe"
if not defined PWSH (
  for /d %%D in ("%USERPROFILE%\.cache\codex-runtimes\*") do (
    if exist "%%~D\dependencies\native\powershell\pwsh.exe" (
      set "PWSH=%%~D\dependencies\native\powershell\pwsh.exe"
      goto :run
    )
  )
)
if not defined PWSH goto :not_found

:run
"%PWSH%" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" %*
set "EXITCODE=%ERRORLEVEL%"
goto :done

:not_found
echo PowerShell 7 (pwsh.exe) was not found. Add it to PATH or install PowerShell 7.
set "EXITCODE=1"
:done
if not "%EXITCODE%"=="0" (
  echo.
  echo IDEA Progress Tracker failed to start. See the error above.
  pause
)
endlocal & exit /b %EXITCODE%
