@echo off
setlocal
cd /d "%~dp0"
echo Deteniendo el servidor...
wmic process where "ExecutablePath='%~dp0runtime\node.exe'" delete >nul 2>&1
if errorlevel 1 (
  echo No se encontro el proceso del servidor en ejecucion.
  exit /b 1
)
echo Servidor detenido.
exit /b 0
