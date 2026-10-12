@echo off
setlocal

set "SOURCE=%~1"
set "TARGET=%~2"
set "EXE_PATH=%~3"
set "APP_PID=%~4"

if "%SOURCE%"=="" (
    exit /b 10
)

if "%TARGET%"=="" (
    exit /b 11
)

if not exist "%SOURCE%\" (
    exit /b 12
)

if not exist "%TARGET%\" (
    exit /b 13
)

if "%EXE_PATH%"=="" (
    exit /b 14
)

timeout /t 2 /nobreak >nul

if not "%APP_PID%"=="" taskkill /f /pid "%APP_PID%" >nul 2>nul

robocopy "%SOURCE%" "%TARGET%" /MIR /XD outputs local-data /XF recent-files.json /R:2 /W:2 >nul

set "RC=%ERRORLEVEL%"

if %RC% GEQ 8 (
    start "" "%EXE_PATH%"
    exit /b %RC%
)

start "" "%EXE_PATH%"

exit /b 0
