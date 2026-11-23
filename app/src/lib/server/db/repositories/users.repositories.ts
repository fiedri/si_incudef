import { eq, sql } from "drizzle-orm";
import { db as defaultDb } from "..";
import * as schema from "../schemas";
import type { role } from "$lib/server/auth/guards";

export async function findUserByUsername(username: string, db = defaultDb) {
  const [user] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.username, username));
  return user ?? null;
}

export async function findUserById(id: number, db = defaultDb) {
  const [user] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.id, id));
  return user ?? null;
}

export async function createUser(
  username: string,
  passwordHash: string,
  role: role,
  db = defaultDb
) {
  return await db
    .insert(schema.usuarios)
    .values({ username, passwordHash, rol: role })
    .returning();
}

export async function countAdmins(db = defaultDb) {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.usuarios)
    .where(eq(schema.usuarios.rol, "administrador"));
  return Number(row?.count ?? 0);
}

export async function getAllUsers(db = defaultDb) {
  return await db
    .select({
      id: schema.usuarios.id,
      "Nombre de usuario": schema.usuarios.username,
      Role: schema.usuarios.rol,
    })
    .from(schema.usuarios);
}

export async function updateUserRole(id: number, role: role, db = defaultDb) {
  return await db
    .update(schema.usuarios)
    .set({ rol: role })
    .where(eq(schema.usuarios.id, id))
    .returning({
      id: schema.usuarios.id,
      username: schema.usuarios.username,
      rol: schema.usuarios.rol,
    });
}

export async function deleteUserById(id: number, db = defaultDb) {
  return await db
    .delete(schema.usuarios)
    .where(eq(schema.usuarios.id, id))
    .returning({ id: schema.usuarios.id });
}
