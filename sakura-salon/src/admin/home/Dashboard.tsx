import { useEffect, useRef } from "react";
import { Link } from "react-router";
import Chart from "chart.js/auto";
import { TarjetaDashboard } from "../components/TarjetaDashboard";

const resumen = [
	{ icono: "bi-calendar-check", titulo: "Citas Hoy", valor: "12", detalle: "2 más que ayer", claseDetalle: "text-success", iconoDetalle: "bi-arrow-up-short" },
	{ icono: "bi-currency-dollar", titulo: "Ingresos (Día)", valor: "$245k", detalle: "Actualizado hace 10 min", claseDetalle: "text-muted" },
	{ icono: "bi-box-seam", titulo: "Alertas Stock", valor: "3", detalle: "Insumos por agotarse", claseDetalle: "text-danger", claseValor: "text-danger" },
	{ icono: "bi-people", titulo: "Staff Activo", valor: "5/6", detalle: "Turno mañana", claseDetalle: "text-muted" },
];

const citas = [
	{ hora: "10:00 AM", cliente: "Ana García", servicio: "Corte y Brushing", profesional: "María", estado: "Pendiente", clase: "badge bg-warning text-dark" },
	{ hora: "11:30 AM", cliente: "Valentina Soto", servicio: "Manicura Permanente", profesional: "Camila", estado: "Confirmada", clase: "badge bg-success" },
	{ hora: "12:15 PM", cliente: "Laura Martínez", servicio: "Balayage", profesional: "Javiera", estado: "Confirmada", clase: "badge bg-success" },
];

export function Dashboard() {
	const ingresosRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!ingresosRef.current) return;
		const grafico = new Chart(ingresosRef.current, {
			type: "bar",
			data: {
				labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
				datasets: [
					{
						label: "Ingresos ($)",
						data: [120000, 145000, 90000, 180000, 250000, 310000, 0],
						backgroundColor: "rgba(165, 38, 71, 0.75)",
						borderRadius: 6,
					},
				],
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
	}, []);

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>
					Dashboard
				</h2>
				<Link to="/admin/agenda?modal=cita" className="btn btn-custom-primary w-auto">
					<i className="bi bi-plus-lg me-2"></i>Nueva Cita
				</Link>
			</div>

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
							<h4 className="card-title-custom m-0">Próximas Citas</h4>
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
										<tr key={cita.hora + cita.cliente}>
											<td>{cita.hora}</td>
											<td>{cita.cliente}</td>
											<td>{cita.servicio}</td>
											<td>{cita.profesional}</td>
											<td><span className={cita.clase}>{cita.estado}</span></td>
										</tr>
									))}
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
						<h4 className="card-title-custom mb-3">Rendimiento Semanal</h4>
						<div className="chart-container" style={{ height: 180 }}>
							<canvas ref={ingresosRef}></canvas>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
