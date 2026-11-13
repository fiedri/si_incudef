# Compilar better_sqlite3.node para Windows x86 (Node 16 / ABI 93)

Solo hace falta si la maquina destino es de 32 bits. En una maquina de 64 bits
el binario oficial ya viene incluido y este paso no se usa nunca.

Se ejecuta en CUALQUIER Windows de 64 bits (por ejemplo el Windows 10 del dual
boot). Nunca en la maquina Windows 8.1 destino: esa no debe tener compiladores.

Resultado esperado: un unico archivo `better_sqlite3.node` de unos 700-900 KB,
que se copia al proyecto como `bin/better_sqlite3-x86.node`.

---

## Por que hay que compilarlo

better-sqlite3 publica binarios precompilados para win32-x64, pero nunca para
win32-ia32. En 32 bits, la instalacion cae en node-gyp, que necesita el
compilador de Microsoft. Por eso se compila una vez aca y se transporta el
archivo ya listo.

El binario tiene que ser:

- Arquitectura **x86** (PE32 i386).
- ABI **93**, que es la de Node 16.

Si cualquiera de las dos no coincide, Node se niega a cargarlo.

---

## Requisitos

| Componente | Version | Para que |
|---|---|---|
| Node | 16.20.2 x64 | aporta npm y node-gyp |
| Visual Studio Build Tools | 2019 (v142) | compilador C++ |
| Python | 3.11 (NO 3.12) | lo usa node-gyp |
| Internet | - | bajar cabeceras de Node y el paquete |

El toolset v142 de VS2019 apunta a Windows 7 SP1 o superior, asi que el binario
resultante corre sin problemas en Windows 8.1.

---

## Paso 1 - Instalar Node 16 x64

Ejecutar `bin/node-x64/node.msi` (ya verificado: es exactamente 16.20.2).

Verificar en una consola nueva:

```
node -v
```

Tiene que imprimir `v16.20.2`. Si imprime otra cosa, hay otro Node instalado y
esta ganando en el PATH: desinstalarlo o corregir el PATH antes de seguir.

## Paso 2 - Instalar Python 3.11

Descargar de python.org. Marcar **"Add python.exe to PATH"** en el instalador.

```
python --version
```

Tiene que decir 3.11.x. La 3.12 no sirve: node-gyp 9 falla porque Python 3.12
elimino `distutils`.

## Paso 3 - Instalar Visual Studio 2019 Build Tools

Bajar el bootstrapper de https://aka.ms/vs/16/release/vs_buildtools.exe y
ejecutarlo desde una consola **como administrador**:

```
vs_buildtools.exe --quiet --wait --norestart --nocache ^
  --installPath C:\BuildTools ^
  --add Microsoft.VisualStudio.Workload.VCTools ^
  --includeRecommended
```

Son unos 5 GB y tarda entre 20 y 40 minutos segun la conexion.

Verificar que exista:

```
dir C:\BuildTools\VC\Auxiliary\Build
```

Si ademas hay un Visual Studio 2022 instalado, fijar explicitamente el 2019:

```
npm config set msvs_version 2019
```

## Paso 4 - Obtener el codigo del addon

No hace falta el proyecto completo: el paquete de better-sqlite3 se publica con
el codigo C++ y el SQLite amalgamado adentro.

```
mkdir C:\bs3
cd C:\bs3
npm pack better-sqlite3@8.7.0
tar -xf better-sqlite3-8.7.0.tgz
cd package
npm install --ignore-scripts
```

`--ignore-scripts` es importante: evita que npm dispare el build automatico y
que baje el prebuild de la arquitectura equivocada.

Si Windows no tiene internet, ejecutar `npm pack better-sqlite3@8.7.0` en otra
maquina y llevar el `.tgz` en el pendrive.

## Paso 5 - Compilar

```
npx --yes node-gyp@9 rebuild --release --arch=ia32 --target=16.20.2
```

`--arch=ia32` fuerza el compilador de 32 bits.
`--target=16.20.2` fija las cabeceras de Node 16, sin importar que version de
Node este instalada en esta maquina. Sin ese flag, si aca hubiera Node 18 o 20,
el resultado seria inservible para el bundle.

Al final tiene que imprimir `gyp info ok`. El archivo queda en:

```
C:\bs3\package\build\Release\better_sqlite3.node
```

## Paso 6 - Verificar el archivo

Arquitectura (dumpbin viene con las Build Tools):

```
for /d %i in (C:\BuildTools\VC\Tools\MSVC\*) do @echo %i
```

Tomar la ruta que aparezca y ejecutar:

```
"C:\BuildTools\VC\Tools\MSVC\<version>\bin\Hostx64\x64\dumpbin.exe" /headers "C:\bs3\package\build\Release\better_sqlite3.node" | findstr machine
```

Tiene que decir `14C machine (x86)`. Si dice `8664 machine (x64)`, el
`--arch=ia32` no se aplico.

Dependencias:

```
dumpbin /dependents "C:\bs3\package\build\Release\better_sqlite3.node"
```

El binario oficial x64 importa unicamente `KERNEL32.dll` (runtime C estatico).
Si el compilado muestra tambien `VCRUNTIME140.dll` o `MSVCP140.dll`, seria
necesario instalar el redistribuible de Visual C++ en la maquina 8.1: conviene
que coincida con el oficial.

## Paso 7 - Probar que carga (definitivo)

Instalar `bin/node-x86/node.msi` (tambien es 16.20.2) y probar con la ruta
absoluta, para no depender del PATH:

```
"C:\Program Files (x86)\nodejs\node.exe" -e "const D=require('C:/bs3/package'); const db=new D(':memory:'); console.log(db.prepare('select 1 as x').get())"
```

Tiene que imprimir `{ x: 1 }`.

Eso valida las dos cosas de una sola vez: si la arquitectura estuviera mal no
cargaria, y si el ABI estuviera mal tiraria `NODE_MODULE_VERSION mismatch`.

Desinstalar despues el Node x86 para no ensuciar el PATH.

## Paso 8 - Llevarlo al proyecto

Copiar `C:\bs3\package\build\Release\better_sqlite3.node` al pendrive y dejarlo
en el proyecto como:

```
bin/better_sqlite3-x86.node
```

---

## Errores tipicos

| Sintoma | Causa | Solucion |
|---|---|---|
| `NODE_MODULE_VERSION mismatch` | se compilo con otro ABI | repetir con `--target=16.20.2` |
| `14C machine` sale `8664` | falta `--arch=ia32` | agregar el flag |
| `Python was not found` | Python no esta en PATH | reinstalar marcando "Add to PATH" |
| `No module named distutils` | Python 3.12 | instalar Python 3.11 |
| `could not find any Visual Studio installation` | falta el workload C++ | reinstalar con `--add Microsoft.VisualStudio.Workload.VCTools` |
| `The system cannot find the file specified` al compilar | falta el toolset x86 | reinstalar con `--includeRecommended` |
