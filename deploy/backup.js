'use strict';

const fs = require('fs');
const path = require('path');

const ROOT= __dirname;
const DB_PATH= process.env.DB_PATH || path.join(ROOT, 'data', 'sistema.db');
const BACKUP_DIR= path.join(ROOT, 'backups');
const LOG_DIR = path.join(ROOT, 'logs');
const RETENTION_DAYS = 30;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(path.join(LOG_DIR, 'respaldo.log'), line + '\n');
  } catch (_) {
    // el log no debe romper el respaldo
  }
}

function stamp(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
         `_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    log(`sin base en ${DB_PATH}; nada que respaldar`);
    return 0;
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const Database = require(path.join(ROOT, 'app', 'node_modules', 'better-sqlite3'));
  const db = new Database(DB_PATH, { fileMustExist: true });

  const dest = path.join(BACKUP_DIR, `sistema-${stamp(new Date())}.db`);
  await db.backup(dest);
  db.close();

  // Verificacion real: abrir la copia y correr integrity_check.
  const check = new Database(dest, { readonly: true, fileMustExist: true });
  const result = check.pragma('integrity_check', { simple: true });
  check.close();

  if (result !== 'ok') {
    log(`ERROR: ${path.basename(dest)} no paso integrity_check: ${result}`);
    return 1;
  }

  log(`respaldo ok: ${path.basename(dest)} (${fs.statSync(dest).size} bytes)`);

  // Retencion: borrar los mas viejos que RETENTION_DAYS.
  const limite = Date.now() - RETENTION_DAYS * 86400000;
  let borrados = 0;
  for (const f of fs.readdirSync(BACKUP_DIR)) {
    if (!f.endsWith('.db')) continue;
    const full = path.join(BACKUP_DIR, f);
    if (fs.statSync(full).mtimeMs < limite) {
      fs.unlinkSync(full);
      borrados++;
    }
  }
  if (borrados > 0) log(`retencion: ${borrados} respaldo(s) antiguo(s) eliminado(s)`);

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    log(`ERROR: ${e.message}`);
    process.exit(1);
  });
