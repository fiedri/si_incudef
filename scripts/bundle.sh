#!/usr/bin/env bash
#
# Arma dist/SistemaCultores: bundle cerrado para Windows 8.1.
# Corre en Linux. El resultado se copia a la maquina destino tal cual.
#
# Uso:
#   ./scripts/bundle.sh
#   ./scripts/bundle.sh --skip-build    # reusa app/build existente
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP="${ROOT_DIR}/app"
DIST="${ROOT_DIR}/dist/SistemaCultores"

SKIP_BUILD=0
if [[ "${1:-}" == "--skip-build" ]]; then SKIP_BUILD=1; fi

log() { printf '[bundle] %s\n' "$*"; }
die() { printf '[bundle] ERROR: %s\n' "$*" >&2; exit 1; }

faltan=()
for f in \
  "${ROOT_DIR}/bin/node-x64/node.exe" \
  "${ROOT_DIR}/bin/node-x86/node.exe" \
  "${ROOT_DIR}/bin/better_sqlite3-x64.node" \
  "${ROOT_DIR}/bin/better_sqlite3-x86.node" \
  "${APP}/package.json" \
  "${APP}/yarn.lock"; do
  [[ -f "$f" ]] || faltan+=("${f#${ROOT_DIR}/}")
done
if (( ${#faltan[@]} > 0 )); then
  printf '[bundle] ERROR: faltan archivos:\n' >&2
  printf '  - %s\n' "${faltan[@]}" >&2
  printf 'Bajar los node.exe con ./scripts/obtener-node.sh.\n' >&2
  printf 'El binario x86 se compila segun docs/compilar-x86-windows.md.\n' >&2
  exit 1
fi

case "$DIST" in
  */dist/SistemaCultores) rm -rf "$DIST" ;;
  *) die "ruta de destino inesperada: $DIST" ;;
esac
mkdir -p "${DIST}/app" "${DIST}/bin" "${DIST}/data" "${DIST}/backups" "${DIST}/logs"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  log "dependencias de desarrollo"
  ( cd "$APP" && yarn install --frozen-lockfile --ignore-engines >/dev/null )
  log "compilando"
  ( cd "$APP" && yarn build >/dev/null )
fi
[[ -f "${APP}/build/index.js" ]] || die "no existe app/build/index.js"

# --- dependencias de produccion, directo al destino ---------------------
# --ignore-scripts evita que better-sqlite3 baje el prebuild de Linux.
# --modules-folder escribe en el bundle sin tocar app/node_modules.
log "dependencias de produccion"
( cd "$APP" && yarn install \
    --production \
    --frozen-lockfile \
    --ignore-engines \
    --ignore-scripts \
    --modules-folder "${DIST}/app/node_modules" >/dev/null )

# --- contenido de la app -------------------------------------------------
cp -a "${APP}/build" "${DIST}/app/"
cp "${APP}/package.json" "${APP}/yarn.lock" "${DIST}/app/"

# --- binarios de Windows -------------------------------------------------
cp "${ROOT_DIR}/bin/node-x64/node.exe"       "${DIST}/bin/node-x64.exe"
cp "${ROOT_DIR}/bin/node-x86/node.exe"       "${DIST}/bin/node-x86.exe"
cp "${ROOT_DIR}/bin/better_sqlite3-x64.node" "${DIST}/bin/better_sqlite3-x64.node"
cp "${ROOT_DIR}/bin/better_sqlite3-x86.node" "${DIST}/bin/better_sqlite3-x86.node"

# --- scripts de Windows (cuando exista deploy/) --------------------------
if [[ -d "${ROOT_DIR}/deploy" ]]; then
  cp -a "${ROOT_DIR}/deploy/." "${DIST}/"
  # CRLF idempotente: saca CR si ya lo tiene y agrega uno solo al final.
  while IFS= read -r -d '' f; do
    sed -i 's/\r$//; s/$/\r/' "$f"
  done < <(find "${DIST}" -maxdepth 1 -type f \( -name '*.bat' -o -name '*.vbs' \) -print0)
else
  log "AVISO: no existe deploy/; el bundle queda sin instalador"
fi

# --- verificacion final --------------------------------------------------
esperados=(
  "app/build/index.js"
  "app/package.json"
  "app/node_modules/better-sqlite3/package.json"
  "app/node_modules/drizzle-orm/package.json"
  "app/node_modules/bcryptjs/package.json"
  "bin/node-x64.exe"
  "bin/node-x86.exe"
  "bin/better_sqlite3-x64.node"
  "bin/better_sqlite3-x86.node"
)
faltan=()
for rel in "${esperados[@]}"; do
  [[ -e "${DIST}/${rel}" ]] || faltan+=("$rel")
done
if (( ${#faltan[@]} > 0 )); then
  printf '[bundle] ERROR: bundle incompleto:\n' >&2
  printf '  - %s\n' "${faltan[@]}" >&2
  exit 1
fi

# --- resumen -------------------------------------------------------------
log "listo en ${DIST#${ROOT_DIR}/}"
du -sh "${DIST}/app/node_modules" "${DIST}/app/build" "${DIST}/bin"
log "total: $(du -sh "$DIST" | cut -f1), $(find "$DIST" -type f | wc -l) archivos"
