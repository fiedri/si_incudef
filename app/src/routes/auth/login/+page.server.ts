import { loginSchema } from "$lib/schemas/auth";
import { generateToken } from "$lib/server/auth/jwt";
import { verifyPassword } from "$lib/server/auth/password";
import { findUserByUsername } from "$lib/server/db/repositories/users.repositories";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      console.log(fieldErrors);
      return fail(400, {
        error: fieldErrors,
      });
    }
    const { username, password } = result.data;
    const user = await findUserByUsername(username);
    if (!user) {
      return fail(400, {
        error: { message: "Usuario o contraseña incorrectos" },
      });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return fail(400, {
        error: { message: "Usuario o contraseña incorrectos" },
      });
    }
    const token = await generateToken({
      id: user.id,
      username: user.username,
      role: user.rol,
      needConfiguration: user.mustChangePassword
    });
    event.cookies.set("session", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60*60*24//1d
    });
    throw redirect(303, "/app");
  },
} satisfies Actions;
