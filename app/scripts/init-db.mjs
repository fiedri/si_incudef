import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({path: path.resolve(process.cwd(), '.env'), override: true})
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_PATH = path.resolve(
  process.env.DATABASE_PATH ?? path.join(ROOT, "data", "sistema.db"),
);
const MIGRATIONS_DIR = path.join(ROOT, "drizzle");
const CATALOG_FILE = path.join(ROOT, "scripts", "seed", "catalogo.json");
const BCRYPT_COST = 12;

function log(msg) {
  console.log(`db -> ${msg}`);
}

function openDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const database = new Database(DB_PATH);
  database.pragma("foreign_keys = ON");
  return database;
}

function applyMigration(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS __migrations (
    nombre TEXT PRIMARY KEY,
    aplicado_en INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )`);

  const applied = new Set(
    db
      .prepare("SELECT nombre FROM __migrations")
      .all()
      .map((row) => row.nombre),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR).filter(file => file.endsWith('.sql')).sort()
    
  for (const file of files) {
    if (applied.has(file)) {
      log(`ya aplicada: ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const statement of statements) db.exec(statement);
    db.prepare("INSERT INTO __migrations (nombre) VALUES (?)").run(file);
    log(`aplicada: ${file} (${statements.length} statements)`);
  }
}

function readCatalog() {
  if (!fs.existsSync(CATALOG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
}

function seedCatalog(db, catalog) {
  const insertDisciplina = db.prepare(
    'INSERT INTO disciplina (nombre) VALUES (?) ON CONFLICT(nombre) DO NOTHING'
  );
  for (const nombre of catalog.disciplinas ?? []) insertDisciplina.run(nombre);

  const findPregunta = db.prepare(
    'SELECT 1 FROM preguntas_recuperacion WHERE pregunta = ?'
  );
  const insertPregunta = db.prepare(
    'INSERT INTO preguntas_recuperacion (pregunta, placeholder) VALUES (?, ?)'
  );
  for (const p of catalog.preguntas ?? []) {
    if (!findPregunta.get(p.pregunta)) {
      insertPregunta.run(p.pregunta, p.placeholder ?? '');
    }
  }

  const insertEstado = db.prepare(
    'INSERT INTO estado (nombre) VALUES (?) ON CONFLICT(nombre) DO NOTHING'
  );
  const findEstado = db.prepare('SELECT id FROM estado WHERE nombre = ?');
  const insertMunicipio = db.prepare(
    'INSERT INTO municipio (nombre, estado_id) VALUES (?, ?) ON CONFLICT DO NOTHING'
  );
  const findMunicipio = db.prepare('SELECT id FROM municipio WHERE nombre = ?');
  const insertParroquia = db.prepare(
    'INSERT INTO parroquia (nombre, municipio_id) VALUES (?, ?) ON CONFLICT DO NOTHING'
  );

  for (const estado of catalog.estados ?? []) {
    insertEstado.run(estado.nombre);
    const idEstado = findEstado.get(estado.nombre).id;
    for (const municipio of estado.municipios ?? []) {
      insertMunicipio.run(municipio.nombre, idEstado);
      const idMunicipio = findMunicipio.get(municipio.nombre).id;
      for (const parroquia of municipio.parroquias ?? []) {
        insertParroquia.run(parroquia, idMunicipio);
      }
    }
  }
}

function seedAdmin(db) {
  const username = process.env.ADMIN_USERNAME ?? 'admin';

  if (db.prepare('SELECT 1 FROM usuarios WHERE username = ?').get(username)) {
    log(`el usuario "${username}" ya existe; no se modifica`);
    return null;
  }
  const generated = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD ?? randomBytes(18).toString('base64url');

  if (Buffer.byteLength(password) > 72) {
    throw new Error('ADMIN_PASSWORD supera los 72 bytes de bcrypt');
  }

  const hash = bcrypt.hashSync(password, BCRYPT_COST);
  const result = db.prepare(`
    INSERT INTO usuarios
      (username, password_hash, rol, intentos_fallidos, bloqueado_hasta, must_change_password)
    VALUES (?, ?, 'administrador', 0, NULL, 1)
  `).run(username, hash);

  const userId = Number(result.lastInsertRowid);
  log(`admin "${username}" creado (id ${userId})`);

  const raw = process.env.ADMIN_RESPUESTAS;
  if (raw) {
    const respuestas = JSON.parse(raw);
    const findPregunta = db.prepare(
      'SELECT id FROM preguntas_recuperacion WHERE pregunta = ?'
    );
    const insertRespuesta = db.prepare(`
      INSERT OR IGNORE INTO question_answer
        (id_usuario, id_pregunta, respuesta_hash)
      VALUES (?, ?, ?)
    `);

    for (const [pregunta, respuesta] of Object.entries(respuestas)) {
      const row = findPregunta.get(pregunta);
      if (!row) throw new Error(`Pregunta no sembrada en el catálogo: ${pregunta}`);
      const normalizada = String(respuesta).trim().toLowerCase();
      insertRespuesta.run(userId, row.id, bcrypt.hashSync(normalizada, BCRYPT_COST));
    }
    log(`${Object.keys(respuestas).length} respuestas de seguridad agregadas`);
  }

  return password;
}

async function main() {
  const db = openDb();
  let generatedPassword;

  try {
    const catalog = readCatalog();

    // Todo o nada: si falla el seed, no queda una DB a medias.
    db.transaction(() => {
      applyMigration(db);
      seedCatalog(db, catalog);
      generatedPassword = seedAdmin(db);
    })();
  } finally {
    db.close();
  }

  if (generatedPassword) {
    log(`CLAVE: ${generatedPassword}`);
    log('Guárdala ahora: no se vuelve a mostrar. must_change_password = 1');
  }
  log('listo');
}

main().catch((error) => {
  console.error(`[db:init] ERROR: ${error.message}`);
  process.exit(1);
});
