import { clienteHttp } from "../api/clienteHttp";

export type Insumo = {
	id: number;
	nombre: string;
	categoria: string;
	unidadMedida: string;
	stock: number;
	stockMinimo: number;
	usosPorUnidad: number;
	usosConsumidos?: number;
	usosRestantes?: number;
	activo: boolean;
	estado?: string;
};

export type InsumoPayload = {
	nombre: string;
	categoria: string;
	unidadMedida: string;
	stock: number;
	stockMinimo: number;
	usosPorUnidad: number;
	activo: boolean;
};

export function usosRestantesDe(item: Insumo): number {
	if (typeof item.usosRestantes === "number" && Number.isFinite(item.usosRestantes)) {
		return item.usosRestantes;
	}
	const porUnidad = item.usosPorUnidad > 0 ? item.usosPorUnidad : 0;
	const consumidos = item.usosConsumidos ?? 0;
	return Math.max(0, item.stock * porUnidad - consumidos);
}

export function esCritico(item: Insumo): boolean {
	return item.estado === "CRITICO" || item.stock <= item.stockMinimo;
}

export const Insumos = {
	async listar(): Promise<Insumo[]> {
		const { data } = await clienteHttp.get<Insumo[]>("insumos");
		return Array.isArray(data) ? data : [];
	},

	async paraCita(categoria: string): Promise<Insumo[]> {
		const { data } = await clienteHttp.get<Insumo[]>("insumos", { params: { categoria } });
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

	async receta(servicioId: number): Promise<RecetaLinea[]> {
		const { data } = await clienteHttp.get<RecetaLinea[]>(`insumos/servicio/${servicioId}`);
		return Array.isArray(data) ? data : [];
	},

	async guardarReceta(servicioId: number, lineas: { insumoId: number; cantidad: number }[]): Promise<RecetaLinea[]> {
		const { data } = await clienteHttp.put<RecetaLinea[]>(`insumos/servicio/${servicioId}`, lineas);
		return Array.isArray(data) ? data : [];
	},
};

export type RecetaLinea = {
	id: number;
	servicioId: number;
	insumo: Insumo;
	cantidad: number;
};
