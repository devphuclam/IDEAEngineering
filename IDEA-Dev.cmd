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
echo IDEA Engineering - HTTPS localhost:18448
echo 1. Develop current local Frontend / Hot reload
echo 2. Start Backend independently
echo 3. Open pinned package / Historical review mode
echo 4. Status / Source and runtime identity
echo 5. Stop owned development processes
echo 0. Exit
set "IDEA_CHOICE="
set /p "IDEA_CHOICE=Choose: "
if "%IDEA_CHOICE%"=="0" exit /b 0
if "%IDEA_CHOICE%"=="1" "%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action Dev
if "%IDEA_CHOICE%"=="2" "%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action BackendStart
if "%IDEA_CHOICE%"=="3" "%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action Start
if "%IDEA_CHOICE%"=="4" "%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action Status
if "%IDEA_CHOICE%"=="5" "%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action Stop
pause
goto menu
:command
"%IDEA_PS%" -NoProfile -File "%~dp0tools\dev-access\launch.ps1" -Action %*
exit /b %errorlevel%
