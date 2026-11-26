import { useEffect, useRef, useState } from "react";
import { mensajeError } from "../api/mensajeError";
import { Insumos, usosRestantesDe, type Insumo, type RecetaLinea } from "../services/insumos.service";
import { Reservas, type PrestacionReserva, type Reserva, type TurnosDia } from "../services/reservas.service";

function puedeComenzar(estado: string) {
	return estado === "CONFIRMADA" || estado === "PAGADA_COMPLETA" || estado === "EN_PROCESO";
}

function pesoCategoria(nombre: string, preferida: string) {
	if (preferida && nombre === preferida) return 0;
	if (nombre === "General") return 2;
	return 1;
}

function gruposDe(lista: Insumo[], categoriaServicio: string) {
	const mapa = new Map<string, Insumo[]>();
	for (const insumo of lista.filter((item) => item.activo)) {
		const clave = insumo.categoria || "General";
		const grupo = mapa.get(clave) ?? [];
		grupo.push(insumo);
		mapa.set(clave, grupo);
	}
	return Array.from(mapa.entries())
		.sort((a, b) => pesoCategoria(a[0], categoriaServicio) - pesoCategoria(b[0], categoriaServicio) || a[0].localeCompare(b[0], "es"))
		.map(([nombre, items]) => ({ nombre, items }));
}

function hoy() {
	const ahora = new Date();
	const mes = String(ahora.getMonth() + 1).padStart(2, "0");
	const dia = String(ahora.getDate()).padStart(2, "0");
	return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function horaCorta(hora: string) {
	return hora?.slice(0, 5) ?? "";
}

export function MisCitas() {
	const [fecha, setFecha] = useState(hoy());
	const [turnos, setTurnos] = useState<TurnosDia | null>(null);
	const [insumos, setInsumos] = useState<Insumo[]>([]);
	const [error, setError] = useState("");
	const [aviso, setAviso] = useState("");
	const [abierta, setAbierta] = useState<{ reserva: Reserva; prestacion: PrestacionReserva } | null>(null);
	const [seleccion, setSeleccion] = useState<number[]>([]);
	const [guardando, setGuardando] = useState(false);
	const [cargandoInsumos, setCargandoInsumos] = useState(false);
	const pedidoInsumos = useRef(0);

	function cargar(dia: string) {
		setError("");
		void Reservas.misTurnos(dia)
			.then(setTurnos)
			.catch((err: unknown) => setError(mensajeError(err, "No se pudieron cargar tus citas.")));
	}

	useEffect(() => {
		cargar(fecha);
	}, [fecha]);

	function abrir(reserva: Reserva, prestacion: PrestacionReserva) {
		const categoria = prestacion.nombreCategoria || reserva.nombreCategoria || "";
		setAbierta({ reserva, prestacion });
		setSeleccion([]);
		setInsumos([]);
		setAviso("");
		setCargandoInsumos(true);
		const actual = ++pedidoInsumos.current;
		void Insumos.paraCita(categoria)
			.then((lista) => {
				if (pedidoInsumos.current !== actual) return;
				setInsumos(lista);
				return Insumos.receta(prestacion.servicioId)
					.then((receta: RecetaLinea[]) => {
						if (pedidoInsumos.current !== actual) return;
						const ids = receta
							.map((fila) => fila.insumo?.id)
							.filter((id): id is number => typeof id === "number");
						setSeleccion(Array.from(new Set(ids)).filter((id) => {
							const insumo = lista.find((item) => item.id === id);
							return insumo != null && usosRestantesDe(insumo) > 0;
						}));
					})
					.catch(() => {
						if (pedidoInsumos.current === actual) setSeleccion([]);
					});
			})
			.catch((err: unknown) => {
				if (pedidoInsumos.current !== actual) return;
				setInsumos([]);
				setAviso(mensajeError(err, "No se pudieron cargar los insumos."));
			})
			.finally(() => {
				if (pedidoInsumos.current === actual) setCargandoInsumos(false);
			});
	}

	function confirmar() {
		if (!abierta?.prestacion.id) return;
		const lineas = seleccion
			.filter((id) => {
				const insumo = insumos.find((item) => item.id === id);
				return insumo != null && usosRestantesDe(insumo) > 0;
			})
			.map((insumoId) => ({ insumoId, usos: 1 }));
		if (lineas.length === 0 && !confirm("¿Esta cita no usa insumos?")) {
			return;
		}
		setGuardando(true);
		setAviso("");
		void Reservas.comenzar(abierta.reserva.id, abierta.prestacion.id, lineas)
			.then(() => {
				setAbierta(null);
				cargar(fecha);
			})
			.catch((err: unknown) => setAviso(mensajeError(err, "No se pudo comenzar la cita.")))
			.finally(() => setGuardando(false));
	}

	const profesionalId = turnos?.profesionalId;
	const filasDia = (turnos?.reservas ?? []).flatMap((reserva) =>
		(reserva.prestaciones ?? [])
			.filter((prestacion) => prestacion.profesionalId === profesionalId)
			.map((prestacion) => ({ reserva, prestacion }))
	);

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
				<div>
					<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Mis citas</h2>
					<p className="text-muted mb-0">{turnos?.nombre}</p>
				</div>
				<input type="date" className="form-control w-auto" value={fecha} onChange={(event) => setFecha(event.target.value)} />
			</div>
			{error && <p className="text-danger">{error}</p>}
			<div className="sketch-card p-0 overflow-hidden">
				<table className="table mb-0 align-middle">
					<thead>
						<tr>
							<th>Hora</th>
							<th>Cliente</th>
							<th>Servicio</th>
							<th>Estado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filasDia.map(({ reserva, prestacion }) => {
							const puede = !prestacion.iniciada && puedeComenzar(reserva.estado);
							const faltaAbono = !prestacion.iniciada && reserva.estado === "PENDIENTE_PAGO";
							return (
								<tr key={`${reserva.id}-${prestacion.id}`}>
									<td>{horaCorta(prestacion.horaInicio)} - {horaCorta(prestacion.horaFin)}</td>
									<td>{reserva.nombreCliente}</td>
									<td>{prestacion.nombreServicio}</td>
									<td>{prestacion.iniciada ? "En proceso" : reserva.estado}</td>
									<td className="text-end">
										{puede && prestacion.id && (
											<button className="btn btn-sm btn-custom-primary" type="button" onClick={() => abrir(reserva, prestacion)}>
												Comenzar
											</button>
										)}
										{faltaAbono && <span className="small text-muted">Falta el abono para comenzar</span>}
									</td>
								</tr>
							);
						})}
						{filasDia.length === 0 && (
							<tr><td colSpan={5} className="text-center text-muted py-3">No tienes citas este día.</td></tr>
						)}
					</tbody>
				</table>
			</div>

			{abierta && (
				<div className="modal d-block" style={{ background: "rgba(0,0,0,.45)" }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Comenzar {abierta.prestacion.nombreServicio}</h5>
								<button type="button" className="btn-close" onClick={() => setAbierta(null)}></button>
							</div>
							<div className="modal-body d-flex flex-column gap-2">
								<p className="small text-muted mb-0">Marca los insumos de esta cita. Cada uno descuenta un uso. Si no usas ninguno, confírmalo al comenzar.</p>
								{aviso && <p className="text-danger small mb-0">{aviso}</p>}
								{cargandoInsumos && <p className="small text-muted mb-0">Cargando insumos...</p>}
								{gruposDe(insumos, abierta.prestacion.nombreCategoria || abierta.reserva.nombreCategoria || "").map((grupo) => (
									<div key={grupo.nombre}>
										<p className="small fw-bold text-muted mb-1 mt-2">{grupo.nombre}</p>
										{grupo.items.map((insumo) => {
											const restantes = usosRestantesDe(insumo);
											const sinUsos = restantes < 1;
											return (
												<div className="form-check" key={insumo.id}>
													<input
														className="form-check-input"
														type="checkbox"
														id={`insumo-${insumo.id}`}
														checked={seleccion.includes(insumo.id) && !sinUsos}
														disabled={sinUsos}
														onChange={(event) => {
															setSeleccion((prev) => event.target.checked
																? Array.from(new Set([...prev, insumo.id]))
																: prev.filter((id) => id !== insumo.id));
														}}
													/>
													<label className="form-check-label" htmlFor={`insumo-${insumo.id}`}>
														{insumo.nombre} — {restantes} usos restantes
														{sinUsos && <span className="text-danger"> (sin usos)</span>}
													</label>
												</div>
											);
										})}
									</div>
								))}
								{!cargandoInsumos && insumos.filter((insumo) => insumo.activo).length === 0 && (
									<p className="small text-muted mb-0">No hay insumos para este servicio.</p>
								)}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-outline-secondary" onClick={() => setAbierta(null)}>Cancelar</button>
								<button type="button" className="btn btn-custom-primary" disabled={guardando} onClick={confirmar}>
									{guardando ? "Guardando..." : "Comenzar y descontar"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
