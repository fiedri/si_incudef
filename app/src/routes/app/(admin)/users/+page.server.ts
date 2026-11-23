import { fail } from "@sveltejs/kit";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { requireRole } from "$lib/server/auth/guards";
import { createUserSchema } from "$lib/schemas/auth";
import { hashPassword } from "$lib/server/auth/password";
import {
  countAdmins,
  createUser,
  deleteUserById,
  findUserById,
  findUserByUsername,
  getAllUsers,
  updateUserRole,
} from "$lib/server/db/repositories/users.repositories";

const idSchema = z.coerce.number().int().positive();
const roleSchema = z.enum(["operador", "administrador"], {
  errorMap: () => ({ message: "Selecciona un rol válido" }),
});

function readId(formData: FormData) {
  const result = idSchema.safeParse(formData.get("id"));
  return result.success ? result.data : null;
}

function isSelf(id: number, currentUser: { id: unknown }) {
  return String(id) === String(currentUser.id);
}

export const actions = {
  save: async (event) => {
    requireRole(event, "administrador");
    const formData = Object.fromEntries(await event.request.formData());
    const result = createUserSchema.safeParse(formData);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      return fail(400, { error: fieldErrors });
    }

    const { username, password, role } = result.data;
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return fail(400, {
        error: { username: ["El nombre de usuario ya está en uso"] },
      });
    }

    const passwordHash = await hashPassword(password);
    await createUser(username, passwordHash, role);
    return {
      success: true,
      username,
      notification: `Usuario ${username} creado correctamente.`,
    };
  },

  update: async (event) => {
    const currentUser = requireRole(event, "administrador");
    const formData = await event.request.formData();
    const id = readId(formData);
    const roleResult = roleSchema.safeParse(formData.get("role"));
    if (id === null || !roleResult.success) {
      return fail(400, {
        error: {
          ...(id === null ? { id: ["Identificador no válido"] } : {}),
          ...(!roleResult.success ? { role: ["Selecciona un rol válido"] } : {}),
        },
      });
    }
    if (isSelf(id, currentUser)) {
      return fail(400, { error: { id: ["No puede cambiar su propio rol"] } });
    }

    const target = await findUserById(id);
    if (!target) {
      return fail(404, { error: { id: ["El usuario ya no existe"] } });
    }
    if (
      target.rol === "administrador" &&
      roleResult.data !== "administrador" &&
      (await countAdmins()) <= 1
    ) {
      return fail(400, {
        error: { id: ["No puede degradar al último administrador"] },
      });
    }

    const [updated] = await updateUserRole(id, roleResult.data);
    if (!updated) {
      return fail(404, { error: { id: ["El usuario ya no existe"] } });
    }

    return {
      success: true,
      username: updated.username,
      notification: `Rol de ${updated.username} actualizado correctamente.`,
    };
  },

  remove: async (event) => {
    const currentUser = requireRole(event, "administrador");
    const formData = await event.request.formData();
    const id = readId(formData);
    if (id === null) {
      return fail(400, { error: { id: ["Identificador no válido"] } });
    }
    if (isSelf(id, currentUser)) {
      return fail(400, {
        error: { id: ["No puede eliminar su propio usuario"] },
      });
    }

    const target = await findUserById(id);
    if (!target) {
      return fail(404, { error: { id: ["El usuario ya no existe"] } });
    }
    if (target.rol === "administrador" && (await countAdmins()) <= 1) {
      return fail(400, {
        error: { id: ["No puede eliminar al último administrador"] },
      });
    }

    const [removed] = await deleteUserById(id);
    if (!removed) {
      return fail(404, { error: { id: ["El usuario ya no existe"] } });
    }

    return {
      success: true,
      notification: "Usuario eliminado correctamente.",
    };
  },
} satisfies Actions;

export const load: PageServerLoad = async ({ depends }) => {
  depends("app:users");
  return { allUsers: await getAllUsers() };
};
