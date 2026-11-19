import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { useCatalogo, useServiciosGestion } from "../../hooks/useServicios";
import { imagenDeServicio } from "../../assets/AssetsInterface";
import { Catalogo } from "../../services/catalogo.service";

export function Servicios() {
	const { catalogos } = useCatalogo();
	const { servicios, loading, error, recargar } = useServiciosGestion();
	const [pestana, setPestana] = useState(0);
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [modal, setModal] = useState<"" | "crear" | "editar">("");
	const [idActivo, setIdActivo] = useState(0);
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});
	const [aviso, setAviso] = useState("");

	const [formNombre, setFormNombre] = useState("");
	const [formDescripcion, setFormDescripcion] = useState("");
	const [formCategoria, setFormCategoria] = useState(0);
	const [formDuracion, setFormDuracion] = useState("");
	const [formPrecio, setFormPrecio] = useState("");

	const listaActiva = pestana === 0
		? servicios
		: servicios.filter((servicio) => servicio.categoria?.id === pestana);

	function cerrarModal() {
		setModal("");
		setIdActivo(0);
		setInvalidos({});
	}

	function abrirCrear() {
		setFormNombre("");
		setFormDescripcion("");
		setFormCategoria(catalogos[0]?.id ?? 0);
		setFormDuracion("");
		setFormPrecio("");
		setInvalidos({});
		setModal("crear");
	}

	useEffect(() => {
		if (params.get("modal") !== "crear") return;
		abrirCrear();
		navigate("/admin/servicios", { replace: true });
	}, [params, navigate]);

	function abrirEditar(id: number) {
		const servicio = servicios.find((item) => item.id === id);
		if (!servicio) return;
		setIdActivo(id);
		setFormNombre(servicio.nombre);
		setFormDescripcion(servicio.descripcion ?? "");
		setFormCategoria(servicio.categoria.id);
		setFormDuracion(String(servicio.duracionMinutos));
		setFormPrecio(String(servicio.precio));
		setInvalidos({});
		setModal("editar");
	}

	function guardar(event: FormEvent) {
		event.preventDefault();
		const precio = Number(formPrecio);
		const minutos = Number(formDuracion);
		const categoria = catalogos.find((item) => item.id === formCategoria);
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!categoria) errores.categoria = true;
		if (!Number.isFinite(minutos) || minutos <= 0) errores.duracion = true;
		if (!Number.isFinite(precio) || precio <= 0) errores.precio = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0 || !categoria) return;

		const payload = {
			nombre: formNombre.trim(),
			descripcion: formDescripcion.trim(),
			precio,
			duracionMinutos: minutos,
			activo: true,
			categoria: { id: categoria.id, nombre: categoria.nombre },
		};
		const peticion = modal === "crear"
			? Catalogo.crearServicio(payload)
			: Catalogo.updateServicio(idActivo, payload);

		void peticion
			.then(() => {
				setAviso("");
				cerrarModal();
				void recargar();
			})
			.catch(() => setAviso("No se pudo guardar el servicio."));
	}

	function borrar(id: number) {
		if (!confirm("¿Desactivar este servicio del catálogo?")) return;
		void Catalogo.disableServicio(id)
			.then(() => recargar())
			.catch(() => setAviso("No se pudo desactivar el servicio."));
	}

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Gestión de Servicios</h2>
				<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
					<i className="bi bi-plus-lg me-2"></i>Crear Nuevo Servicio
				</button>
			</div>

			{loading && <p className="text-muted">Cargando servicios...</p>}
			{error && <p className="text-danger">No se pudo cargar el catálogo.</p>}
			{aviso && <p className="text-danger">{aviso}</p>}

			<div className="row g-3 mb-4">
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Total Servicios</h6>
						<h3 className="fw-bold text-dark m-0">{servicios.length}</h3>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Categorías Activas</h6>
						<h3 className="fw-bold text-dark m-0">{catalogos.length}</h3>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Servicios activos</h6>
						<h3 className="fw-bold text-dark m-0">{servicios.filter((servicio) => servicio.activo).length}</h3>
					</div>
				</div>
			</div>

			<div className="sketch-card p-0">
				<ul className="nav nav-tabs px-3 pt-2">
					<li className="nav-item">
						<button type="button" className={`nav-link ${pestana === 0 ? "active" : ""}`} onClick={() => setPestana(0)}>
							Todos
						</button>
					</li>
					{catalogos.map((cat) => (
						<li className="nav-item" key={cat.id}>
							<button type="button" className={`nav-link ${pestana === cat.id ? "active" : ""}`} onClick={() => setPestana(cat.id)}>
								{cat.nombre}
							</button>
						</li>
					))}
				</ul>

				<div className="table-responsive p-3">
					<table className="table table-hover align-middle text-nowrap mb-0">
						<thead className="table-light">
							<tr>
								<th>Imagen</th>
								<th>Nombre del Servicio</th>
								<th>Categoría</th>
								<th>Duración Estimada</th>
								<th>Precio Base</th>
								<th>Estado</th>
								<th className="text-end">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{listaActiva.map((servicio) => (
								<tr key={servicio.id}>
									<td>
										<img src={imagenDeServicio(servicio.nombre)} className="service-thumbnail" alt={servicio.nombre} />
									</td>
									<td className="fw-bold">{servicio.nombre}</td>
									<td><span className="badge bg-secondary">{servicio.categoria?.nombre}</span></td>
									<td className="text-muted"><i className="bi bi-clock me-1"></i> {servicio.duracionMinutos} min</td>
									<td className="fw-bold text-dark">${servicio.precio.toLocaleString("es-CL")}</td>
									<td>
										{servicio.activo
											? <span className="badge bg-success-subtle text-success">Activo</span>
											: <span className="badge bg-secondary">Inactivo</span>}
									</td>
									<td className="text-end">
										<button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => abrirEditar(servicio.id)}>
											<i className="bi bi-pencil"></i>
										</button>
										{servicio.activo && (
											<button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(servicio.id)}>
												<i className="bi bi-trash"></i>
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				abierto={modal === "crear" || modal === "editar"}
				titulo={modal === "crear" ? "Nuevo servicio" : "Editar servicio"}
				onCerrar={cerrarModal}>
				<form onSubmit={guardar} className="d-flex flex-column gap-3">
					<div>
						<label className="form-label small fw-semibold">Nombre</label>
						<input type="text" className={"form-control" + (invalidos.nombre ? " is-invalid" : "")} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Descripción</label>
						<textarea className="form-control" value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Categoría</label>
						<select className={"form-select" + (invalidos.categoria ? " is-invalid" : "")} value={formCategoria} onChange={(e) => setFormCategoria(Number(e.target.value))}>
							{catalogos.map((cat) => (
								<option key={cat.id} value={cat.id}>{cat.nombre}</option>
							))}
						</select>
					</div>
					<div>
						<label className="form-label small fw-semibold">Duración (minutos)</label>
						<input type="number" min={1} className={"form-control" + (invalidos.duracion ? " is-invalid" : "")} value={formDuracion} onChange={(e) => setFormDuracion(e.target.value)} />
					</div>
					<div>
						<label className="form-label small fw-semibold">Precio base</label>
						<input type="number" min={1} className={"form-control" + (invalidos.precio ? " is-invalid" : "")} value={formPrecio} onChange={(e) => setFormPrecio(e.target.value)} />
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
