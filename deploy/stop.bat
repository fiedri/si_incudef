@echo off
setlocal
cd /d "%~dp0"
echo Deteniendo el servidor...

powershell -NoProfile -Command "$target = (Resolve-Path 'runtime\node.exe').Path; Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $target } | Stop-Process -Force"

echo Servidor detenido.
exit /b 0