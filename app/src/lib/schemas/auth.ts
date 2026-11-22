import { z } from 'zod'

const usernameField = z
  .string({ required_error: 'El nombre de usuario es obligatorio' })
  .trim()
  .toLowerCase()
  .min(1, { message: 'El nombre de usuario es obligatorio' })
  .max(128, { message: 'El nombre de usuario es demasiado largo' })

const passwordField = z
  .string({ required_error: 'La contraseña es obligatoria' })
  .min(1, { message: 'La contraseña es obligatoria' })
  .refine((value) => new TextEncoder().encode(value).length <= 72, {
    message: 'La contraseña es demasiado larga.'
  })

export const loginSchema = z.object({
  username: usernameField,
  password: passwordField
})

export const roleSchema = z.enum(['operador', 'administrador'], {
  errorMap: () => ({ message: 'El rol debe ser operador o administrador' })
})

export const createUserSchema = z.object({
  username: usernameField,
  role: z.enum(['operador', 'administrador'], {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  }),
  password: passwordField
})
