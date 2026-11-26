import { clienteHttp } from "../api/clienteHttp";

export type Reserva = {
	id: number;
	idCliente: number | null;
	correoCliente: string;
	nombreCliente: string;
	telefonoCliente?: string | null;
	servicioId: number;
	nombreServicio: string;
	duracionMinutos: number;
	nombreCategoria: string;
	profesionalId: number;
	nombreProfesional: string;
	fecha: string;
	horaInicio: string;
	horaFin: string;
	estado: string;
	montoTotal: number;
	montoAbono: number;
	montoPagado: number;
	expiraEn?: string | null;
	prestaciones?: PrestacionReserva[];
};

export type PrestacionReserva = {
	id: number;
	orden: number;
	servicioId: number;
	nombreServicio: string;
	nombreCategoria?: string;
	nombreProfesional: string;
	profesionalId: number;
	horaInicio: string;
	horaFin: string;
	iniciada: boolean;
};

export type LineaPrestacion = {
	servicioId: number;
	profesionalId: number;
};

export type ResultadoReserva = {
	reserva: Reserva;
	generadas: Reserva[];
	fechasOmitidas: string[];
};

export type Hueco = {
	horaInicio: string;
	horaFin: string;
};

export type InvitadoReserva = {
	nombre: string;
	apellido: string;
	correo: string;
	telefono: string;
	servicioId?: number;
	profesionalId?: number;
	prestaciones?: LineaPrestacion[];
	fecha: string;
	horaInicio: string;
};

export type TurnosDia = {
	profesionalId: number;
	nombre: string;
	reservas: Reserva[];
};

export type LineaConsumo = {
	insumoId: number;
	usos: number;
};

export const Reservas = {
	async disponibilidad(profesionalId: number, servicioId: number, fecha: string): Promise<Hueco[]> {
		const { data } = await clienteHttp.get<Hueco[]>("reservas/disponibilidad", {
			params: { profesionalId, servicioId, fecha },
		});
		return Array.isArray(data) ? data : [];
	},

	async crearInvitado(datos: InvitadoReserva): Promise<ResultadoReserva> {
		const { data } = await clienteHttp.post<ResultadoReserva>("reservas/invitado", datos);
		return data;
	},

	async crear(datos: InvitadoReserva): Promise<ResultadoReserva> {
		const { data } = await clienteHttp.post<ResultadoReserva>("reservas", datos);
		return data;
	},

	async mias(): Promise<Reserva[]> {
		const { data } = await clienteHttp.get<Reserva[]>("reservas/mias");
		return Array.isArray(data) ? data : [];
	},

	async misTurnos(fecha: string): Promise<TurnosDia> {
		const { data } = await clienteHttp.get<TurnosDia>("reservas/mis-turnos", { params: { fecha } });
		return data;
	},

	async comenzar(reservaId: number, prestacionId: number, lineas: LineaConsumo[]): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${reservaId}/prestaciones/${prestacionId}/comenzar`, {
			lineas,
		});
		return data;
	},

	async agenda(fecha: string, vista = "dia"): Promise<Reserva[]> {
		const { data } = await clienteHttp.get<Reserva[]>("reservas/agenda", {
			params: { vista, fecha },
		});
		return Array.isArray(data) ? data : [];
	},

	async cancelar(id: number): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/cancelar`);
		return data;
	},

	async cancelarMia(id: number, motivo = "Cancelada por el cliente"): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/cancelar-cliente`, { motivo });
		return data;
	},

	async asistencia(id: number): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/asistencia`);
		return data;
	},

	async pagarAbono(id: number): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/pagos/abono`);
		return data;
	},

	async pagoManual(id: number): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/pagos/manual`);
		return data;
	},

	async saldo(id: number): Promise<Reserva> {
		const { data } = await clienteHttp.post<Reserva>(`reservas/${id}/saldo`);
		return data;
	},
};
