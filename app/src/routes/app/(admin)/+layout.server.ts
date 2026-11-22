import { requireRole } from "$lib/server/auth/guards"
import type { Load } from "@sveltejs/kit"

export const load: Load = (event) => {
  const user = requireRole(event, 'administrador')
  return { user }
}
