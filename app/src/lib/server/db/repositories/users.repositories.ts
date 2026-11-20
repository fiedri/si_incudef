import { eq } from "drizzle-orm";
import { db as defaultDb } from "..";
import * as schema from "../schemas";

export async function findUserByUsername(username: string, db = defaultDb) {
  const [user] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.username, username));
  return user ?? null
}
