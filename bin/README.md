# bin/ - binarios y runtimes de Windows

Esta carpeta contiene todo lo que la maquina Windows 8.1 necesita para ejecutar
la aplicacion sin instalar ni compilar nada: los binarios que no se pueden
reconstruir con un comando.

| Archivo | Arquitectura | ABI / Node | Origen |
|---|---|---|---|
| `better_sqlite3-x64.node` | x64 (PE32+) | 93 / Node 16 | prebuild oficial de better-sqlite3 v8.7.0 |
| `better_sqlite3-x86.node` | x86 (PE32 i386) | 93 / Node 16 | compilado a mano con VS2019 |
| `node-x64/node.msi` | x64 | 16.20.2 | instalador oficial de nodejs.org |
| `node-x86/node.msi` | x86 | 16.20.2 | instalador oficial de nodejs.org |

Huellas para verificar que el archivo es exactamente el esperado:

```
4ccf651e1c20f1b9bf90231d54f0b6ebe86ae6302f0e149fb54705b0a3bd6827  better_sqlite3-x64.node
360f125ca77ab5db97d98552cc56573b7f31971378eb9fdc0029c3c8a6f16ce5  better_sqlite3-x86.node
```

---

## better_sqlite3-*.node

SQLite no es JavaScript: es un addon nativo compilado. El archivo `.node` es
codigo maquina valido para una combinacion exacta de **plataforma,
arquitectura y ABI**. Una sola de las tres que no coincida y Node se niega a
cargarlo. Por eso hay dos archivos, uno por arquitectura.

### better_sqlite3-x64.node

Es el prebuild oficial. Sale del release `v8.7.0` de better-sqlite3, asset
`better-sqlite3-v8.7.0-node-v93-win32-x64.tar.gz`, y adentro viene exactamente
`build/Release/better_sqlite3.node`.

### better_sqlite3-x86.node

better-sqlite3 **nunca publico** un prebuild `win32-ia32`, en ninguna version.
No hay nada que descargar: hubo que compilarlo una vez con el compilador de
Microsoft. El procedimiento completo esta en
[`docs/compilar-x86-windows.md`](../docs/compilar-x86-windows.md).

Verificado antes de incorporarlo:

- `file`: `PE32 executable (DLL) Intel 80386`, o sea 32 bits real.
- Importa unicamente `KERNEL32.dll`, el mismo perfil que el prebuild oficial
  x64 (runtime C estatico). No requiere `vcruntime140.dll` ni el redistribuible
  de Visual C++ en la maquina destino.

---

## node-x64/ y node-x86/

Son los instaladores oficiales de Node.js 16.20.2, uno por arquitectura. **No
forman parte del bundle y no se instalan en la maquina destino**: el bundle
lleva un `node.exe` portable. Estan aca por dos razones.

### 1. Fijar la version exacta, sin buscarla

El proyecto solo funciona con Node 16 (ver `app/package.json` y el `README`
principal). Tener los instaladores al lado del codigo evita el clasico "instale
la version que habia" en la maquina de build o de prueba. Cualquiera que abra
esta carpeta sabe exactamente que runtime usar.


### 2. Reproducir el entorno de la maquina destino

La 8.1 va a correr Node 16.20.2 x86 o x64 segun su arquitectura. Tener ambos
instaladores permite probar en la misma version que se va a entregar, sin
depender de lo que este instalado en la maquina de desarrollo.

### Por que no estan versionados

Los dos MSI suman 55 MB y se bajan de `https://nodejs.org/dist/v16.20.2/` en
cualquier momento. El `.gitignore` los excluye (`bin/**/*.msi`): son una copia
local de conveniencia, no parte del codigo.


---

## Reglas de esta carpeta

1. Los `.node` tienen que coincidir con la version de better-sqlite3 declarada
   en `app/package.json` y con la ABI de Node 16.
2. Lo grande y regenerable (MSI, ZIP de Node, `node_modules`, `dist`) no entra.
3. La maquina destino no compila ni instala nada: solo recibe archivos ya listos.
