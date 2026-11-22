import { verifyToken } from "$lib/server/auth/jwt";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  const session = event.cookies.get("session");
  if (!session) {
    event.locals.user = null;
    return await resolve(event);
  }
  const user = await verifyToken(session);
  if (user) {
    event.locals.user = {
      id: user?.id,
      username: user?.username,
      role: user?.role,
    };
  } else {
    // Token inválido o expirado: limpiamos la cookie
      event.cookies.delete("session", { path: "/" });
    event.locals.user = null;
  }
  if (event.url.pathname === "/auth/login" && event.locals.user) {
    throw redirect(302, "/app");
  }
  return await resolve(event);
}
