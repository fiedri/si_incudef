#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION="16.20.2"
BASE_URL="https://nodejs.org/dist/v${NODE_VERSION}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

log() { printf '[get-node] %s\n' "$*"; }
die() { printf '[get-node] ERROR: %s\n' "$*" >&2; exit 1; }

command -v curl >/dev/null || die "falta curl"
command -v unzip >/dev/null || die "falta unzip"
command -v sha256sum >/dev/null || die "falta sha256sum"

log "Node ${NODE_VERSION} desde ${BASE_URL}"

curl -fsSL --retry 3 -o "${TMP_DIR}/SHASUMS256.txt" "${BASE_URL}/SHASUMS256.txt" \
  || die "no se pudo descargar SHASUMS256.txt"

for arch in x64 x86; do
  zip_name="node-v${NODE_VERSION}-win-${arch}.zip"
  inner_path="node-v${NODE_VERSION}-win-${arch}/node.exe"
  dest_dir="${ROOT_DIR}/bin/node-${arch}"
  dest="${dest_dir}/node.exe"

  if [[ -f "${dest}" && "${FORCE}" -eq 0 ]]; then
    log "${arch}: ya existe bin/node-${arch}/node.exe (salteado, use --force para repetir)"
    continue
  fi

  mkdir -p "${dest_dir}"

  log "${arch}: descargando ${zip_name}"
  curl -fL --retry 3 --progress-bar \
    -o "${TMP_DIR}/${zip_name}.part" "${BASE_URL}/${zip_name}" \
    || die "fallo la descarga de ${zip_name}"

  mv "${TMP_DIR}/${zip_name}.part" "${TMP_DIR}/${zip_name}"

  ( cd "${TMP_DIR}" && sha256sum -c --ignore-missing SHASUMS256.txt >/dev/null ) \
    || die "hash invalido para ${zip_name}"

  unzip -p "${TMP_DIR}/${zip_name}" "${inner_path}" > "${dest}.part" \
    || die "no se pudo extraer node.exe de ${zip_name}"

  if [[ ! -s "${dest}.part" ]]; then
    rm -f "${dest}.part"
    die "la extraccion de ${zip_name} produjo un archivo vacio"
  fi

  mv "${dest}.part" "${dest}"
  log "${arch}: listo sha256=$(sha256sum "${dest}" | cut -d' ' -f1)"
done

log "fin"
ls -lh "${ROOT_DIR}/bin/node-x64/node.exe" "${ROOT_DIR}/bin/node-x86/node.exe"
