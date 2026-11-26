import { clienteHttp } from "../api/clienteHttp";

export type Profesional = {
	id: number;
	nombre: string;
	correo: string;
	telefono: string;
	especialidad: string;
	activo: boolean;
	usuarioId?: number | null;
};

export type Turno = {
	id?: number;
	diaSemana: number;
	horaInicio: string;
	horaFin: string;
};

export type Ausencia = {
	id?: number;
	fechaInicio: string;
	fechaFin: string;
	motivo: string;
};

export type ProfesionalPayload = Omit<Profesional, "id">;

export const Profesionales = {
	async listar(): Promise<Profesional[]> {
		const { data } = await clienteHttp.get<Profesional[]>("profesionales");
		return Array.isArray(data) ? data : [];
	},

	async gestion(): Promise<Profesional[]> {
		const { data } = await clienteHttp.get<Profesional[]>("profesionales/gestion");
		return Array.isArray(data) ? data : [];
	},

	async crear(datos: ProfesionalPayload): Promise<Profesional> {
		const { data } = await clienteHttp.post<Profesional>("profesionales", datos);
		return data;
	},

	async actualizar(id: number, datos: ProfesionalPayload): Promise<Profesional> {
		const { data } = await clienteHttp.put<Profesional>(`profesionales/${id}`, datos);
		return data;
	},

	async eliminar(id: number): Promise<void> {
		await clienteHttp.delete(`profesionales/${id}`);
	},

	async vincularAcceso(id: number, usuarioId: number): Promise<Profesional> {
		const { data } = await clienteHttp.put<Profesional>(`profesionales/${id}/acceso`, { usuarioId });
		return data;
	},

	async servicios(id: number): Promise<{ id: number; nombre: string }[]> {
		const { data } = await clienteHttp.get<{ id: number; nombre: string }[]>(`profesionales/${id}/servicios`);
		return Array.isArray(data) ? data : [];
	},

	async turnos(id: number): Promise<Turno[]> {
		const { data } = await clienteHttp.get<Turno[]>(`profesionales/${id}/turnos`);
		return Array.isArray(data) ? data : [];
	},

	async agregarTurno(id: number, turno: Turno): Promise<Turno> {
		const { data } = await clienteHttp.post<Turno>(`profesionales/${id}/turnos`, turno);
		return data;
	},

	async ausencias(id: number): Promise<Ausencia[]> {
		const { data } = await clienteHttp.get<Ausencia[]>(`profesionales/${id}/ausencias`);
		return Array.isArray(data) ? data : [];
	},

	async agregarAusencia(id: number, ausencia: Ausencia): Promise<Ausencia> {
		const { data } = await clienteHttp.post<Ausencia>(`profesionales/${id}/ausencias`, ausencia);
		return data;
	},
};
