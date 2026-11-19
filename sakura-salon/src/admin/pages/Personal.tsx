import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { TarjetaMetrica } from "../components/TarjetaMetrica";
import { useProfesionales } from "../../hooks/useProfesionales";
import { Profesionales, type Profesional, type Turno } from "../../services/profesionales.service";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function inicialesDe(nombre: string) {
	const partes = nombre.trim().split(/\s+/);
	if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
	return nombre.slice(0, 2).toUpperCase();
}

export function Personal() {
	const { profesionales, loading, error, recargar } = useProfesionales(true);
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [busqueda, setBusqueda] = useState("");
	const [modal, setModal] = useState<"" | "crear" | "editar" | "turno">("");
	const [activo, setActivo] = useState<Profesional | null>(null);
	const [turnos, setTurnos] = useState<Turno[]>([]);
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});
	const [aviso, setAviso] = useState("");

	const [formNombre, setFormNombre] = useState("");
	const [formCorreo, setFormCorreo] = useState("");
	const [formTelefono, setFormTelefono] = useState("");
	const [formEspecialidad, setFormEspecialidad] = useState("");
	const [formActivo, setFormActivo] = useState(true);
	const [formDia, setFormDia] = useState("1");
	const [formInicio, setFormInicio] = useState("09:00");
	const [formFin, setFormFin] = useState("18:00");
	const [formAusenciaInicio, setFormAusenciaInicio] = useState("");
	const [formAusenciaFin, setFormAusenciaFin] = useState("");
	const [formMotivo, setFormMotivo] = useState("");

	const texto = busqueda.trim().toLowerCase();
	const visibles = profesionales.filter((persona) =>
		(persona.nombre + " " + persona.especialidad + " " + persona.correo).toLowerCase().includes(texto)
	);
	const activos = profesionales.filter((persona) => persona.activo).length;
	const resumen = useMemo(() => [
		{ icono: "bi-people", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Equipo", valor: String(profesionales.length) },
		{ icono: "bi-person-check", claseIcono: "bg-success-subtle text-success", etiqueta: "Activos", valor: String(activos) },
		{ icono: "bi-person-dash", claseIcono: "bg-secondary-subtle text-secondary", etiqueta: "Inactivos", valor: String(profesionales.length - activos) },
	], [profesionales.length, activos]);

	function cerrarModal() {
		setModal("");
		setActivo(null);
		setInvalidos({});
	}

	function abrirCrear() {
		setActivo(null);
		setFormNombre("");
		setFormCorreo("");
		setFormTelefono("");
		setFormEspecialidad("");
		setFormActivo(true);
		setInvalidos({});
		setModal("crear");
	}

	useEffect(() => {
		if (params.get("modal") !== "crear") return;
		abrirCrear();
		navigate("/admin/personal", { replace: true });
	}, [params, navigate]);

	function abrirEditar(persona: Profesional) {
		setActivo(persona);
		setFormNombre(persona.nombre);
		setFormCorreo(persona.correo);
		setFormTelefono(persona.telefono);
		setFormEspecialidad(persona.especialidad);
		setFormActivo(persona.activo);
		setInvalidos({});
		setModal("editar");
	}

	function abrirTurno(persona: Profesional) {
		setActivo(persona);
		setFormDia("1");
		setFormInicio("09:00");
		setFormFin("18:00");
		setFormAusenciaInicio("");
		setFormAusenciaFin("");
		setFormMotivo("");
		setModal("turno");
		void Profesionales.turnos(persona.id).then(setTurnos).catch(() => setTurnos([]));
	}

	function guardar(event: FormEvent) {
		event.preventDefault();
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formCorreo.includes("@")) errores.correo = true;
		if (!formTelefono.trim()) errores.telefono = true;
		if (!formEspecialidad.trim()) errores.especialidad = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		const datos = {
			nombre: formNombre.trim(),
			correo: formCorreo.trim(),
			telefono: formTelefono.trim(),
			especialidad: formEspecialidad.trim(),
			activo: formActivo,
		};
		const peticion = modal === "crear" || !activo
			? Profesionales.crear(datos)
			: Profesionales.actualizar(activo.id, datos);
		void peticion
			.then(() => {
				setAviso("");
				cerrarModal();
				void recargar();
			})
			.catch(() => setAviso("No se pudo guardar el profesional."));
	}

	function eliminar(persona: Profesional) {
		if (!confirm(`¿Eliminar a ${persona.nombre}?`)) return;
		void Profesionales.eliminar(persona.id)
			.then(() => recargar())
			.catch(() => setAviso("No se pudo eliminar. Puede tener citas asociadas."));
	}

	function guardarTurno(event: FormEvent) {
		event.preventDefault();
		if (!activo) return;
		void Profesionales.agregarTurno(activo.id, {
			diaSemana: Number(formDia),
			horaInicio: formInicio,
			horaFin: formFin,
		})
			.then((turno) => {
				setTurnos((prev) => [...prev, turno]);
				setAviso("");
			})
			.catch(() => setAviso("No se pudo guardar el turno."));
	}

	function guardarAusencia(event: FormEvent) {
		event.preventDefault();
		if (!activo || !formAusenciaInicio || !formAusenciaFin) return;
		void Profesionales.agregarAusencia(activo.id, {
			fechaInicio: formAusenciaInicio,
			fechaFin: formAusenciaFin,
			motivo: formMotivo.trim(),
		})
			.then(() => {
				setAviso("");
				setFormAusenciaInicio("");
				setFormAusenciaFin("");
				setFormMotivo("");
			})
			.catch(() => setAviso("No se pudo registrar la ausencia."));
	}

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Equipo de Trabajo</h2>
				<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
					<i className="bi bi-person-plus me-2"></i>Nuevo profesional
				</button>
			</div>

			{loading && <p className="text-muted">Cargando equipo...</p>}
			{error && <p className="text-danger">No se pudo cargar el personal.</p>}
			{aviso && <p className="text-danger">{aviso}</p>}

			<div className="row g-4 mb-4">
				{resumen.map((item) => (
					<div className="col-12 col-sm-6 col-xl-4" key={item.etiqueta}>
						<TarjetaMetrica {...item} />
					</div>
				))}
			</div>

			<div className="sketch-card p-0 overflow-hidden">
				<div className="p-3">
					<input className="form-control" placeholder="Buscar por nombre, correo o especialidad" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
				</div>
				<div className="table-responsive">
					<table className="table table-hover align-middle mb-0 text-nowrap">
						<thead className="table-light">
							<tr>
								<th className="ps-4">Profesional</th>
								<th>Especialidad</th>
								<th>Contacto</th>
								<th>Estado</th>
								<th className="text-end pe-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{visibles.map((persona) => (
								<tr key={persona.id}>
									<td className="ps-4">
										<div className="d-flex align-items-center gap-3">
											<div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, fontSize: 16 }}>
												{inicialesDe(persona.nombre)}
											</div>
											<div className="fw-bold text-dark">{persona.nombre}</div>
										</div>
									</td>
									<td><span className="badge bg-secondary-subtle text-dark border">{persona.especialidad}</span></td>
									<td>
										<div>{persona.correo}</div>
										<small className="text-muted">{persona.telefono}</small>
									</td>
									<td>
										{persona.activo
											? <span className="badge bg-success">Activo</span>
											: <span className="badge bg-secondary">Inactivo</span>}
									</td>
									<td className="text-end pe-4">
										<button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => abrirEditar(persona)}>
											<i className="bi bi-pencil"></i>
										</button>
										<button className="btn btn-sm btn-outline-primary me-1" type="button" onClick={() => abrirTurno(persona)}>
											<i className="bi bi-calendar2-week"></i>
										</button>
										<button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminar(persona)}>
											<i className="bi bi-trash"></i>
										</button>
									</td>
								</tr>
							))}
							{visibles.length === 0 && (
								<tr>
									<td colSpan={5} className="text-center text-muted py-3">No hay profesionales con ese filtro.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal abierto={modal === "crear" || modal === "editar"} titulo={modal === "crear" ? "Nuevo profesional" : "Editar profesional"} onCerrar={cerrarModal}>
				<form onSubmit={guardar} className="d-flex flex-column gap-3">
					<div>
						<label className="form-label small fw-semibold">Nombre</label>
						<input type="text" className={"form-control" + (invalidos.nombre ? " is-invalid" : "")} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Correo</label>
						<input type="email" className={"form-control" + (invalidos.correo ? " is-invalid" : "")} value={formCorreo} onChange={(e) => setFormCorreo(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Teléfono</label>
						<input type="tel" className={"form-control" + (invalidos.telefono ? " is-invalid" : "")} value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Especialidad</label>
						<input type="text" className={"form-control" + (invalidos.especialidad ? " is-invalid" : "")} value={formEspecialidad} onChange={(e) => setFormEspecialidad(e.target.value)} />
					</div>
					<div className="form-check">
						<input id="activoProfesional" className="form-check-input" type="checkbox" checked={formActivo} onChange={(e) => setFormActivo(e.target.checked)} />
						<label className="form-check-label" htmlFor="activoProfesional">Activo</label>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Guardar</button>
					</div>
				</form>
			</Modal>

			<Modal abierto={modal === "turno"} titulo={activo ? `Turnos de ${activo.nombre}` : "Turnos"} onCerrar={cerrarModal} dialogClass="modal-lg">
				<ul className="list-unstyled small mb-3">
					{turnos.length === 0 && <li className="text-muted">Sin turnos registrados.</li>}
					{turnos.map((turno) => (
						<li key={`${turno.id}-${turno.diaSemana}-${turno.horaInicio}`}>
							{DIAS[turno.diaSemana] || `Día ${turno.diaSemana}`}: {turno.horaInicio?.slice(0, 5)} - {turno.horaFin?.slice(0, 5)}
						</li>
					))}
				</ul>
				<form onSubmit={guardarTurno} className="row g-2 mb-4">
					<div className="col-4">
						<select className="form-select" value={formDia} onChange={(e) => setFormDia(e.target.value)}>
							{DIAS.slice(1).map((dia, indice) => <option key={dia} value={indice + 1}>{dia}</option>)}
						</select>
					</div>
					<div className="col-3"><input type="time" className="form-control" value={formInicio} onChange={(e) => setFormInicio(e.target.value)} /></div>
					<div className="col-3"><input type="time" className="form-control" value={formFin} onChange={(e) => setFormFin(e.target.value)} /></div>
					<div className="col-2"><button className="btn btn-custom-primary w-100" type="submit">Añadir</button></div>
				</form>
				<form onSubmit={guardarAusencia} className="row g-2">
					<div className="col-12"><label className="form-label small fw-semibold mb-0">Ausencia</label></div>
					<div className="col-4"><input type="date" className="form-control" value={formAusenciaInicio} onChange={(e) => setFormAusenciaInicio(e.target.value)} /></div>
					<div className="col-4"><input type="date" className="form-control" value={formAusenciaFin} onChange={(e) => setFormAusenciaFin(e.target.value)} /></div>
					<div className="col-4"><input type="text" className="form-control" placeholder="Motivo" value={formMotivo} onChange={(e) => setFormMotivo(e.target.value)} /></div>
					<div className="col-12 d-flex justify-content-end">
						<button className="btn btn-outline-secondary" type="submit">Registrar ausencia</button>
					</div>
				</form>
			</Modal>
		</>
	);
}
