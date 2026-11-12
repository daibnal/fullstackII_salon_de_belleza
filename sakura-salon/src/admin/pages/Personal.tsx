import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { TarjetaMetrica } from "../components/TarjetaMetrica";

type Empleado = {
	rut: string;
	nombre: string;
	especialidad: string;
	contrato: string;
	detalle: string;
	salarioNum: number;
	comision: string;
	turno: string;
	estado: string;
	ausente: boolean;
};

function inicialesDe(nombre: string) {
	const partes = nombre.trim().split(/\s+/);
	if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
	return nombre.slice(0, 2).toUpperCase();
}

function pesos(valor: number) {
	return "$" + valor.toLocaleString("es-CL");
}

function vistaTurno(turno: string, estado: string) {
	if (estado === "Ausente") {
		return { icono: "bi-airplane", claseTurno: "schedule-badge text-muted" };
	}
	if (/libre/i.test(turno)) {
		return { icono: "bi-cup-hot", claseTurno: "schedule-badge bg-warning-subtle border-warning text-dark" };
	}
	if (/tarde/i.test(turno)) {
		return { icono: "bi-moon", claseTurno: "schedule-badge" };
	}
	return { icono: "bi-sun", claseTurno: "schedule-badge" };
}

function claseEstado(estado: string) {
	if (estado === "Activa") return "badge bg-success";
	if (estado === "Descanso") return "badge bg-warning text-dark";
	return "badge bg-secondary";
}

const equipoInicial: Empleado[] = [
	{ rut: "18.234.567-8", nombre: "María González", especialidad: "Peluquería", contrato: "Indefinido", detalle: "Desde: 12/01/2024", salarioNum: 500000, comision: "40% servicios", turno: "Mañana (09:00 - 15:00)", estado: "Activa", ausente: false },
	{ rut: "19.876.543-2", nombre: "Camila Soto", especialidad: "Manicura", contrato: "Plazo Fijo", detalle: "Vence: 30/11/2026", salarioNum: 450000, comision: "45% servicios", turno: "Tarde (14:00 - 20:00)", estado: "Activa", ausente: false },
	{ rut: "17.555.444-1", nombre: "Javiera Muñoz", especialidad: "Colorimetría", contrato: "Honorarios (Prestación)", detalle: "Renovación mensual", salarioNum: 0, comision: "60% servicios", turno: "Día Libre", estado: "Descanso", ausente: false },
	{ rut: "16.111.222-3", nombre: "Andrea Castro", especialidad: "Lifting y Cejas", contrato: "Indefinido", detalle: "Desde: 05/03/2023", salarioNum: 450000, comision: "40% servicios", turno: "Vacaciones", estado: "Ausente", ausente: true },
];

export function Personal() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [lista, setLista] = useState(equipoInicial);
	const [busqueda, setBusqueda] = useState("");
	const [modal, setModal] = useState<"" | "crear" | "editar">("");
	const [rutActivo, setRutActivo] = useState("");
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});

	const [formNombre, setFormNombre] = useState("");
	const [formRut, setFormRut] = useState("");
	const [formEspecialidad, setFormEspecialidad] = useState("");
	const [formContrato, setFormContrato] = useState("");
	const [formDetalle, setFormDetalle] = useState("");
	const [formSalario, setFormSalario] = useState("");
	const [formComision, setFormComision] = useState("40% servicios");
	const [formTurno, setFormTurno] = useState("");
	const [formEstado, setFormEstado] = useState("Activa");

	const texto = busqueda.trim().toLowerCase();
	const visibles = lista.filter((persona) => persona.nombre.toLowerCase().includes(texto));

	const resumen = [
		{ icono: "bi-people", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Total Staff", valor: String(lista.length) },
		{ icono: "bi-person-check", claseIcono: "bg-success-subtle text-success", etiqueta: "En Turno Hoy", valor: String(lista.filter((p) => p.estado === "Activa").length) },
		{ icono: "bi-airplane", claseIcono: "bg-warning-subtle text-warning", etiqueta: "Vacaciones Próx.", valor: String(lista.filter((p) => p.estado === "Ausente").length) },
		{ icono: "bi-file-earmark-text", claseIcono: "bg-info-subtle text-info", etiqueta: "Contratos por Renovar", valor: "0" },
	];

	function cerrarModal() {
		setModal("");
		setRutActivo("");
		setInvalidos({});
	}

	function abrirCrear() {
		setFormNombre("");
		setFormRut("");
		setFormEspecialidad("");
		setFormContrato("Indefinido");
		setFormDetalle("");
		setFormSalario("");
		setFormComision("40% servicios");
		setFormTurno("Mañana (09:00 - 15:00)");
		setFormEstado("Activa");
		setInvalidos({});
		setModal("crear");
	}

	useEffect(() => {
		if (params.get("modal") !== "crear") return;
		abrirCrear();
		navigate("/admin/personal", { replace: true });
	}, [params, navigate]);

	function abrirEditar(rut: string) {
		const p = lista.find((e) => e.rut === rut);
		if (!p) return;
		setRutActivo(rut);
		setFormNombre(p.nombre);
		setFormRut(p.rut);
		setFormEspecialidad(p.especialidad);
		setFormContrato(p.contrato);
		setFormDetalle(p.detalle);
		setFormSalario(String(p.salarioNum));
		setFormComision(p.comision);
		setFormTurno(p.turno);
		setFormEstado(p.estado);
		setInvalidos({});
		setModal("editar");
	}

	function guardar(event: FormEvent) {
		event.preventDefault();
		const salarioNum = Number(formSalario);
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formRut.trim()) errores.rut = true;
		if (!formEspecialidad.trim()) errores.especialidad = true;
		if (!formContrato.trim()) errores.contrato = true;
		if (!formDetalle.trim()) errores.detalle = true;
		if (!Number.isFinite(salarioNum) || salarioNum < 0) errores.salario = true;
		if (!formComision.trim()) errores.comision = true;
		if (!formTurno.trim()) errores.turno = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		const ausente = formEstado === "Ausente";
		const nuevo: Empleado = {
			rut: formRut.trim(),
			nombre: formNombre.trim(),
			especialidad: formEspecialidad.trim(),
			contrato: formContrato.trim(),
			detalle: formDetalle.trim(),
			salarioNum,
			comision: formComision.trim(),
			turno: formTurno.trim(),
			estado: formEstado,
			ausente,
		};

		if (modal === "crear") {
			if (lista.some((e) => e.rut === nuevo.rut)) {
				setInvalidos({ rut: true });
				return;
			}
			setLista([...lista, nuevo]);
		} else {
			setLista(lista.map((e) => (e.rut === rutActivo ? { ...nuevo, rut: e.rut } : e)));
		}
		cerrarModal();
	}

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Equipo de Trabajo</h2>
				<div className="d-flex gap-2">
					<button className="btn btn-outline-secondary" type="button">
						<i className="bi bi-calendar-range me-2"></i>Planilla Turnos
					</button>
					<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
						<i className="bi bi-person-plus me-2"></i>Nuevo Contrato
					</button>
				</div>
			</div>

			<div className="row g-4 mb-4">
				{resumen.map((item) => (
					<div className="col-12 col-sm-6 col-xl-3" key={item.etiqueta}>
						<TarjetaMetrica {...item} />
					</div>
				))}
			</div>

			<div className="sketch-card p-0 overflow-hidden mb-4">
				<div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
					<h5 className="m-0 fw-bold text-dark">Directorio y Contratos</h5>
					<div className="input-group w-auto">
						<span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
						<input
							type="text"
							className="form-control form-control-sm"
							placeholder="Buscar empleado..."
							value={busqueda}
							onChange={(event) => setBusqueda(event.target.value)}
						/>
					</div>
				</div>
				<div className="table-responsive">
					<table className="table table-hover align-middle mb-0 text-nowrap">
						<thead className="table-light">
							<tr>
								<th className="ps-4">Profesional</th>
								<th>Especialidad</th>
								<th>Tipo de Contrato</th>
								<th>Salario Base / Comisiones</th>
								<th>Turno Actual</th>
								<th>Estado</th>
								<th className="text-end pe-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{visibles.map((persona) => {
								const turno = vistaTurno(persona.turno, persona.estado);
								const salarioTexto = persona.salarioNum === 0 ? "$0 Base" : pesos(persona.salarioNum);
								return (
									<tr key={persona.rut} className={persona.ausente ? "opacity-75 bg-light" : ""}>
										<td className="ps-4">
											<div className="d-flex align-items-center gap-3">
												<div
													className={"rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" + (persona.ausente ? " opacity-50" : "")}
													style={{ width: 45, height: 45, fontSize: 16 }}>
													{inicialesDe(persona.nombre)}
												</div>
												<div>
													<div className="fw-bold text-dark">{persona.nombre}</div>
													<small className="text-muted">RUT: {persona.rut}</small>
												</div>
											</div>
										</td>
										<td><span className="badge bg-secondary-subtle text-dark border">{persona.especialidad}</span></td>
										<td>
											<div className="text-dark fw-medium">{persona.contrato}</div>
											<small className="text-muted">{persona.detalle}</small>
										</td>
										<td>
											<div className="text-dark fw-medium">{salarioTexto}</div>
											<small className="text-success">{persona.comision}</small>
										</td>
										<td>
											<span className={turno.claseTurno}><i className={"bi " + turno.icono}></i> {persona.turno}</span>
										</td>
										<td><span className={claseEstado(persona.estado)}>{persona.estado}</span></td>
										<td className="text-end pe-4">
											<button className="btn btn-sm btn-outline-secondary me-1" type="button" title="Editar Perfil/Contrato" onClick={() => abrirEditar(persona.rut)}>
												<i className="bi bi-pencil"></i>
											</button>
											<button className="btn btn-sm btn-outline-primary" type="button" title="Asignar Turnos" disabled={persona.ausente}>
												<i className="bi bi-calendar2-week"></i>
											</button>
										</td>
									</tr>
								);
							})}
							{visibles.length === 0 && (
								<tr>
									<td colSpan={7} className="text-center text-muted py-3">No hay empleados con ese nombre.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				abierto={modal === "crear" || modal === "editar"}
				titulo={modal === "crear" ? "Nuevo contrato" : "Editar contrato"}
				onCerrar={cerrarModal}
				dialogClass="modal-lg">
				<form onSubmit={guardar} className="d-flex flex-column gap-3">
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Nombre</label>
							<input type="text" className={"form-control" + (invalidos.nombre ? " is-invalid" : "")} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">RUT</label>
							<input type="text" className={"form-control" + (invalidos.rut ? " is-invalid" : "")} value={formRut} onChange={(e) => setFormRut(e.target.value)} disabled={modal === "editar"} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Especialidad</label>
							<input type="text" className={"form-control" + (invalidos.especialidad ? " is-invalid" : "")} value={formEspecialidad} onChange={(e) => setFormEspecialidad(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Tipo de contrato</label>
							<input type="text" className={"form-control" + (invalidos.contrato ? " is-invalid" : "")} value={formContrato} onChange={(e) => setFormContrato(e.target.value)} />
						</div>
					</div>
					<div>
						<label className="form-label small fw-semibold">Detalle del contrato</label>
						<input type="text" placeholder="Desde: ... / Vence: ..." className={"form-control" + (invalidos.detalle ? " is-invalid" : "")} value={formDetalle} onChange={(e) => setFormDetalle(e.target.value)} />
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Salario base</label>
							<input type="number" min={0} className={"form-control" + (invalidos.salario ? " is-invalid" : "")} value={formSalario} onChange={(e) => setFormSalario(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Comisión</label>
							<input type="text" className={"form-control" + (invalidos.comision ? " is-invalid" : "")} value={formComision} onChange={(e) => setFormComision(e.target.value)} />
						</div>
					</div>
					<div className="row g-2">
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Turno actual</label>
							<input type="text" className={"form-control" + (invalidos.turno ? " is-invalid" : "")} value={formTurno} onChange={(e) => setFormTurno(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label small fw-semibold">Estado</label>
							<select className="form-select" value={formEstado} onChange={(e) => setFormEstado(e.target.value)}>
								<option value="Activa">Activa</option>
								<option value="Descanso">Descanso</option>
								<option value="Ausente">Ausente</option>
							</select>
						</div>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Guardar</button>
					</div>
				</form>
			</Modal>
		</>
	);
}
