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

rem --- base de datos: se crea una sola vez, en esta maquina ---------------
set "DATABASE_PATH=%CD%\data\sistema.db"
if exist "data\sistema.db" (
  echo Base de datos existente; no se modifica.
  goto :db_ok
)

echo Inicializando base de datos...
"runtime\node.exe" "app\scripts\init-db.mjs" > "logs\inicializacion.log" 2>&1
if errorlevel 1 (
  echo ERROR: no se pudo inicializar la base de datos >> "%LOG%"
  echo ERROR: no se pudo inicializar la base de datos.
  echo Detalle en logs\inicializacion.log
  type "logs\inicializacion.log"
  if exist "data\sistema.db" del /f /q "data\sistema.db"
  exit /b 1
)

findstr /C:"CLAVE:" "logs\inicializacion.log" >nul
if not errorlevel 1 (
  echo.
  echo ============================================================
  echo CLAVE TEMPORAL DEL ADMINISTRADOR - guardela ahora
  findstr /C:"CLAVE:" "logs\inicializacion.log"
  echo Tambien queda en logs\inicializacion.log
  echo ============================================================
  echo.
  pause
)

:db_ok

echo OK >> "%LOG%"
echo Instalacion completa. Ejecute init.vbs
exit /b 0
