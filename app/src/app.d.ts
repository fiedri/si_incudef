// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
export interface SessionUser {
	id: string;
	username: string;
	role: 'administrador' | 'operador';
}

declare global {
	namespace App {
		interface Locals {
			user: SessionUser | null;
		}
	}
}

export {};
