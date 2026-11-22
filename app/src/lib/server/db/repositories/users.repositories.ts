import { eq } from "drizzle-orm";
import { db as defaultDb } from "..";
import * as schema from "../schemas";
import type { role } from "$lib/server/auth/guards";


export async function findUserByUsername(username: string, db = defaultDb) {
  const [user] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.username, username));
  return user ?? null
}

export async function createUser(username: string, passwordHash: string, role: role, db=defaultDb){
  return await db.insert(schema.usuarios).values({ username, passwordHash, rol: role}).returning()
}
