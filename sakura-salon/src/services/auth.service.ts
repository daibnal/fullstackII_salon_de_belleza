import { clienteHttp } from "../api/clienteHttp";
import type { Sesion } from "./sesion";

export type RegistroDatos = {
	nombre: string;
	apellido: string;
	telefono: string;
	correo: string;
	clave: string;
};

export const Auth = {
	async login(correo: string, clave: string): Promise<Sesion> {
		const { data } = await clienteHttp.post<Sesion>("auth/login", { correo, clave });
		return data;
	},

	async registro(datos: RegistroDatos): Promise<Sesion> {
		const { data } = await clienteHttp.post<Sesion>("auth/registro", datos);
		return data;
	},

	async logout() {
		await clienteHttp.post("auth/logout");
	},
};
