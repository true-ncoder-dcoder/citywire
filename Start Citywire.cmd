@echo off
setlocal
title Citywire
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 goto missing_node
node -e "const [major,minor]=process.versions.node.split('.').map(Number); process.exit(major>22 || (major===22 && minor>=13) ? 0 : 1)"
if errorlevel 1 goto missing_node
where npm.cmd >nul 2>&1
if errorlevel 1 goto missing_node

if exist "node_modules\vinext\dist\cli.js" goto launch
echo Installing Citywire dependencies. This first run needs internet access...
call npm.cmd ci
if errorlevel 1 goto failed

:launch
echo Starting Citywire. Your browser will open when the server is ready.
echo Keep this window open. Press Ctrl+C to stop the app.
set "CITYWIRE_OPEN_BROWSER=1"
call npm.cmd run dev
if errorlevel 1 goto failed
exit /b 0

:missing_node
echo Install Node.js 22.13 or later from https://nodejs.org/ and try again.
pause
exit /b 1

:failed
echo.
echo Citywire could not start. See the error above.
pause
exit /b 1
