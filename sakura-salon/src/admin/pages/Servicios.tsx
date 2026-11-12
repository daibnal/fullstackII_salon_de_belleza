import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import botox from "../../assets/admin-servicios/botox1.png";
import alisado from "../../assets/admin-servicios/alisado.png";
import coloracion from "../../assets/admin-servicios/coloracion3.png";
import corte from "../../assets/admin-servicios/corte-puntas.png";
import balayage from "../../assets/admin-servicios/balayage.png";
import masaje from "../../assets/carrusel-inicio/c1_1.png";
import retiro from "../../assets/carrusel-nails/retiro.png";
import polygel from "../../assets/carrusel-nails/polygel.png";
import manicure from "../../assets/carrusel-nails/mani-rusa.png";
import esmaltado from "../../assets/carrusel-nails/semipermanente.png";
import tradicional from "../../assets/admin-servicios/tradicional.png";
import coreano from "../../assets/admin-servicios/coreano.png";
import perfilado from "../../assets/admin-servicios/perfilado.png";
import laminado from "../../assets/admin-servicios/laminado.png";
import { Modal } from "../components/Modal";

type Categoria = "Cabello" | "Manicure" | "Lifting y Cejas";

type Servicio = {
	id: number;
	nombre: string;
	categoria: Categoria;
	duracion: string;
	precio: number;
	imagen: string;
	alt: string;
};

const pestanas = ["Todos", "Cabello", "Manicure", "Lifting y Cejas"];

const serviciosIniciales: Servicio[] = [
	{ id: 1, nombre: "Botox capilar", categoria: "Cabello", duracion: "1 hr", precio: 30000, imagen: botox, alt: "Botox capilar" },
	{ id: 2, nombre: "Alisado", categoria: "Cabello", duracion: "4 hr", precio: 70000, imagen: alisado, alt: "Alisado" },
	{ id: 3, nombre: "Coloración", categoria: "Cabello", duracion: "2 hr", precio: 45000, imagen: coloracion, alt: "Coloración" },
	{ id: 4, nombre: "Corte de puntas", categoria: "Cabello", duracion: "30 min", precio: 20000, imagen: corte, alt: "Corte de puntas" },
	{ id: 5, nombre: "Balayage", categoria: "Cabello", duracion: "5 hr", precio: 100000, imagen: balayage, alt: "Balayage" },
	{ id: 6, nombre: "Masaje hidratación", categoria: "Cabello", duracion: "1 hr", precio: 30000, imagen: masaje, alt: "Masaje hidratación" },
	{ id: 7, nombre: "Retiro", categoria: "Manicure", duracion: "30 min", precio: 10000, imagen: retiro, alt: "Retiro" },
	{ id: 8, nombre: "Polygel", categoria: "Manicure", duracion: "1 hr", precio: 35000, imagen: polygel, alt: "Polygel" },
	{ id: 9, nombre: "Manicure rusa", categoria: "Manicure", duracion: "2 hr", precio: 50000, imagen: manicure, alt: "Manicure rusa" },
	{ id: 10, nombre: "Esmaltado permanente", categoria: "Manicure", duracion: "30 min", precio: 20000, imagen: esmaltado, alt: "Esmaltado permanente" },
	{ id: 11, nombre: "Lifting tradicional", categoria: "Lifting y Cejas", duracion: "1 hr", precio: 25000, imagen: tradicional, alt: "Lifting tradicional" },
	{ id: 12, nombre: "Lifting coreano", categoria: "Lifting y Cejas", duracion: "1 hr", precio: 35000, imagen: coreano, alt: "Lifting coreano" },
	{ id: 13, nombre: "Perfilado de cejas", categoria: "Lifting y Cejas", duracion: "30 min", precio: 10000, imagen: perfilado, alt: "Perfilado de cejas" },
	{ id: 14, nombre: "Laminado de cejas", categoria: "Lifting y Cejas", duracion: "1 hr", precio: 15000, imagen: laminado, alt: "Laminado de cejas" },
];

let siguienteId = 15;

export function Servicios() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [lista, setLista] = useState(serviciosIniciales);
	const [pestana, setPestana] = useState("Todos");
	const [modal, setModal] = useState<"" | "crear" | "editar">("");
	const [idActivo, setIdActivo] = useState(0);
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});

	const [formNombre, setFormNombre] = useState("");
	const [formCategoria, setFormCategoria] = useState<Categoria>("Cabello");
	const [formDuracion, setFormDuracion] = useState("");
	const [formPrecio, setFormPrecio] = useState("");

	const visibles = lista.filter((servicio) => pestana === "Todos" || servicio.categoria === pestana);

	function cerrarModal() {
		setModal("");
		setIdActivo(0);
		setInvalidos({});
	}

	function abrirCrear() {
		setFormNombre("");
		setFormCategoria("Cabello");
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
		const s = lista.find((i) => i.id === id);
		if (!s) return;
		setIdActivo(id);
		setFormNombre(s.nombre);
		setFormCategoria(s.categoria);
		setFormDuracion(s.duracion);
		setFormPrecio(String(s.precio));
		setInvalidos({});
		setModal("editar");
	}

	function guardar(event: FormEvent) {
		event.preventDefault();
		const precio = Number(formPrecio);
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formDuracion.trim()) errores.duracion = true;
		if (!Number.isFinite(precio) || precio <= 0) errores.precio = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		if (modal === "crear") {
			const nuevo: Servicio = {
				id: siguienteId++,
				nombre: formNombre.trim(),
				categoria: formCategoria,
				duracion: formDuracion.trim(),
				precio,
				imagen: botox,
				alt: formNombre.trim(),
			};
			setLista([...lista, nuevo]);
		} else if (modal === "editar") {
			setLista(lista.map((s) => (s.id === idActivo
				? { ...s, nombre: formNombre.trim(), categoria: formCategoria, duracion: formDuracion.trim(), precio, alt: formNombre.trim() }
				: s)));
		}
		cerrarModal();
	}

	function borrar(id: number) {
		if (!confirm("¿Eliminar este servicio del catálogo?")) return;
		setLista(lista.filter((s) => s.id !== id));
	}

	return (
		<>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Gestión de Servicios</h2>
				<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
					<i className="bi bi-plus-lg me-2"></i>Crear Nuevo Servicio
				</button>
			</div>

			<div className="row g-3 mb-4">
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Total Servicios</h6>
						<h3 className="fw-bold text-dark m-0">{lista.length}</h3>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Categorías Activas</h6>
						<h3 className="fw-bold text-dark m-0">3</h3>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="sketch-card text-center p-3">
						<h6 className="text-muted mb-1">Servicio más popular</h6>
						<h3 className="fw-bold text-dark m-0 fs-5 mt-2">Manicura Rusa</h3>
					</div>
				</div>
			</div>

			<div className="sketch-card p-0">
				<ul className="nav nav-tabs px-3 pt-2">
					{pestanas.map((nombre) => (
						<li className="nav-item" key={nombre}>
							<button
								type="button"
								className={"nav-link" + (pestana === nombre ? " active" : "")}
								onClick={() => setPestana(nombre)}>
								{nombre}
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
							{visibles.map((servicio) => (
								<tr key={servicio.id}>
									<td>
										<img src={servicio.imagen} className="service-thumbnail" alt={servicio.alt} />
									</td>
									<td className="fw-bold">{servicio.nombre}</td>
									<td>
										{servicio.categoria === "Manicure" ? (
											<span className="badge" style={{ backgroundColor: "var(--color-secondary)" }}>{servicio.categoria}</span>
										) : servicio.categoria === "Lifting y Cejas" ? (
											<span className="badge bg-info text-dark">{servicio.categoria}</span>
										) : (
											<span className="badge bg-secondary">{servicio.categoria}</span>
										)}
									</td>
									<td className="text-muted"><i className="bi bi-clock me-1"></i> {servicio.duracion}</td>
									<td className="fw-bold text-dark">${servicio.precio.toLocaleString("es-CL")}</td>
									<td><span className="badge bg-success-subtle text-success">Activo</span></td>
									<td className="text-end">
										<button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => abrirEditar(servicio.id)}>
											<i className="bi bi-pencil"></i>
										</button>
										<button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(servicio.id)}>
											<i className="bi bi-trash"></i>
										</button>
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
						<input
							type="text"
							className={"form-control" + (invalidos.nombre ? " is-invalid" : "")}
							value={formNombre}
							onChange={(e) => setFormNombre(e.target.value)}
						/>
					</div>
					<div>
						<label className="form-label small fw-semibold">Categoría</label>
						<select className="form-select" value={formCategoria} onChange={(e) => setFormCategoria(e.target.value as Categoria)}>
							<option value="Cabello">Cabello</option>
							<option value="Manicure">Manicure</option>
							<option value="Lifting y Cejas">Lifting y Cejas</option>
						</select>
					</div>
					<div>
						<label className="form-label small fw-semibold">Duración estimada</label>
						<input
							type="text"
							placeholder="ej: 1 hr"
							className={"form-control" + (invalidos.duracion ? " is-invalid" : "")}
							value={formDuracion}
							onChange={(e) => setFormDuracion(e.target.value)}
						/>
					</div>
					<div>
						<label className="form-label small fw-semibold">Precio base</label>
						<input
							type="number"
							min={1}
							className={"form-control" + (invalidos.precio ? " is-invalid" : "")}
							value={formPrecio}
							onChange={(e) => setFormPrecio(e.target.value)}
						/>
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
