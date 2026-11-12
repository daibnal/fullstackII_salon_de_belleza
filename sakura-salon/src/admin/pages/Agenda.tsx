import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";

type CitaWeb = {
	nombre?: string;
	apellido?: string;
	correo?: string;
	rut?: string;
	run?: string;
	servicio?: string;
	profesional?: string;
	fecha?: string;
	hora?: string;
	montoPagado?: number;
	tipoPago?: string;
};

function leerCitas(): CitaWeb[] {
	try {
		const guardadas = JSON.parse(localStorage.getItem("citasSakura") || "[]");
		if (Array.isArray(guardadas) && guardadas.length > 0) {
			return guardadas;
		}
		const suelta = localStorage.getItem("detallesCita") || sessionStorage.getItem("detallesCita");
		if (!suelta) return [];
		const cita = JSON.parse(suelta);
		return cita ? [cita] : [];
	} catch {
		return [];
	}
}

function fechaHoyISO() {
	const hoy = new Date();
	const mes = String(hoy.getMonth() + 1).padStart(2, "0");
	const dia = String(hoy.getDate()).padStart(2, "0");
	return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function tituloDia(iso: string, hoy: string) {
	const [anio, mes, dia] = iso.split("-").map(Number);
	const fecha = new Date(anio, mes - 1, dia);
	const nombreMes = fecha.toLocaleDateString("es-CL", { month: "long" });
	const texto = `${dia} de ${nombreMes}`;
	return iso === hoy ? `Hoy: ${texto}` : texto;
}

function fechaEnISO(fecha?: string) {
	if (!fecha) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
	const partes = fecha.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
	if (!partes) return fecha;
	return `${partes[3]}-${partes[2].padStart(2, "0")}-${partes[1].padStart(2, "0")}`;
}

function guardarCitas(lista: CitaWeb[]) {
	localStorage.setItem("citasSakura", JSON.stringify(lista));
	localStorage.removeItem("detallesCita");
	sessionStorage.removeItem("detallesCita");
}

export function Agenda() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [citas, setCitas] = useState<CitaWeb[]>([]);
	const [modalCita, setModalCita] = useState(false);
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});

	const [formNombre, setFormNombre] = useState("");
	const [formApellido, setFormApellido] = useState("");
	const [formCorreo, setFormCorreo] = useState("");
	const [formRut, setFormRut] = useState("");
	const [formServicio, setFormServicio] = useState("");
	const [formProfesional, setFormProfesional] = useState("");
	const [formFecha, setFormFecha] = useState("");
	const [formHora, setFormHora] = useState("");
	const [formMonto, setFormMonto] = useState("");
	const [formTipoPago, setFormTipoPago] = useState<"abono" | "total">("total");
	const [diaAgenda, setDiaAgenda] = useState(fechaHoyISO);
	const hoy = fechaHoyISO();

	useEffect(() => {
		setCitas(leerCitas());
	}, []);

	useEffect(() => {
		if (params.get("modal") !== "cita") return;
		abrirModalCita();
		navigate("/admin/agenda", { replace: true });
	}, [params, navigate]);

	function cerrarModalCita() {
		setModalCita(false);
		setInvalidos({});
	}

	function abrirModalCita() {
		setFormNombre("");
		setFormApellido("");
		setFormCorreo("");
		setFormRut("");
		setFormServicio("");
		setFormProfesional("");
		setFormFecha(diaAgenda >= hoy ? diaAgenda : hoy);
		setFormHora("");
		setFormMonto("");
		setFormTipoPago("total");
		setInvalidos({});
		setModalCita(true);
	}

	function guardarNuevaCita(event: FormEvent) {
		event.preventDefault();
		const monto = Number(formMonto);
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formApellido.trim()) errores.apellido = true;
		if (!formCorreo.trim()) errores.correo = true;
		if (!formServicio.trim()) errores.servicio = true;
		if (!formProfesional.trim()) errores.profesional = true;
		if (!formFecha || formFecha < hoy) errores.fecha = true;
		if (!formHora.trim()) errores.hora = true;
		if (!Number.isFinite(monto) || monto <= 0) errores.monto = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		const montoPagado = formTipoPago === "abono" ? Math.round(monto / 2) : monto;
		const nueva: CitaWeb = {
			nombre: formNombre.trim(),
			apellido: formApellido.trim(),
			correo: formCorreo.trim(),
			rut: formRut.trim() || undefined,
			servicio: formServicio.trim(),
			profesional: formProfesional.trim(),
			fecha: formFecha,
			hora: formHora.trim(),
			montoPagado,
			tipoPago: formTipoPago === "abono" ? "abono" : "total",
		};
		const lista = [...citas, nueva];
		guardarCitas(lista);
		setCitas(lista);
		cerrarModalCita();
	}

	function eliminarCita(index: number) {
		if (!confirm("¿Estás seguro de eliminar esta cita del sistema?")) return;
		const lista = citas.filter((_, i) => i !== index);
		guardarCitas(lista);
		setCitas(lista);
	}

	function vaciarCitas() {
		if (!confirm("¿Deseas eliminar todas las reservas web?")) return;
		localStorage.removeItem("citasSakura");
		localStorage.removeItem("detallesCita");
		sessionStorage.removeItem("detallesCita");
		setCitas([]);
	}

	return (
		<>
			<div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
				<div className="d-flex align-items-center gap-3">
					<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>{tituloDia(diaAgenda, hoy)}</h2>
					<input
						type="date"
						className="form-control form-control-sm w-auto border-secondary"
						value={diaAgenda}
						onChange={(event) => setDiaAgenda(event.target.value)}
					/>
				</div>
				<div className="d-flex gap-2 w-100 w-lg-auto">
					<button className="btn btn-outline-secondary w-100 w-lg-auto" type="button">
						<i className="bi bi-funnel"></i> Filtrar
					</button>
					<button
						className="btn btn-custom-primary w-100 w-lg-auto text-nowrap"
						type="button"
						onClick={abrirModalCita}
						disabled={diaAgenda < hoy}
						title={diaAgenda < hoy ? "No se puede agendar en una fecha anterior a hoy" : "Nueva cita"}>
						<i className="bi bi-calendar-plus me-2"></i>Nueva Cita
					</button>
				</div>
			</div>

			<div className="row g-3 mb-4">
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon"><i className="bi bi-calendar-check"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Citas Hoy</h6>
							<span className="fs-4 fw-bold text-dark">28</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-success-subtle text-success"><i className="bi bi-percent"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Ocupación</h6>
							<span className="fs-4 fw-bold text-dark">82%</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-warning-subtle text-warning"><i className="bi bi-cash-stack"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Ingreso Proyectado</h6>
							<span className="fs-4 fw-bold text-dark">$450k</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-danger-subtle text-danger"><i className="bi bi-person-x"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Cancelaciones</h6>
							<span className="fs-4 fw-bold text-dark">2</span>
						</div>
					</div>
				</div>
			</div>

			<div className="sketch-card p-4 mb-4 shadow-sm">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h5 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>
						<i className="bi bi-globe"></i> Citas Agendadas por Clientes (Web)
					</h5>
					<button className="btn btn-outline-danger btn-sm" type="button" onClick={vaciarCitas}>
						Vaciar Registros
					</button>
				</div>
				<div className="table-responsive">
					<table className="table table-hover align-middle mb-0">
						<thead className="table-light">
							<tr>
								<th>Cliente</th>
								<th>RUT</th>
								<th>Servicio</th>
								<th>Profesional</th>
								<th>Fecha y Hora</th>
								<th>Pago</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{citas.map((cita, index) => ({ cita, index })).filter(({ cita }) => fechaEnISO(cita.fecha) === diaAgenda).map(({ cita, index }) => {
								const monto = Number(cita.montoPagado || 0).toLocaleString("es-CL");
								const esAbono = cita.tipoPago === "abono";
								return (
									<tr key={index}>
										<td>
											<strong>{(cita.nombre || "") + " " + (cita.apellido || "Cliente")}</strong>
											<br />
											<small className="text-muted">{cita.correo || "Sin correo"}</small>
										</td>
										<td>{cita.rut || cita.run || "No registrado"}</td>
										<td>{cita.servicio || "Servicio General"}</td>
										<td>{cita.profesional || "Por asignar"}</td>
										<td>
											{cita.fecha || "Próximamente"}
											<br />
											<small className="text-muted">{cita.hora || ""}</small>
										</td>
										<td>
											{esAbono
												? <span className="badge bg-success">Abono 50% (${monto})</span>
												: <span className="badge bg-primary">Total (${monto})</span>}
										</td>
										<td>
											<button className="btn btn-sm btn-outline-danger" type="button" title="Eliminar cita" onClick={() => eliminarCita(index)}>
												<i className="bi bi-trash"></i>
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{citas.every((cita) => fechaEnISO(cita.fecha) !== diaAgenda) && (
					<div className="text-center text-muted py-3">
						No hay citas agendadas para este día.
					</div>
				)}
			</div>

			<div className="sketch-card p-0 overflow-hidden">
				<div className="table-responsive">
					<table className="table table-bordered calendar-table m-0">
						<thead>
							<tr>
								<th className="time-col border-bottom-0"><i className="bi bi-clock"></i></th>
								<th>
									<div className="d-flex align-items-center justify-content-center gap-2">
										<div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, fontSize: 12 }}>MA</div>
										<div>María <br /><small className="text-muted fw-normal">Peluquería</small></div>
									</div>
								</th>
								<th>
									<div className="d-flex align-items-center justify-content-center gap-2">
										<div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, fontSize: 12 }}>CA</div>
										<div>Camila <br /><small className="text-muted fw-normal">Manicura</small></div>
									</div>
								</th>
								<th>
									<div className="d-flex align-items-center justify-content-center gap-2">
										<div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, fontSize: 12 }}>JA</div>
										<div>Javiera <br /><small className="text-muted fw-normal">Colorimetría</small></div>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="time-col">09:00</td>
								<td>
									<div className="event-block event-confirmed">
										<span className="event-title">Corte Mujer</span>
										<span className="event-client">Ana García</span>
										<span className="event-time"><i className="bi bi-clock-history"></i> 09:00 - 10:00</span>
									</div>
								</td>
								<td></td>
								<td rowSpan={2} className="align-middle">
									<div className="event-block event-process h-100 d-flex flex-column justify-content-center">
										<span className="event-title">Balayage Completo</span>
										<span className="event-client">Laura Martínez</span>
										<span className="event-time"><i className="bi bi-clock-history"></i> 09:00 - 11:00</span>
										<span className="badge bg-primary mt-1 w-auto align-self-start">En progreso</span>
									</div>
								</td>
							</tr>
							<tr>
								<td className="time-col">10:00</td>
								<td>
									<div className="event-block event-pending">
										<span className="event-title">Brushing</span>
										<span className="event-client">Marta López</span>
										<span className="event-time"><i className="bi bi-clock-history"></i> 10:15 - 11:00</span>
									</div>
								</td>
								<td>
									<div className="event-block event-confirmed">
										<span className="event-title">Manicura Permanente</span>
										<span className="event-client">Valentina Soto</span>
										<span className="event-time"><i className="bi bi-clock-history"></i> 10:00 - 11:30</span>
									</div>
								</td>
							</tr>
							<tr>
								<td className="time-col">11:00</td>
								<td className="bg-light text-center align-middle text-muted small">
									<i className="bi bi-cup-hot"></i> Descanso / Bloqueado
								</td>
								<td></td>
								<td>
									<div className="event-block event-confirmed">
										<span className="event-title">Retoque Raíz</span>
										<span className="event-client">Carla Gómez</span>
										<span className="event-time"><i className="bi bi-clock-history"></i> 11:30 - 12:30</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<Modal abierto={modalCita} titulo="Nueva cita" onCerrar={cerrarModalCita} dialogClass="modal-lg">
				<form onSubmit={guardarNuevaCita} className="d-flex flex-column gap-3">
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Nombre</label>
							<input type="text" className={"form-control" + (invalidos.nombre ? " is-invalid" : "")} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Apellido</label>
							<input type="text" className={"form-control" + (invalidos.apellido ? " is-invalid" : "")} value={formApellido} onChange={(e) => setFormApellido(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Correo</label>
							<input type="email" className={"form-control" + (invalidos.correo ? " is-invalid" : "")} value={formCorreo} onChange={(e) => setFormCorreo(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">RUT (opcional)</label>
							<input type="text" className="form-control" value={formRut} onChange={(e) => setFormRut(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Servicio</label>
							<input type="text" className={"form-control" + (invalidos.servicio ? " is-invalid" : "")} value={formServicio} onChange={(e) => setFormServicio(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Profesional</label>
							<input type="text" className={"form-control" + (invalidos.profesional ? " is-invalid" : "")} value={formProfesional} onChange={(e) => setFormProfesional(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Fecha</label>
							<input type="date" min={hoy} className={"form-control" + (invalidos.fecha ? " is-invalid" : "")} value={formFecha} onChange={(e) => setFormFecha(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Hora</label>
							<input type="text" placeholder="10:00" className={"form-control" + (invalidos.hora ? " is-invalid" : "")} value={formHora} onChange={(e) => setFormHora(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Monto total del servicio</label>
							<input type="number" min={1} className={"form-control" + (invalidos.monto ? " is-invalid" : "")} value={formMonto} onChange={(e) => setFormMonto(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Modalidad de pago</label>
							<select className="form-select" value={formTipoPago} onChange={(e) => setFormTipoPago(e.target.value as "abono" | "total")}>
								<option value="total">Pago total (100%)</option>
								<option value="abono">Abono 50%</option>
							</select>
						</div>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModalCita}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Guardar cita</button>
					</div>
				</form>
			</Modal>
		</>
	);
}
