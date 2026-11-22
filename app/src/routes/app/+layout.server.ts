import { redirect } from "@sveltejs/kit";
import type { Load } from "@sveltejs/kit";

export const load: Load = ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/auth/login");
  }
  return {
    user: locals.user,
  };
};
