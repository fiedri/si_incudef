import { redirect, type Actions } from "@sveltejs/kit";
export const actions: Actions = {
  default: async (event) => {
    event.cookies.delete('session', { path: '/' });
    event.locals.user = null
		throw redirect(303, '/auth/login');
  },
};
