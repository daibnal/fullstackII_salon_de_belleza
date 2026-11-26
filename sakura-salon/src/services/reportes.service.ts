import { clienteHttp } from "../api/clienteHttp";

export type ResumenDia = {
	agendadas: number;
	atendidas: number;
	canceladas: number;
};

export type IngresosDia = {
	abonos: number;
	saldos: number;
	total: number;
};

export type FilaServicio = {
	servicio: string;
	categoria: string;
	cantidad: number;
};

export type ParticipacionCategoria = {
	categoria: string;
	porcentaje: number;
};

export type ReporteServicios = {
	servicios: FilaServicio[];
	categorias: ParticipacionCategoria[];
};

export type RendimientoProfesional = {
	profesional: string;
	citasAtendidas: number;
	ingresos: number;
};

export type Gasto = {
	id: number;
	fecha: string;
	categoria: string;
	concepto: string;
	monto: number;
};

export type FranjaDemanda = {
	dia: string;
	hora: string;
	ocupacion: number;
	baja: boolean;
};

export type ClienteAusente = {
	cliente: string;
	cantidad: number;
};

export type ReporteInasistencias = {
	noConcretadas: number;
	porcentaje: number;
	clientes: ClienteAusente[];
};

export const Reportes = {
	async dia(fecha: string): Promise<ResumenDia> {
		const { data } = await clienteHttp.get<ResumenDia>("reportes/dia", { params: { fecha } });
		return data;
	},

	async ingresos(fecha: string): Promise<IngresosDia> {
		const { data } = await clienteHttp.get<IngresosDia>("reportes/ingresos", { params: { fecha } });
		return data;
	},

	async servicios(desde: string, hasta: string): Promise<ReporteServicios> {
		const { data } = await clienteHttp.get<ReporteServicios>("reportes/servicios", { params: { desde, hasta } });
		return data;
	},

	async gastos(semana: string): Promise<Gasto[]> {
		const { data } = await clienteHttp.get<Gasto[]>("reportes/gastos", { params: { semana } });
		return Array.isArray(data) ? data : [];
	},

	async profesionales(desde: string, hasta: string): Promise<RendimientoProfesional[]> {
		const { data } = await clienteHttp.get<RendimientoProfesional[]>("reportes/profesionales", {
			params: { desde, hasta },
		});
		return Array.isArray(data) ? data : [];
	},

	async demanda(mes: string): Promise<FranjaDemanda[]> {
		const { data } = await clienteHttp.get<FranjaDemanda[]>("reportes/demanda", { params: { mes } });
		return Array.isArray(data) ? data : [];
	},

	async inasistencias(desde: string, hasta: string): Promise<ReporteInasistencias> {
		const { data } = await clienteHttp.get<ReporteInasistencias>("reportes/inasistencias", {
			params: { desde, hasta },
		});
		return data;
	},
};
