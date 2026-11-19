import { clienteHttp } from "../api/clienteHttp";

export type Insumo = {
	id: number;
	nombre: string;
	categoria: string;
	unidadMedida: string;
	stock: number;
	stockMinimo: number;
	activo: boolean;
	estado?: string;
};

export type InsumoPayload = Omit<Insumo, "id" | "estado">;

export const Insumos = {
	async listar(): Promise<Insumo[]> {
		const { data } = await clienteHttp.get<Insumo[]>("insumos");
		return Array.isArray(data) ? data : [];
	},

	async criticos(): Promise<Insumo[]> {
		const { data } = await clienteHttp.get<Insumo[]>("insumos/criticos");
		return Array.isArray(data) ? data : [];
	},

	async crear(datos: InsumoPayload): Promise<Insumo> {
		const { data } = await clienteHttp.post<Insumo>("insumos", datos);
		return data;
	},

	async actualizar(id: number, datos: InsumoPayload): Promise<Insumo> {
		const { data } = await clienteHttp.put<Insumo>(`insumos/${id}`, datos);
		return data;
	},

	async eliminar(id: number): Promise<void> {
		await clienteHttp.delete(`insumos/${id}`);
	},

	async movimiento(id: number, tipo: "ENTRADA" | "SALIDA", cantidad: number): Promise<Insumo> {
		const { data } = await clienteHttp.post<Insumo>(`insumos/${id}/movimientos`, { tipo, cantidad });
		return data;
	},
};
