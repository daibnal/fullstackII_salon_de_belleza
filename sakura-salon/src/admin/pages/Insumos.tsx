import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { TarjetaMetrica } from "../components/TarjetaMetrica";
import { useInsumos } from "../../hooks/useInsumos";
import { Catalogo } from "../../services/catalogo.service";
import { Insumos as Inventario, esCritico, usosRestantesDe, type Insumo } from "../../services/insumos.service";

const CATEGORIAS_BASE = ["Cabello", "Uñas", "Ojos", "General"];

function enteroPositivo(valor: string) {
	return /^\d+$/.test(valor.trim()) && Number(valor) >= 1;
}

function vistaStock(item: Insumo) {
	const restantes = usosRestantesDe(item);
	const ancho = item.stockMinimo > 0
		? `${Math.min(100, Math.round((item.stock / Math.max(item.stock, item.stockMinimo)) * 100))}%`
		: item.stock > 0 ? "100%" : "0%";
	if (esCritico(item)) {
		return { restantes, ancho, barra: "bg-danger", colorStock: "text-danger", estado: "Crítico", claseEstado: "badge bg-danger", estadoValor: "critico" as const };
	}
	return { restantes, ancho, barra: "bg-success", colorStock: "text-success", estado: "Óptimo", claseEstado: "badge bg-success", estadoValor: "ok" as const };
}

export function Insumos() {
	const { insumos, loading, error, recargar } = useInsumos();
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [busqueda, setBusqueda] = useState("");
	const [categoria, setCategoria] = useState("");
	const [estado, setEstado] = useState("");
	const [modal, setModal] = useState<"" | "crear" | "editar" | "stock">("");
	const [activo, setActivo] = useState<Insumo | null>(null);
	const [invalidos, setInvalidos] = useState<Record<string, string>>({});
	const [aviso, setAviso] = useState("");

	const [formNombre, setFormNombre] = useState("");
	const [formCategoria, setFormCategoria] = useState("");
	const [formStock, setFormStock] = useState("1");
	const [formUsos, setFormUsos] = useState("1");
	const [formMinimo, setFormMinimo] = useState("1");
	const [formActivo, setFormActivo] = useState(true);
	const [formSumar, setFormSumar] = useState("");
	const [opcionesCategoria, setOpcionesCategoria] = useState<string[]>(CATEGORIAS_BASE);

	useEffect(() => {
		void Catalogo.getCatalogos()
			.then((lista) => {
				const nombres = lista.map((item) => item.nombre).filter((nombre) => nombre && nombre !== "General");
				const unicas = Array.from(new Set([...nombres, "General"]));
				setOpcionesCategoria(unicas.length > 0 ? unicas : CATEGORIAS_BASE);
			})
			.catch(() => setOpcionesCategoria(CATEGORIAS_BASE));
	}, []);

	const categorias = useMemo(
		() => Array.from(new Set(insumos.map((item) => item.categoria))).sort(),
		[insumos]
	);
	const texto = busqueda.trim().toLowerCase();
	const visibles = insumos.filter((item) => {
		const vista = vistaStock(item);
		const coincideTexto = item.nombre.toLowerCase().includes(texto);
		const coincideCategoria = categoria === "" || item.categoria === categoria;
		const coincideEstado = estado === "" || vista.estadoValor === estado;
		return coincideTexto && coincideCategoria && coincideEstado;
	});
	const criticos = insumos.filter((item) => vistaStock(item).estadoValor === "critico").length;
	const resumen = useMemo(() => [
		{ icono: "bi-boxes", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Total Insumos", valor: String(insumos.length) },
		{ icono: "bi-exclamation-triangle", claseIcono: "bg-danger text-white", etiqueta: "Insumos críticos", valor: String(criticos), claseTarjeta: "border-danger shadow-sm", claseEtiqueta: "text-danger mb-0 small fw-bold" },
		{ icono: "bi-check-circle", claseIcono: "bg-success-subtle text-success", etiqueta: "En nivel óptimo", valor: String(insumos.length - criticos) },
	], [insumos.length, criticos]);

	function cerrarModal() {
		setModal("");
		setActivo(null);
		setInvalidos({});
	}

	function abrirCrear() {
		setActivo(null);
		setFormNombre("");
		setFormCategoria("");
		setFormStock("1");
		setFormUsos("1");
		setFormMinimo("1");
		setFormActivo(true);
		setInvalidos({});
		setModal("crear");
	}

	useEffect(() => {
		if (params.get("modal") !== "crear") return;
		abrirCrear();
		navigate("/admin/insumos", { replace: true });
	}, [params, navigate]);

	function abrirEditar(item: Insumo) {
		setActivo(item);
		setFormNombre(item.nombre);
		setFormCategoria(item.categoria);
		setFormStock(String(item.stock));
		setFormUsos(String(item.usosPorUnidad > 0 ? item.usosPorUnidad : 1));
		setFormMinimo(String(item.stockMinimo));
		setFormActivo(item.activo);
		setInvalidos({});
		setModal("editar");
	}

	function abrirStock(item: Insumo) {
		setActivo(item);
		setFormSumar("");
		setInvalidos({});
		setModal("stock");
	}

	function guardarProducto(event: FormEvent) {
		event.preventDefault();
		const errores: Record<string, string> = {};
		if (!formNombre.trim()) errores.nombre = "Ingresa un nombre.";
		if (!formCategoria.trim()) errores.categoria = "Selecciona una categoría.";
		if (!enteroPositivo(formStock)) errores.stock = "El stock debe ser un entero positivo.";
		if (!enteroPositivo(formUsos)) errores.usos = "Los usos por unidad deben ser un entero positivo.";
		if (!enteroPositivo(formMinimo)) errores.minimo = "El stock mínimo debe ser un entero positivo.";
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		const datos = {
			nombre: formNombre.trim(),
			categoria: formCategoria.trim(),
			unidadMedida: "usos",
			stock: Number(formStock),
			usosPorUnidad: Number(formUsos),
			stockMinimo: Number(formMinimo),
			activo: formActivo,
		};
		const peticion = modal === "crear" || !activo
			? Inventario.crear(datos)
			: Inventario.actualizar(activo.id, datos);
		void peticion
			.then(() => {
				setAviso("");
				cerrarModal();
				void recargar();
			})
			.catch(() => setAviso("No se pudo guardar el insumo."));
	}

	function guardarStock(event: FormEvent) {
		event.preventDefault();
		if (!activo || !enteroPositivo(formSumar)) {
			setInvalidos({ sumar: "Ingresa un entero positivo." });
			return;
		}
		void Inventario.movimiento(activo.id, "ENTRADA", Number(formSumar))
			.then(() => {
				setAviso("");
				cerrarModal();
				void recargar();
			})
			.catch(() => setAviso("No se pudo registrar el movimiento."));
	}

	function eliminar(item: Insumo) {
		if (!confirm(`¿Eliminar ${item.nombre}?`)) return;
		void Inventario.eliminar(item.id)
			.then(() => recargar())
			.catch(() => setAviso("No se pudo eliminar el insumo."));
	}

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Control de insumos</h2>
				<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
					<i className="bi bi-plus-lg me-2"></i>Nuevo insumo
				</button>
			</div>

			{loading && <p className="text-muted">Cargando insumos...</p>}
			{error && <p className="text-danger">No se pudo cargar el inventario.</p>}
			{aviso && <p className="text-danger">{aviso}</p>}

			<div className="row g-4 mb-4">
				{resumen.map((item) => (
					<div className="col-12 col-md-4" key={item.etiqueta}>
						<TarjetaMetrica {...item} />
					</div>
				))}
			</div>

			<div className="sketch-card p-3 mb-3">
				<div className="row g-2">
					<div className="col-md-6">
						<input className="form-control" placeholder="Buscar insumo" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
					</div>
					<div className="col-md-3">
						<select className="form-select" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
							<option value="">Todas las categorías</option>
							{categorias.map((item) => <option key={item} value={item}>{item}</option>)}
						</select>
					</div>
					<div className="col-md-3">
						<select className="form-select" value={estado} onChange={(event) => setEstado(event.target.value)}>
							<option value="">Todos los estados</option>
							<option value="ok">Óptimo</option>
							<option value="critico">Crítico</option>
						</select>
					</div>
				</div>
			</div>

			<div className="sketch-card p-0 overflow-hidden">
				<div className="table-responsive">
					<table className="table table-hover align-middle mb-0 text-nowrap">
						<thead className="table-light border-bottom">
							<tr>
								<th className="ps-4">Insumo</th>
								<th>Categoría</th>
								<th>Stock</th>
								<th>Usos por unidad</th>
								<th>Usos restantes</th>
								<th>Stock mínimo</th>
								<th>Estado</th>
								<th className="text-end pe-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{visibles.map((item) => {
								const vista = vistaStock(item);
								return (
									<tr key={item.id}>
										<td className="ps-4"><div className="fw-bold text-dark">{item.nombre}</div></td>
										<td><span className="badge bg-light text-dark border">{item.categoria}</span></td>
										<td className={vista.colorStock + " fw-bold"}>{item.stock}</td>
										<td>{item.usosPorUnidad > 0 ? item.usosPorUnidad : 1}</td>
										<td>
											<div className="d-flex justify-content-between small mb-1">
												<span className={"fw-bold " + vista.colorStock}>{vista.restantes}</span>
											</div>
											<div className="stock-progress">
												<div className={"stock-bar " + vista.barra} style={{ width: vista.ancho }}></div>
											</div>
										</td>
										<td>{item.stockMinimo}</td>
										<td>
											<span className={vista.claseEstado} title={vista.estadoValor === "critico" ? "Hay que comprar: el stock está en el mínimo o por debajo" : undefined}>
												{vista.estado}
											</span>
										</td>
										<td className="text-end pe-4">
											<button className="btn btn-sm btn-outline-success me-1" type="button" onClick={() => abrirStock(item)}>
												<i className="bi bi-plus-circle"></i>
											</button>
											<button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => abrirEditar(item)}>
												<i className="bi bi-pencil"></i>
											</button>
											<button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminar(item)}>
												<i className="bi bi-trash"></i>
											</button>
										</td>
									</tr>
								);
							})}
							{visibles.length === 0 && (
								<tr><td colSpan={8} className="text-center text-muted py-3">No hay insumos con ese filtro.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal abierto={modal === "crear" || modal === "editar"} titulo={modal === "crear" ? "Nuevo insumo" : "Editar insumo"} onCerrar={cerrarModal}>
				<form onSubmit={guardarProducto} className="d-flex flex-column gap-3">
					<div>
						<label className="form-label small fw-semibold">Nombre</label>
						<input type="text" className={"form-control" + (invalidos.nombre ? " is-invalid" : "")} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
						{invalidos.nombre && <div className="invalid-feedback d-block">{invalidos.nombre}</div>}
					</div>
					<div>
						<label className="form-label small fw-semibold">Categoría</label>
						<select className={"form-select" + (invalidos.categoria ? " is-invalid" : "")} value={formCategoria} onChange={(e) => setFormCategoria(e.target.value)}>
							<option value="">Selecciona...</option>
							{(formCategoria && !opcionesCategoria.includes(formCategoria) ? [...opcionesCategoria, formCategoria] : opcionesCategoria).map((item) => (
								<option key={item} value={item}>{item}</option>
							))}
						</select>
						{invalidos.categoria && <div className="invalid-feedback d-block">{invalidos.categoria}</div>}
					</div>
					<div className="row g-2">
						<div className="col-4">
							<label className="form-label small fw-semibold">Stock</label>
							<input type="number" min={1} step={1} className={"form-control" + (invalidos.stock ? " is-invalid" : "")} value={formStock} onChange={(e) => setFormStock(e.target.value)} />
							{invalidos.stock && <div className="invalid-feedback d-block">{invalidos.stock}</div>}
						</div>
						<div className="col-4">
							<label className="form-label small fw-semibold">Usos por unidad</label>
							<input type="number" min={1} step={1} className={"form-control" + (invalidos.usos ? " is-invalid" : "")} value={formUsos} onChange={(e) => setFormUsos(e.target.value)} />
							{invalidos.usos && <div className="invalid-feedback d-block">{invalidos.usos}</div>}
						</div>
						<div className="col-4">
							<label className="form-label small fw-semibold">Stock mínimo</label>
							<input type="number" min={1} step={1} className={"form-control" + (invalidos.minimo ? " is-invalid" : "")} value={formMinimo} onChange={(e) => setFormMinimo(e.target.value)} />
							{invalidos.minimo && <div className="invalid-feedback d-block">{invalidos.minimo}</div>}
						</div>
					</div>
					<div className="form-check">
						<input id="insumoActivo" className="form-check-input" type="checkbox" checked={formActivo} onChange={(e) => setFormActivo(e.target.checked)} />
						<label className="form-check-label" htmlFor="insumoActivo">Activo</label>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Guardar</button>
					</div>
				</form>
			</Modal>

			<Modal abierto={modal === "stock"} titulo="Reponer stock" onCerrar={cerrarModal}>
				<form onSubmit={guardarStock} className="d-flex flex-column gap-3">
					<p className="mb-0">{activo?.nombre}. Suma unidades físicas. Cada unidad aporta {activo?.usosPorUnidad ?? 1} usos.</p>
					<input type="number" min={1} step={1} className={"form-control" + (invalidos.sumar ? " is-invalid" : "")} value={formSumar} onChange={(e) => setFormSumar(e.target.value)} placeholder="Unidades a sumar" />
					{invalidos.sumar && <div className="invalid-feedback d-block">{invalidos.sumar}</div>}
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Registrar entrada</button>
					</div>
				</form>
			</Modal>
		</>
	);
}
