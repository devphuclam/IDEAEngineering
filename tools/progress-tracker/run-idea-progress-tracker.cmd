@echo off
setlocal
cd /d "%~dp0\..\.."
set "SCRIPT=%~dp0idea-progress-tracker.ps1"
if exist "%ProgramFiles%\PowerShell\7\pwsh.exe" (
  "%ProgramFiles%\PowerShell\7\pwsh.exe" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
  set "EXITCODE=%errorlevel%"
  goto :done
)
if exist "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" (
  "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
  set "EXITCODE=%errorlevel%"
  goto :done
)
echo Khong tim thay PowerShell. Hay mo PowerShell 7 hoac Windows PowerShell truoc khi chay.
set "EXITCODE=1"
:done
if not "%EXITCODE%"=="0" (
  echo.
  echo IDEA Progress Tracker khong khoi dong duoc. Xem loi phia tren.
  pause
)
endlocal & exit /b %EXITCODE%
