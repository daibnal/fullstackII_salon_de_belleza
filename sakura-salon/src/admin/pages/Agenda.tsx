import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { useAgenda } from "../../hooks/useAgenda";
import { useDisponibilidad } from "../../hooks/useDisponibilidad";
import { useProfesionales } from "../../hooks/useProfesionales";
import { useServicios } from "../../hooks/useServicios";
import { Reservas, type Reserva } from "../../services/reservas.service";
import { mensajeError } from "../../api/mensajeError";
import { correoEsValido, nombreEsValido, telefonoEsValido } from "../../client/cuenta/validaciones";
import { fechaNoAnterior, hoyLocal } from "../../client/formularios/pages/validacionesCita";
import { coincideEspecialidad } from "../../horario/especialidades";
import { esDomingo, mensajeFueraDeHorario, minutosDelReloj, slotDentroDeHorario } from "../../horario/horarioSalon";

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

function BotonHora({
	id,
	hora,
	seleccionada,
	onElegir,
}: {
	id: string;
	hora: string;
	seleccionada: boolean;
	onElegir: () => void;
}) {
	return (
		<div className="col-6 col-md-4">
			<input
				type="radio"
				className="btn-check"
				name="hora-admin"
				id={id}
				checked={seleccionada}
				onChange={onElegir}
			/>
			<label className="btn w-100 btn-sm btn-outline-secondary" htmlFor={id}>
				{horaCorta(hora)}
			</label>
		</div>
	);
}

export function Agenda() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [diaAgenda, setDiaAgenda] = useState(fechaHoyISO);
	const hoy = fechaHoyISO();
	const { citas, loading, error, recargar } = useAgenda(diaAgenda);
	const { profesionales } = useProfesionales();
	const { servicios } = useServicios();
	const [modalCita, setModalCita] = useState(false);
	const [invalidos, setInvalidos] = useState<Record<string, string>>({});
	const [aviso, setAviso] = useState("");

	const [formNombre, setFormNombre] = useState("");
	const [formApellido, setFormApellido] = useState("");
	const [formCorreo, setFormCorreo] = useState("");
	const [formTelefono, setFormTelefono] = useState("");
	const [formServicio, setFormServicio] = useState("");
	const [formProfesional, setFormProfesional] = useState("");
	const [formFecha, setFormFecha] = useState("");
	const [formHora, setFormHora] = useState("");

	const servicioElegido = servicios.find((servicio) => String(servicio.id) === formServicio);
	const profesionalesAptos = servicioElegido
		? profesionales.filter((persona) => persona.activo && coincideEspecialidad(persona.especialidad, servicioElegido.categoria?.nombre))
		: [];
	const domingo = esDomingo(formFecha);
	const duracion = servicioElegido?.duracionMinutos ?? 0;
	const { huecos, loading: cargandoHuecos, error: errorHuecos } = useDisponibilidad(
		modalCita ? Number(formProfesional) : 0,
		modalCita ? Number(formServicio) : 0,
		modalCita ? formFecha : "",
	);
	const huecosVisibles = useMemo(
		() => (modalCita && !domingo ? huecos.filter((hueco) => slotDentroDeHorario(formFecha, hueco.horaInicio, duracion)) : []),
		[modalCita, domingo, huecos, formFecha, duracion],
	);
	const consultaLista = Boolean(formServicio && formProfesional && formFecha);

	useEffect(() => {
		if (params.get("modal") !== "cita") return;
		abrirModalCita();
		navigate("/admin/agenda", { replace: true });
	}, [params, navigate]);

	useEffect(() => {
		if (!modalCita || !formHora || cargandoHuecos) return;
		const sigue = huecosVisibles.some((hueco) => horaCorta(hueco.horaInicio) === formHora);
		if (!sigue) setFormHora("");
	}, [modalCita, formHora, cargandoHuecos, huecosVisibles]);

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
		const errores: Record<string, string> = {};
		if (!nombreEsValido(formNombre)) errores.nombre = "Ingresa un nombre válido (solo letras, mínimo 2 caracteres).";
		if (!nombreEsValido(formApellido)) errores.apellido = "Ingresa un apellido válido (solo letras, mínimo 2 caracteres).";
		if (!correoEsValido(formCorreo)) errores.correo = "Ingresa un correo electrónico válido.";
		if (!telefonoEsValido(formTelefono)) errores.telefono = "Ingresa un teléfono móvil válido (ej: +56912345678).";
		if (!formServicio) errores.servicio = "Selecciona un servicio.";
		if (!formProfesional) errores.profesional = "Selecciona un profesional.";
		if (!fechaNoAnterior(formFecha)) {
			errores.fecha = formFecha.trim() !== "" && formFecha < hoyLocal()
				? "La fecha no puede ser anterior al día actual."
				: "Elige una fecha válida.";
		}
		const horaDisponible = huecosVisibles.some((hueco) => horaCorta(hueco.horaInicio) === formHora.trim());
		if (formFecha && esDomingo(formFecha)) {
			errores.hora = "El domingo el salón está cerrado.";
		} else if (!horaDisponible) {
			errores.hora = "Selecciona un horario disponible.";
		} else if (formFecha === hoy && minutosDelReloj(formHora) <= new Date().getHours() * 60 + new Date().getMinutes()) {
			errores.hora = "Ese horario ya pasó.";
		} else if (!slotDentroDeHorario(formFecha, formHora, duracion)) {
			errores.hora = mensajeFueraDeHorario(formFecha);
		}
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
			.catch((error: unknown) => setAviso(mensajeError(error, "No se pudo crear la cita.")));
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
	const columnas = profesionales.filter((persona) => persona.activo);

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
										{(cita.estado === "CONFIRMADA" || (cita.estado === "EN_PROCESO" && cita.montoPagado < cita.montoTotal)) && (
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
							{invalidos.nombre && <div className="invalid-feedback d-block">{invalidos.nombre}</div>}
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Apellido</label>
							<input type="text" className={"form-control" + (invalidos.apellido ? " is-invalid" : "")} value={formApellido} onChange={(e) => setFormApellido(e.target.value)} />
							{invalidos.apellido && <div className="invalid-feedback d-block">{invalidos.apellido}</div>}
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Correo</label>
							<input type="email" className={"form-control" + (invalidos.correo ? " is-invalid" : "")} value={formCorreo} onChange={(e) => setFormCorreo(e.target.value)} />
							{invalidos.correo && <div className="invalid-feedback d-block">{invalidos.correo}</div>}
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Teléfono</label>
							<input type="tel" className={"form-control" + (invalidos.telefono ? " is-invalid" : "")} value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} />
							{invalidos.telefono && <div className="invalid-feedback d-block">{invalidos.telefono}</div>}
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Servicio</label>
							<select className={"form-select" + (invalidos.servicio ? " is-invalid" : "")} value={formServicio} onChange={(e) => { setFormServicio(e.target.value); setFormProfesional(""); setFormHora(""); }}>
								<option value="">Selecciona...</option>
								{servicios.filter((servicio) => servicio.activo).map((servicio) => (
									<option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
								))}
							</select>
							{invalidos.servicio && <div className="invalid-feedback d-block">{invalidos.servicio}</div>}
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Profesional</label>
							<select className={"form-select" + (invalidos.profesional ? " is-invalid" : "")} value={formProfesional} onChange={(e) => { setFormProfesional(e.target.value); setFormHora(""); }} disabled={!formServicio}>
								<option value="">{!formServicio ? "Primero elige un servicio" : profesionalesAptos.length === 0 ? "Nadie realiza este servicio" : "Selecciona..."}</option>
								{profesionalesAptos.map((persona) => (
									<option key={persona.id} value={persona.id}>{persona.nombre}</option>
								))}
							</select>
							{invalidos.profesional && <div className="invalid-feedback d-block">{invalidos.profesional}</div>}
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Fecha</label>
							<input type="date" min={hoy} className={"form-control" + (invalidos.fecha ? " is-invalid" : "")} value={formFecha} onChange={(e) => { setFormFecha(e.target.value); setFormHora(""); }} />
							{invalidos.fecha && <div className="invalid-feedback d-block">{invalidos.fecha}</div>}
						</div>
						<div className="col-12">
							<label className="form-label small fw-semibold d-block">Horarios disponibles</label>
							{!consultaLista && <p className="text-muted small mb-1">Elige servicio, profesional y fecha para ver los horarios.</p>}
							{consultaLista && domingo && <p className="text-muted small mb-1">El domingo el salón está cerrado.</p>}
							{consultaLista && !domingo && cargandoHuecos && <p className="text-muted small mb-1">Buscando horarios...</p>}
							{consultaLista && !domingo && errorHuecos && <p className="text-danger small mb-1">No se pudo consultar la disponibilidad.</p>}
							{consultaLista && !domingo && !cargandoHuecos && !errorHuecos && huecosVisibles.length === 0 && (
								<p className="text-muted small mb-1">No hay horarios libres para esa combinación.</p>
							)}
							<div className="row g-2">
								{huecosVisibles.map((hueco) => (
									<BotonHora
										key={hueco.horaInicio}
										id={`admin-h-${hueco.horaInicio}`}
										hora={hueco.horaInicio}
										seleccionada={formHora === horaCorta(hueco.horaInicio)}
										onElegir={() => setFormHora(horaCorta(hueco.horaInicio))}
									/>
								))}
							</div>
							{invalidos.hora && <div className="invalid-feedback d-block">{invalidos.hora}</div>}
							<p className="text-muted small mb-0 mt-2">Lunes a viernes de 9:00 a 19:00, sábado de 10:00 a 19:00. Domingo cerrado. El servicio debe terminar a las 19:00 o antes.</p>
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
