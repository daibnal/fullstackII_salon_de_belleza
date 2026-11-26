import { clienteHttp } from "../api/clienteHttp";
import type { Sesion } from "./sesion";

export type RegistroDatos = {
	nombre: string;
	apellido: string;
	rut: string;
	telefono: string;
	correo: string;
	clave: string;
};

export type PerfilDatos = {
	nombre: string;
	apellido: string;
	rut?: string;
	telefono: string;
	correo: string;
};

export const Auth = {
	async login(correo: string, clave: string): Promise<Sesion> {
		const { data } = await clienteHttp.post<Sesion>("auth/login", { correo, clave });
		return data;
	},

	async sesion(token: string): Promise<PerfilDatos & { id: number; rol: string }> {
		const { data } = await clienteHttp.get<PerfilDatos & { id: number; rol: string }>(`usuarios/sesion/${token}`);
		return data;
	},

	async actualizarPerfil(datos: { nombre: string; apellido: string; telefono: string; rut: string }) {
		const { data } = await clienteHttp.put<PerfilDatos>("usuarios/perfil", datos);
		return data;
	},

	async crearProfesional(datos: { nombre: string; correo: string; telefono: string; clave: string }) {
		const { data } = await clienteHttp.post<{ id: number }>("usuarios/profesional", datos);
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
