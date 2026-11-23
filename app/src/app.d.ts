declare module "datatables.net-buttons-dt";
declare module "datatables.net-buttons";
declare module "datatables.net-buttons/js/buttons.html5.mjs";
declare module "datatables.net-buttons/js/buttons.print.mjs";
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
import type { ConfigButtons } from 'datatables.net-buttons';

declare module 'datatables.net' {
  interface Feature {
    buttons?: ConfigButtons | string[];
  }
}

export {};
