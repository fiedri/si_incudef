@echo off
cd /d "%~dp0"
"runtime\node.exe" "app\build\index.js" >> "logs\servidor.log" 2>&1