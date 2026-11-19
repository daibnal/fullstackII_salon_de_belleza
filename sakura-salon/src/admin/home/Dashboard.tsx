import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Chart from "chart.js/auto";
import { TarjetaDashboard } from "../components/TarjetaDashboard";
import { useAgenda } from "../../hooks/useAgenda";
import { Insumos } from "../../services/insumos.service";
import { Profesionales } from "../../services/profesionales.service";
import { Reportes } from "../../services/reportes.service";

function isoLocal(fecha: Date) {
	const mes = String(fecha.getMonth() + 1).padStart(2, "0");
	const dia = String(fecha.getDate()).padStart(2, "0");
	return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function pesos(valor: number) {
	return "$" + valor.toLocaleString("es-CL");
}

export function Dashboard() {
	const hoy = isoLocal(new Date());
	const { citas, error: errorAgenda } = useAgenda(hoy);
	const ingresosRef = useRef<HTMLCanvasElement>(null);
	const [agendadas, setAgendadas] = useState(0);
	const [ingresosHoy, setIngresosHoy] = useState(0);
	const [criticos, setCriticos] = useState(0);
	const [activos, setActivos] = useState(0);
	const [totalStaff, setTotalStaff] = useState(0);
	const [serie, setSerie] = useState<number[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		const dias = Array.from({ length: 7 }, (_, indice) => {
			const fecha = new Date();
			fecha.setDate(fecha.getDate() - (6 - indice));
			return isoLocal(fecha);
		});
		void Promise.all([
			Reportes.dia(hoy),
			Reportes.ingresos(hoy),
			Insumos.criticos(),
			Profesionales.gestion(),
			Promise.all(dias.map((fecha) => Reportes.ingresos(fecha))),
		])
			.then(([dia, ingresos, alertas, equipo, semana]) => {
				setAgendadas(dia.agendadas);
				setIngresosHoy(ingresos.total);
				setCriticos(alertas.length);
				setActivos(equipo.filter((persona) => persona.activo).length);
				setTotalStaff(equipo.length);
				setSerie(semana.map((item) => item.total));
			})
			.catch(() => setError("No se pudieron cargar los indicadores."));
	}, [hoy]);

	useEffect(() => {
		if (!ingresosRef.current || serie.length === 0) return;
		const grafico = new Chart(ingresosRef.current, {
			type: "bar",
			data: {
				labels: ["-6", "-5", "-4", "-3", "-2", "Ayer", "Hoy"],
				datasets: [{
					label: "Ingresos ($)",
					data: serie,
					backgroundColor: "rgba(165, 38, 71, 0.75)",
					borderRadius: 6,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: {
						beginAtZero: true,
						ticks: { callback: (value) => "$" + Number(value) / 1000 + "k" },
					},
				},
			},
		});
		return () => grafico.destroy();
	}, [serie]);

	const resumen = [
		{ icono: "bi-calendar-check", titulo: "Citas Hoy", valor: String(agendadas), detalle: "Según el reporte del día", claseDetalle: "text-muted" },
		{ icono: "bi-currency-dollar", titulo: "Ingresos (Día)", valor: pesos(ingresosHoy), detalle: "Abonos y saldos", claseDetalle: "text-muted" },
		{ icono: "bi-box-seam", titulo: "Alertas Stock", valor: String(criticos), detalle: "Insumos en nivel crítico", claseDetalle: "text-danger", claseValor: criticos > 0 ? "text-danger" : undefined },
		{ icono: "bi-people", titulo: "Staff Activo", valor: `${activos}/${totalStaff}`, detalle: "Profesionales activos", claseDetalle: "text-muted" },
	];

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Dashboard</h2>
				<Link to="/admin/agenda?modal=cita" className="btn btn-custom-primary w-auto">
					<i className="bi bi-plus-lg me-2"></i>Nueva Cita
				</Link>
			</div>

			{(error || errorAgenda) && <p className="text-danger">No se pudo cargar parte del panel.</p>}

			<div className="row g-4 mb-5">
				{resumen.map((item) => (
					<div className="col-12 col-sm-6 col-lg-3" key={item.titulo}>
						<TarjetaDashboard {...item} />
					</div>
				))}
			</div>

			<div className="row g-4">
				<div className="col-12 col-lg-8">
					<div className="sketch-card">
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h4 className="card-title-custom m-0">Citas de hoy</h4>
							<Link to="/admin/agenda" className="text-decoration-none" style={{ color: "var(--color-secondary)" }}>
								Ver calendario
							</Link>
						</div>
						<div className="table-responsive">
							<table className="table table-hover align-middle">
								<thead style={{ borderBottom: "2px solid var(--color-accent)" }}>
									<tr>
										<th>Hora</th>
										<th>Cliente</th>
										<th>Servicio</th>
										<th>Profesional</th>
										<th>Estado</th>
									</tr>
								</thead>
								<tbody>
									{citas.map((cita) => (
										<tr key={`${cita.id}-${cita.horaInicio}`}>
											<td>{cita.horaInicio.slice(0, 5)}</td>
											<td>{cita.nombreCliente}</td>
											<td>{cita.nombreServicio}</td>
											<td>{cita.nombreProfesional}</td>
											<td><span className="badge bg-light text-dark border">{cita.estado}</span></td>
										</tr>
									))}
									{citas.length === 0 && (
										<tr><td colSpan={5} className="text-muted">No hay citas para hoy.</td></tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="col-12 col-lg-4">
					<div className="sketch-card">
						<h4 className="card-title-custom mb-3">Acciones Rápidas</h4>
						<div className="d-grid gap-2">
							<Link to="/admin/servicios?modal=crear" className="btn btn-outline-secondary text-start" style={{ borderColor: "var(--color-accent)", color: "var(--color-primary)" }}>
								<i className="bi bi-scissors me-2"></i> Nuevo servicio
							</Link>
							<Link to="/admin/personal?modal=crear" className="btn btn-outline-secondary text-start" style={{ borderColor: "var(--color-accent)", color: "var(--color-primary)" }}>
								<i className="bi bi-person-plus me-2"></i> Nuevo empleado
							</Link>
							<Link to="/admin/insumos?modal=crear" className="btn btn-outline-secondary text-start" style={{ borderColor: "var(--color-accent)", color: "var(--color-primary)" }}>
								<i className="bi bi-cart-plus me-2"></i> Añadir insumo
							</Link>
						</div>
						<hr className="my-4" style={{ borderColor: "var(--color-accent)" }} />
						<h4 className="card-title-custom mb-3">Ingresos de la semana</h4>
						<div className="chart-container" style={{ height: 180 }}>
							<canvas ref={ingresosRef}></canvas>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
