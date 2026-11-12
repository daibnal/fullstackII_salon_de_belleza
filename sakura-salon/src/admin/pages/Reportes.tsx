import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { TarjetaMetrica } from "../components/TarjetaMetrica";

const resumen = [
	{ icono: "bi-cash-coin", claseIcono: "bg-success-subtle text-success", etiqueta: "Ingresos Totales (Mes)", valor: "$3.250.000", detalle: "12% vs mes anterior", claseDetalle: "text-success", iconoDetalle: "bi-arrow-up-short" },
	{ icono: "bi-receipt", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Servicios Realizados", valor: "184", detalle: "5% vs mes anterior", claseDetalle: "text-success", iconoDetalle: "bi-arrow-up-short" },
	{ icono: "bi-tags", claseIcono: "bg-info-subtle text-info", etiqueta: "Ticket Promedio", valor: "$17.660", detalle: "Por cliente atendido", claseDetalle: "text-muted" },
	{ icono: "bi-cart-x", claseIcono: "bg-danger-subtle text-danger", etiqueta: "Costo de Insumos (Mes)", valor: "$420.000", detalle: "13% de los ingresos", claseDetalle: "text-danger" },
];

const demanda = [
	{ insumo: "Decolorante Polvo", uso: "2.5 Kg (15 Balayages)", stock: "3.0 Kg", estado: "Al Límite", clase: "badge bg-warning text-dark" },
	{ insumo: "Esmalte Base Gel", uso: "60 ml (20 Manicuras)", stock: "15 ml", estado: "Quiebre Inminente", clase: "badge bg-danger" },
	{ insumo: "Loción Lifting #1", uso: "15 Sobres (15 Liftings)", stock: "40 Sobres", estado: "Suficiente", clase: "badge bg-success" },
	{ insumo: "Shampoo Neutro", uso: "1.5 Litros", stock: "5 Litros", estado: "Suficiente", clase: "badge bg-success" },
];

export function Reportes() {
	const ingresosRef = useRef<HTMLCanvasElement>(null);
	const categoriasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!ingresosRef.current || !categoriasRef.current) return;

		const ingresos = new Chart(ingresosRef.current, {
			type: "bar",
			data: {
				labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
				datasets: [
					{
						label: "Ingresos ($)",
						data: [120000, 145000, 90000, 180000, 250000, 310000, 0],
						backgroundColor: "rgba(232, 67, 147, 0.7)",
						borderRadius: 6,
						order: 2,
					},
					{
						label: "Citas Atendidas",
						data: [8, 10, 6, 12, 16, 22, 0],
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
					y: {
						beginAtZero: true,
						position: "left",
						ticks: {
							callback: (value) => "$" + Number(value) / 1000 + "k",
						},
					},
					y1: {
						beginAtZero: true,
						position: "right",
						grid: { drawOnChartArea: false },
						ticks: { stepSize: 5 },
					},
				},
				plugins: { legend: { position: "top" } },
			},
		});

		const categorias = new Chart(categoriasRef.current, {
			type: "doughnut",
			data: {
				labels: ["Cabello", "Manicure", "Lifting/Cejas"],
				datasets: [
					{
						data: [45, 35, 20],
						backgroundColor: ["#2C3E50", "#E84393", "#FFB8D2"],
						borderWidth: 0,
					},
				],
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
			categorias.destroy();
		};
	}, []);

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Mes Actual: Octubre</h2>
				<div className="d-flex gap-2">
					<select className="form-select w-auto">
						<option>Este Mes</option>
						<option>Mes Anterior</option>
						<option>Últimos 3 Meses</option>
						<option>Año Completo</option>
					</select>
					<button className="btn btn-outline-secondary" type="button">
						<i className="bi bi-download me-2"></i>Exportar PDF
					</button>
				</div>
			</div>

			<h4 className="fw-bold mb-3 mt-4" style={{ color: "var(--color-primary)", borderBottom: "2px solid var(--color-accent)", paddingBottom: 10 }}>
				Rendimiento Financiero
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
						<h5 className="fw-bold mb-4 text-dark">Evolución de Ingresos y Citas (Últimos 7 días)</h5>
						<div className="chart-container">
							<canvas ref={ingresosRef}></canvas>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-4">
					<div className="sketch-card">
						<h5 className="fw-bold mb-4 text-dark">Distribución por Categoría</h5>
						<div className="chart-container d-flex justify-content-center" style={{ height: 250 }}>
							<canvas ref={categoriasRef}></canvas>
						</div>
					</div>
				</div>
			</div>

			<h4 className="fw-bold mb-3" style={{ color: "var(--color-primary)", borderBottom: "2px solid var(--color-accent)", paddingBottom: 10 }}>
				Proyección e Inteligencia de Inventario
			</h4>

			<div className="row g-4">
				<div className="col-12 col-lg-7">
					<div className="sketch-card">
						<h5 className="fw-bold mb-3 text-dark">Demanda Proyectada (Próximos 7 días)</h5>
						<p className="text-muted small mb-4">
							Basado en las <strong className="text-dark">45 citas confirmadas</strong> para la próxima semana, este es el material que se consumirá:
						</p>
						<div className="table-responsive">
							<table className="table table-sm align-middle">
								<thead className="table-light">
									<tr>
										<th>Insumo Requerido</th>
										<th>Uso Estimado</th>
										<th>Stock Actual</th>
										<th>Estado para Agenda</th>
									</tr>
								</thead>
								<tbody>
									{demanda.map((fila) => (
										<tr key={fila.insumo}>
											<td className="fw-medium">{fila.insumo}</td>
											<td>{fila.uso}</td>
											<td>{fila.stock}</td>
											<td><span className={fila.clase}>{fila.estado}</span></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
