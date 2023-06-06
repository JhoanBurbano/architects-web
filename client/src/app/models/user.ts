export class Usuario {
	constructor(
		public name: string,
		public lastname: string,
		public number: number,
		public email: string,
		public password: string,
		public rol: string
	) {}
}

export class UsuarioLogin {
	constructor(public email: string, public password: string) {}
}

export interface JwtResponseI {
	dataUser: {
		id: string;
		name: string;
		email: string;
		rol:string,
		auth: {
			token: string;
			expiresIn: string;
		}
	};
}

export interface UserI {
	profile?:string | null,
	description?:string | null,
	name: string;
	lastname: string;
	rol:string;
	number: number;
	email: string;
	password?: string;
}

export interface LoginI {
	email: string;
	password: string;
}

export interface authentificated{
	agree: boolean
}

export interface ImageDimensions {
	w: number;
	h: number;
  }