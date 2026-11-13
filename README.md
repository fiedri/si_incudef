# SI-INCUDEF — Registro de Cultores

Sistema de información para el registro y consulta de cultores y agrupaciones culturales. Despliegue local sin dependencias externas, optimizado para Windows 8.1.

**Stack:** SvelteKit 1 · Svelte 4 · SQLite (`better-sqlite3`) · Drizzle ORM · Tailwind CSS v3

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `app/` | Aplicación SvelteKit. **El proyecto vive acá** y todos los comandos de abajo se ejecutan dentro de esta carpeta. |
| `bin/` | Runtimes y binarios nativos de Windows (x86 / x64). |
| `docs/` | Requerimientos, stack tecnológico y etc |
| `data/` | Directorio para los datos locales (SQLite). |

## Requisitos previos

- Node.js v16.20.2 (LTS)
- Chrome 109
- Yarn Classic 1.22.22

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/fiedri/si-incudef.git
cd si-incudef/app

# 2. Instalar Yarn Classic
npm install -g yarn@1.22.22 --engine-strict=false

# 3. Instalar dependencias respetando el lockfile
yarn install --frozen-lockfile --ignore-engines
```

> [!NOTE]
> `--engine-strict=false` e `--ignore-engines` omiten las advertencias `node >=18` de subdependencias secundarias, permitiendo instalar el árbol de paquetes bajo **Node.js v16** (requerido para compatibilidad con Windows 8.1).

## Entorno de desarrollo

Ejecutar desde `app/`:

```bash
yarn dev      # servidor local
yarn build    # build de producción
yarn preview  # previsualizar el build
yarn check    # verificación de tipos
```

## Documentación

Requerimientos funcionales y decisiones de arquitectura en [`docs/`](./docs).
