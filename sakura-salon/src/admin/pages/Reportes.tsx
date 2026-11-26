import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { TarjetaMetrica } from "../components/TarjetaMetrica";
import {
	Reportes as ReportesApi,
	type ClienteAusente,
	type FranjaDemanda,
	type Gasto,
	type ParticipacionCategoria,
	type RendimientoProfesional,
} from "../../services/reportes.service";

function isoLocal(fecha: Date) {
	const mes = String(fecha.getMonth() + 1).padStart(2, "0");
	const dia = String(fecha.getDate()).padStart(2, "0");
	return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function pesos(valor: number) {
	return "$" + valor.toLocaleString("es-CL");
}

function diasEntre(desde: string, hasta: string) {
	const fechas: string[] = [];
	const cursor = new Date(`${desde}T12:00:00`);
	const fin = new Date(`${hasta}T12:00:00`);
	while (cursor <= fin) {
		fechas.push(isoLocal(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}
	return fechas;
}

export function Reportes() {
	const ingresosRef = useRef<HTMLCanvasElement>(null);
	const categoriasRef = useRef<HTMLCanvasElement>(null);
	const hoy = new Date();
	const hasta = isoLocal(hoy);
	const desde = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;
	const [ingresosMes, setIngresosMes] = useState(0);
	const [serviciosHechos, setServiciosHechos] = useState(0);
	const [gastos, setGastos] = useState<Gasto[]>([]);
	const [equipo, setEquipo] = useState<RendimientoProfesional[]>([]);
	const [categorias, setCategorias] = useState<ParticipacionCategoria[]>([]);
	const [serieIngresos, setSerieIngresos] = useState<number[]>([]);
	const [serieCitas, setSerieCitas] = useState<number[]>([]);
	const [demanda, setDemanda] = useState<FranjaDemanda[]>([]);
	const [ausentes, setAusentes] = useState<ClienteAusente[]>([]);
	const [inasistencias, setInasistencias] = useState(0);
	const [avisos, setAvisos] = useState<string[]>([]);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		const dias = Array.from({ length: 7 }, (_, indice) => {
			const fecha = new Date();
			fecha.setDate(fecha.getDate() - (6 - indice));
			return isoLocal(fecha);
		});
		const mes = diasEntre(desde, hasta);
		const fallos: string[] = [];
		const tomar = async <T,>(etiqueta: string, promesa: Promise<T>, vacio: T): Promise<T> => {
			try {
				return await promesa;
			} catch {
				fallos.push(etiqueta);
				return vacio;
			}
		};
		setCargando(true);
		void Promise.all([
			tomar("servicios", ReportesApi.servicios(desde, hasta), { servicios: [], categorias: [] }),
			tomar("gastos", ReportesApi.gastos(hasta), [] as Gasto[]),
			tomar("profesionales", ReportesApi.profesionales(desde, hasta), [] as RendimientoProfesional[]),
			tomar("demanda", ReportesApi.demanda(desde), [] as FranjaDemanda[]),
			tomar("ingresos del mes", Promise.all(mes.map((fecha) => ReportesApi.ingresos(fecha))), []),
			tomar("ingresos de la semana", Promise.all(dias.map((fecha) => ReportesApi.ingresos(fecha))), []),
			tomar("citas de la semana", Promise.all(dias.map((fecha) => ReportesApi.dia(fecha))), []),
			tomar("inasistencias", ReportesApi.inasistencias(desde, hasta), { noConcretadas: 0, porcentaje: 0, clientes: [] }),
		]).then(([servicios, gastosSemana, rendimiento, franjas, ingresosMesDias, ingresosSemana, diasReporte, ausencias]) => {
			setServiciosHechos(servicios.servicios.reduce((suma, fila) => suma + fila.cantidad, 0));
			setCategorias(servicios.categorias);
			setGastos(gastosSemana);
			setEquipo(rendimiento);
			setIngresosMes(ingresosMesDias.reduce((suma, item) => suma + item.total, 0));
			setDemanda(franjas.filter((fila) => fila.ocupacion > 0).slice(0, 8));
			setSerieIngresos(ingresosSemana.map((item) => item.total));
			setSerieCitas(diasReporte.map((item) => item.atendidas));
			setInasistencias(ausencias.noConcretadas);
			setAusentes(ausencias.clientes ?? []);
			setAvisos(fallos);
			setCargando(false);
		});
	}, [desde, hasta]);

	useEffect(() => {
		if (!ingresosRef.current || !categoriasRef.current || serieIngresos.length === 0) return;
		const ingresos = new Chart(ingresosRef.current, {
			type: "bar",
			data: {
				labels: ["-6", "-5", "-4", "-3", "-2", "Ayer", "Hoy"],
				datasets: [
					{
						label: "Ingresos ($)",
						data: serieIngresos,
						backgroundColor: "rgba(232, 67, 147, 0.7)",
						borderRadius: 6,
						order: 2,
					},
					{
						label: "Citas atendidas",
						data: serieCitas,
						type: "line",
						borderColor: "#2C3E50",
						backgroundColor: "#2C3E50",
						borderWidth: 2,
						tension: 0.3,
						yAxisID: "y1",
						order: 1,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: { beginAtZero: true, position: "left" },
					y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false } },
				},
				plugins: { legend: { position: "top" } },
			},
		});
		const torta = new Chart(categoriasRef.current, {
			type: "doughnut",
			data: {
				labels: categorias.map((item) => item.categoria),
				datasets: [{
					data: categorias.map((item) => item.porcentaje),
					backgroundColor: ["#2C3E50", "#E84393", "#FFB8D2", "#F0A6A8", "#590D1F"],
					borderWidth: 0,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: "70%",
				plugins: { legend: { position: "bottom" } },
			},
		});
		return () => {
			ingresos.destroy();
			torta.destroy();
		};
	}, [serieIngresos, serieCitas, categorias]);

	const costo = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
	const ticket = serviciosHechos > 0 ? Math.round(ingresosMes / serviciosHechos) : 0;
	const nombreMes = hoy.toLocaleDateString("es-CL", { month: "long" });
	const resumen = [
		{ icono: "bi-cash-coin", claseIcono: "bg-success-subtle text-success", etiqueta: "Ingresos del mes", valor: pesos(ingresosMes), detalle: `${desde} a ${hasta}`, claseDetalle: "text-muted" },
		{ icono: "bi-receipt", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Servicios realizados", valor: String(serviciosHechos), detalle: "En el mes en curso", claseDetalle: "text-muted" },
		{ icono: "bi-tags", claseIcono: "bg-info-subtle text-info", etiqueta: "Ticket promedio", valor: pesos(ticket), detalle: "Ingreso / servicio", claseDetalle: "text-muted" },
		{ icono: "bi-cart-x", claseIcono: "bg-danger-subtle text-danger", etiqueta: "Gastos de la semana", valor: pesos(costo), detalle: `${gastos.length} movimientos`, claseDetalle: "text-danger" },
	];

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<div>
					<h2 className="fw-bold m-0 text-capitalize" style={{ color: "var(--color-primary)" }}>Mes actual: {nombreMes}</h2>
					<p className="text-muted small mb-0">Datos de ms-reporte del {desde} al {hasta}</p>
				</div>
			</div>
			{cargando && <p className="text-muted">Cargando reportes...</p>}
			{avisos.length > 0 && (
				<p className="text-danger">No se pudo cargar: {avisos.join(", ")}.</p>
			)}

			<h4 className="fw-bold mb-3 mt-4" style={{ color: "var(--color-primary)", borderBottom: "2px solid var(--color-accent)", paddingBottom: 10 }}>
				Rendimiento financiero
			</h4>
			<div className="row g-4 mb-4">
				{resumen.map((item) => (
					<div className="col-12 col-sm-6 col-xl-3" key={item.etiqueta}>
						<TarjetaMetrica {...item} />
					</div>
				))}
			</div>

			<div className="row g-4 mb-5">
				<div className="col-12 col-lg-8">
					<div className="sketch-card">
						<h5 className="fw-bold mb-4 text-dark">Evolución de ingresos y citas (últimos 7 días)</h5>
						<div className="chart-container">
							<canvas ref={ingresosRef}></canvas>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-4">
					<div className="sketch-card">
						<h5 className="fw-bold mb-4 text-dark">Distribución por categoría</h5>
						<div className="chart-container d-flex justify-content-center" style={{ height: 250 }}>
							<canvas ref={categoriasRef}></canvas>
						</div>
					</div>
				</div>
			</div>

			<h4 className="fw-bold mb-3" style={{ color: "var(--color-primary)", borderBottom: "2px solid var(--color-accent)", paddingBottom: 10 }}>
				Demanda y equipo
			</h4>
			<div className="row g-4">
				<div className="col-12 col-lg-7">
					<div className="sketch-card">
						<h5 className="fw-bold mb-3 text-dark">Franjas con ocupación</h5>
						<div className="table-responsive">
							<table className="table table-sm align-middle">
								<thead className="table-light">
									<tr>
										<th>Día</th>
										<th>Hora</th>
										<th>Ocupación</th>
										<th>Estado</th>
									</tr>
								</thead>
								<tbody>
									{demanda.map((fila) => (
										<tr key={`${fila.dia}-${fila.hora}`}>
											<td>{fila.dia}</td>
											<td>{fila.hora}</td>
											<td>{fila.ocupacion}</td>
											<td>
												<span className={fila.baja ? "badge bg-warning text-dark" : "badge bg-success"}>
													{fila.baja ? "Baja" : "Alta"}
												</span>
											</td>
										</tr>
									))}
									{demanda.length === 0 && (
										<tr><td colSpan={4} className="text-muted">Sin ocupación registrada este mes.</td></tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-5">
					<div className="sketch-card">
						<h5 className="fw-bold mb-3 text-dark">Rendimiento del equipo</h5>
						<ul className="list-unstyled mb-0">
							{equipo.map((fila) => (
								<li key={fila.profesional} className="d-flex justify-content-between border-bottom py-2">
									<span>{fila.profesional}</span>
									<span>{fila.citasAtendidas} citas · {pesos(fila.ingresos)}</span>
								</li>
							))}
							{equipo.length === 0 && <li className="text-muted">Sin atenciones en el mes.</li>}
						</ul>
					</div>
				</div>
			</div>

			<div className="sketch-card">
				<h5 className="fw-bold mb-3 text-dark">Inasistencias del período</h5>
				<p className="mb-3">{inasistencias} citas no concretadas.</p>
				<ul className="list-unstyled mb-0">
					{ausentes.map((fila) => (
						<li key={fila.cliente} className="d-flex justify-content-between border-bottom py-2">
							<span>{fila.cliente}</span>
							<span>{fila.cantidad}</span>
						</li>
					))}
					{ausentes.length === 0 && <li className="text-muted">Sin inasistencias registradas.</li>}
				</ul>
			</div>
		</>
	);
}
