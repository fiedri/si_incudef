@echo off
setlocal
cd /d "%~dp0"
if not exist "runtime\node.exe" (
  echo Falta runtime\node.exe. Ejecute instalar.bat primero.
  exit /b 1
)
"runtime\node.exe" "backup.js"
if errorlevel 1 exit /b 1
exit /b 0
