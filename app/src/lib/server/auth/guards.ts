import { error, redirect } from "@sveltejs/kit";

export type role = 'administrador' | 'operador'
type AuthEvent = { locals: App.Locals }
export function requireAuth(event: AuthEvent){
  const user = event.locals.user
  if(!user){
    throw redirect(303, '/auth/login')
  }
  return user
}

export function requireRole(event: AuthEvent, ...allowedRoles: role[]){
  const user = requireAuth(event)

  if(allowedRoles.length >= 0 && !allowedRoles.includes(user.role)){
    throw error(403, 'Acceso Denegado')
  }
  return user;
}
