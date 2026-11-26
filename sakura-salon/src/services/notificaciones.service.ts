import { clienteHttp } from "../api/clienteHttp";

export type Notificacion = {
	id: number;
	reservaId: number;
	tipo: string;
	mensaje: string;
	creadaEn: string;
};

export const Notificaciones = {
	async listar(): Promise<Notificacion[]> {
		const { data } = await clienteHttp.get<Notificacion[]>("notificaciones");
		return Array.isArray(data) ? data : [];
	},
};
