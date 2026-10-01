@echo off
setlocal
set "IDEA_PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%IDEA_PS%" (
  echo BACKEND_ERROR=WINDOWS_POWERSHELL_MISSING
  exit /b 2
)
if not "%~1"=="" goto command
:menu
echo.
echo IDEA Backend - Ubuntu 192.168.137.33 - HTTPS localhost:18444
echo 1. Start / Mo Backend
echo 2. Status / Kiem tra
echo 3. Stop / Dung Backend
echo 0. Exit
set "IDEA_CHOICE="
set /p "IDEA_CHOICE=Choose: "
if "%IDEA_CHOICE%"=="0" exit /b 0
if "%IDEA_CHOICE%"=="1" "%IDEA_PS%" -NoProfile -File "%~dp0tools\backend-dev-access\launcher.ps1" -Action Start
if "%IDEA_CHOICE%"=="2" "%IDEA_PS%" -NoProfile -File "%~dp0tools\backend-dev-access\launcher.ps1" -Action Status
if "%IDEA_CHOICE%"=="3" "%IDEA_PS%" -NoProfile -File "%~dp0tools\backend-dev-access\launcher.ps1" -Action Stop
pause
goto menu
:command
"%IDEA_PS%" -NoProfile -File "%~dp0tools\backend-dev-access\launcher.ps1" %*
exit /b %errorlevel%
