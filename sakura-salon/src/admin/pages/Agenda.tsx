import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { useAgenda } from "../../hooks/useAgenda";
import { useProfesionales } from "../../hooks/useProfesionales";
import { useServicios } from "../../hooks/useServicios";
import { Reservas, type Reserva } from "../../services/reservas.service";

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

function horaCorta(hora: string) {
	return hora.slice(0, 5);
}

function pesos(valor: number) {
	return "$" + valor.toLocaleString("es-CL");
}

const HORAS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export function Agenda() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [diaAgenda, setDiaAgenda] = useState(fechaHoyISO);
	const hoy = fechaHoyISO();
	const { citas, loading, error, recargar } = useAgenda(diaAgenda);
	const { profesionales } = useProfesionales();
	const { servicios } = useServicios();
	const [modalCita, setModalCita] = useState(false);
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});
	const [aviso, setAviso] = useState("");

	const [formNombre, setFormNombre] = useState("");
	const [formApellido, setFormApellido] = useState("");
	const [formCorreo, setFormCorreo] = useState("");
	const [formTelefono, setFormTelefono] = useState("");
	const [formServicio, setFormServicio] = useState("");
	const [formProfesional, setFormProfesional] = useState("");
	const [formFecha, setFormFecha] = useState("");
	const [formHora, setFormHora] = useState("");

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
		setFormTelefono("");
		setFormServicio("");
		setFormProfesional("");
		setFormFecha(diaAgenda >= hoy ? diaAgenda : hoy);
		setFormHora("");
		setInvalidos({});
		setModalCita(true);
	}

	function guardarNuevaCita(event: FormEvent) {
		event.preventDefault();
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formApellido.trim()) errores.apellido = true;
		if (!formCorreo.trim()) errores.correo = true;
		if (!formTelefono.trim()) errores.telefono = true;
		if (!formServicio) errores.servicio = true;
		if (!formProfesional) errores.profesional = true;
		if (!formFecha || formFecha < hoy) errores.fecha = true;
		if (!/^\d{2}:\d{2}$/.test(formHora.trim())) errores.hora = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		void Reservas.crearInvitado({
			nombre: formNombre.trim(),
			apellido: formApellido.trim(),
			correo: formCorreo.trim(),
			telefono: formTelefono.trim(),
			servicioId: Number(formServicio),
			profesionalId: Number(formProfesional),
			fecha: formFecha,
			horaInicio: formHora.trim(),
		})
			.then(() => {
				setAviso("");
				cerrarModalCita();
				if (formFecha === diaAgenda) {
					void recargar();
				} else {
					setDiaAgenda(formFecha);
				}
			})
			.catch(() => setAviso("No se pudo crear la cita."));
	}

	function operar(accion: (id: number) => Promise<Reserva>, id: number) {
		setAviso("");
		void accion(id)
			.then(() => recargar())
			.catch(() => setAviso("No se pudo actualizar la cita."));
	}

	function cancelarCita(id: number) {
		if (!confirm("¿Cancelar esta cita?")) return;
		operar(Reservas.cancelar, id);
	}

	const activas = citas.filter((cita) => cita.estado !== "CANCELADA" && cita.estado !== "LIBERADA");
	const ingreso = activas.reduce((suma, cita) => suma + cita.montoTotal, 0);
	const canceladas = citas.filter((cita) => cita.estado === "CANCELADA").length;
	const columnas = profesionales.slice(0, 4);

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
				<button
					className="btn btn-custom-primary w-100 w-lg-auto text-nowrap"
					type="button"
					onClick={abrirModalCita}
					disabled={diaAgenda < hoy}
					title={diaAgenda < hoy ? "No se puede agendar en una fecha anterior a hoy" : "Nueva cita"}>
					<i className="bi bi-calendar-plus me-2"></i>Nueva Cita
				</button>
			</div>

			{error && <p className="text-danger">No se pudo cargar la agenda.</p>}
			{aviso && <p className="text-danger">{aviso}</p>}
			{loading && <p className="text-muted">Cargando citas...</p>}

			<div className="row g-3 mb-4">
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon"><i className="bi bi-calendar-check"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Citas del día</h6>
							<span className="fs-4 fw-bold text-dark">{activas.length}</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-success-subtle text-success"><i className="bi bi-percent"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Profesionales</h6>
							<span className="fs-4 fw-bold text-dark">{profesionales.length}</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-warning-subtle text-warning"><i className="bi bi-cash-stack"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Ingreso proyectado</h6>
							<span className="fs-4 fw-bold text-dark">{pesos(ingreso)}</span>
						</div>
					</div>
				</div>
				<div className="col-6 col-xl-3">
					<div className="sketch-card d-flex align-items-center gap-3 p-3">
						<div className="agenda-metric-icon bg-danger-subtle text-danger"><i className="bi bi-person-x"></i></div>
						<div>
							<h6 className="text-muted mb-0 small">Cancelaciones</h6>
							<span className="fs-4 fw-bold text-dark">{canceladas}</span>
						</div>
					</div>
				</div>
			</div>

			<div className="sketch-card p-4 mb-4 shadow-sm">
				<h5 className="fw-bold m-0 mb-3" style={{ color: "var(--color-primary)" }}>
					<i className="bi bi-globe"></i> Citas del día
				</h5>
				<div className="table-responsive">
					<table className="table table-hover align-middle mb-0">
						<thead className="table-light">
							<tr>
								<th>Cliente</th>
								<th>Servicio</th>
								<th>Profesional</th>
								<th>Hora</th>
								<th>Pago</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{citas.map((cita) => (
								<tr key={`${cita.id}-${cita.profesionalId}-${cita.horaInicio}`}>
									<td>
										<strong>{cita.nombreCliente}</strong>
										<br />
										<small className="text-muted">{cita.correoCliente}</small>
									</td>
									<td>{cita.nombreServicio}</td>
									<td>{cita.nombreProfesional}</td>
									<td>{horaCorta(cita.horaInicio)} - {horaCorta(cita.horaFin)}</td>
									<td>
										<span className="badge bg-light text-dark border">{cita.estado}</span>
										<div className="small text-muted">{pesos(cita.montoPagado)} / {pesos(cita.montoTotal)}</div>
									</td>
									<td className="text-nowrap">
										{cita.estado === "PENDIENTE_PAGO" && (
											<button className="btn btn-sm btn-outline-success me-1" type="button" onClick={() => operar(Reservas.pagoManual, cita.id)}>Abono</button>
										)}
										{cita.estado === "CONFIRMADA" && (
											<button className="btn btn-sm btn-outline-primary me-1" type="button" onClick={() => operar(Reservas.saldo, cita.id)}>Saldo</button>
										)}
										{(cita.estado === "CONFIRMADA" || cita.estado === "PAGADA_COMPLETA") && (
											<button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => operar(Reservas.asistencia, cita.id)}>Asistió</button>
										)}
										{cita.estado !== "CANCELADA" && cita.estado !== "LIBERADA" && (
											<button className="btn btn-sm btn-outline-danger" type="button" title="Cancelar cita" onClick={() => cancelarCita(cita.id)}>
												<i className="bi bi-trash"></i>
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{citas.length === 0 && !loading && (
					<div className="text-center text-muted py-3">No hay citas agendadas para este día.</div>
				)}
			</div>

			<div className="sketch-card p-0 overflow-hidden">
				<div className="table-responsive">
					<table className="table table-bordered calendar-table m-0">
						<thead>
							<tr>
								<th className="time-col border-bottom-0"><i className="bi bi-clock"></i></th>
								{columnas.map((persona) => (
									<th key={persona.id}>
										<div>{persona.nombre}<br /><small className="text-muted fw-normal">{persona.especialidad}</small></div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{HORAS.map((hora) => (
								<tr key={hora}>
									<td className="time-col">{hora}</td>
									{columnas.map((persona) => {
										const evento = citas.find((cita) => cita.profesionalId === persona.id && horaCorta(cita.horaInicio) === hora);
										return (
											<td key={persona.id}>
												{evento && (
													<div className="event-block event-confirmed">
														<span className="event-title">{evento.nombreServicio}</span>
														<span className="event-client">{evento.nombreCliente}</span>
														<span className="event-time">{horaCorta(evento.horaInicio)} - {horaCorta(evento.horaFin)}</span>
													</div>
												)}
											</td>
										);
									})}
								</tr>
							))}
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
							<label className="form-label small fw-semibold">Teléfono</label>
							<input type="tel" className={"form-control" + (invalidos.telefono ? " is-invalid" : "")} value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Servicio</label>
							<select className={"form-select" + (invalidos.servicio ? " is-invalid" : "")} value={formServicio} onChange={(e) => setFormServicio(e.target.value)}>
								<option value="">Selecciona...</option>
								{servicios.filter((servicio) => servicio.activo).map((servicio) => (
									<option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
								))}
							</select>
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Profesional</label>
							<select className={"form-select" + (invalidos.profesional ? " is-invalid" : "")} value={formProfesional} onChange={(e) => setFormProfesional(e.target.value)}>
								<option value="">Selecciona...</option>
								{profesionales.map((persona) => (
									<option key={persona.id} value={persona.id}>{persona.nombre}</option>
								))}
							</select>
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Fecha</label>
							<input type="date" min={hoy} className={"form-control" + (invalidos.fecha ? " is-invalid" : "")} value={formFecha} onChange={(e) => setFormFecha(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Hora</label>
							<input type="time" className={"form-control" + (invalidos.hora ? " is-invalid" : "")} value={formHora} onChange={(e) => setFormHora(e.target.value)} />
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
