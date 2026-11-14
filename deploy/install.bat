@echo off
setlocal
cd /d "%~dp0"

if not exist "logs" mkdir "logs"
set "LOG=logs\instalacion.log"
echo [%DATE% %TIME%] inicio >> "%LOG%"

rem --- arquitectura: x64 por defecto; x86 solo si es un Windows de 32 bits ---
rem En un cmd de 32 bits sobre Windows de 64 bits, ARCHITEW6432 esta definida.
set "ARCH=x64"
if /i "%PROCESSOR_ARCHITECTURE%"=="x86" if not defined PROCESSOR_ARCHITEW6432 set "ARCH=x86"

echo Arquitectura detectada: %ARCH% >> "%LOG%"
echo Arquitectura detectada: %ARCH%

rem --- preflight ---
if not exist "bin\node-%ARCH%.exe" (
  echo ERROR: falta bin\node-%ARCH%.exe >> "%LOG%"
  echo ERROR: este paquete no incluye el runtime para %ARCH%.
  echo Ver LEEME.txt
  exit /b 1
)
if not exist "bin\better_sqlite3-%ARCH%.node" (
  echo ERROR: falta bin\better_sqlite3-%ARCH%.node >> "%LOG%"
  echo ERROR: este paquete no incluye el modulo nativo para %ARCH%.
  echo Ver LEEME.txt
  exit /b 1
)

rem --- carpetas ---
if not exist "runtime" mkdir "runtime"
if not exist "data" mkdir "data"
if not exist "backups" mkdir "backups"
if not exist "app\node_modules\better-sqlite3\build\Release" mkdir "app\node_modules\better-sqlite3\build\Release"

rem --- copias ---
copy /y "bin\node-%ARCH%.exe" "runtime\node.exe" >nul
if errorlevel 1 (
  echo ERROR: no se pudo copiar node.exe. Detenga el servidor con stop.bat >> "%LOG%"
  echo ERROR: no se pudo copiar node.exe. Si la aplicacion esta abierta, ejecute stop.bat.
  exit /b 1
)

copy /y "bin\better_sqlite3-%ARCH%.node" "app\node_modules\better-sqlite3\build\Release\better_sqlite3.node" >nul
if errorlevel 1 (
  echo ERROR: no se pudo copiar el modulo nativo >> "%LOG%"
  echo ERROR: no se pudo copiar el modulo nativo.
  exit /b 1
)

rem --- prueba real: que node.exe cargue el modulo nativo ---
"runtime\node.exe" -e "require('./app/node_modules/better-sqlite3')" >nul 2>&1
if errorlevel 1 (
  echo ERROR: node.exe no pudo cargar better-sqlite3 >> "%LOG%"
  echo ERROR: la instalacion fallo al probar el modulo nativo.
  exit /b 1
)

echo OK >> "%LOG%"
echo Instalacion completa. Ejecute init.vbs
exit /b 0
