@echo off
setlocal EnableExtensions

set "SOURCE=%~1"
set "TARGET=%~2"
set "EXE_PATH=%~3"
set "APP_PID=%~4"

if "%SOURCE%"=="" exit /b 10
if "%TARGET%"=="" exit /b 11
if not exist "%SOURCE%\" exit /b 12
if not exist "%TARGET%\" exit /b 13
if "%EXE_PATH%"=="" exit /b 14

set "LOCAL_DATA=%TARGET%\local-data"
set "STAGE=%LOCAL_DATA%\refresh-staging"
set "STATUS=%LOCAL_DATA%\data-refresh-result.txt"
set "BACKUP=%LOCAL_DATA%\data-refresh-backup"

if not exist "%LOCAL_DATA%\" mkdir "%LOCAL_DATA%" >nul 2>nul
if exist "%STAGE%\" rmdir /s /q "%STAGE%"
mkdir "%STAGE%" >nul 2>nul

timeout /t 2 /nobreak >nul
if not "%APP_PID%"=="" taskkill /f /pid "%APP_PID%" >nul 2>nul

robocopy "%SOURCE%" "%STAGE%" sales.sqlite /COPY:DAT /R:2 /W:2 >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 goto database_failed
if not exist "%STAGE%\sales.sqlite" goto database_missing
set "ELECTRON_RUN_AS_NODE=1"
"%EXE_PATH%" "%TARGET%\resources\tools\validate-database.js" "%STAGE%\sales.sqlite" "%TARGET%\resources\app.asar" >nul 2>nul
set "VALIDATE_RC=%ERRORLEVEL%"
set "ELECTRON_RUN_AS_NODE="
if not "%VALIDATE_RC%"=="0" goto database_invalid

robocopy "%SOURCE%\images" "%STAGE%\images" /MIR /R:2 /W:2 >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 goto images_failed

if exist "%SOURCE%\resources\materials\" (
  robocopy "%SOURCE%\resources\materials" "%STAGE%\materials" /MIR /R:2 /W:2 >nul
  set "RC=%ERRORLEVEL%"
  if %RC% GEQ 8 goto materials_failed
)

if not exist "%BACKUP%\" mkdir "%BACKUP%" >nul 2>nul
if exist "%TARGET%\sales.sqlite" copy /y "%TARGET%\sales.sqlite" "%BACKUP%\sales-before-refresh.sqlite" >nul
copy /y "%STAGE%\sales.sqlite" "%TARGET%\sales.sqlite.refreshing" >nul
if errorlevel 1 goto database_replace_failed
move /y "%TARGET%\sales.sqlite.refreshing" "%TARGET%\sales.sqlite" >nul
if errorlevel 1 goto database_replace_failed

robocopy "%STAGE%\images" "%TARGET%\images" /MIR /R:1 /W:1 >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 goto images_apply_failed

if exist "%STAGE%\materials\" (
  robocopy "%STAGE%\materials" "%TARGET%\resources\materials" /MIR /R:1 /W:1 >nul
  set "RC=%ERRORLEVEL%"
  if %RC% GEQ 8 goto materials_apply_failed
)

>"%STATUS%" echo OK^|%DATE% %TIME%
goto finish

:database_failed
>"%STATUS%" echo ERROR^|database-download^|%RC%
goto finish
:database_missing
>"%STATUS%" echo ERROR^|database-missing^|0
goto finish
:database_invalid
>"%STATUS%" echo ERROR^|database-invalid^|%VALIDATE_RC%
goto finish
:images_failed
>"%STATUS%" echo ERROR^|images-download^|%RC%
goto finish
:materials_failed
>"%STATUS%" echo ERROR^|materials-download^|%RC%
goto finish
:database_replace_failed
>"%STATUS%" echo ERROR^|database-replace^|1
goto finish
:images_apply_failed
>"%STATUS%" echo ERROR^|images-apply^|%RC%
goto finish
:materials_apply_failed
>"%STATUS%" echo ERROR^|materials-apply^|%RC%

:finish
if exist "%STAGE%\" rmdir /s /q "%STAGE%"
start "" "%EXE_PATH%"
exit /b 0
