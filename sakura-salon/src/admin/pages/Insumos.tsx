import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "../components/Modal";
import { TarjetaMetrica } from "../components/TarjetaMetrica";

type CategoriaValor = "color" | "cuidado" | "manicura" | "desechables";

type Insumo = {
	sku: string;
	nombre: string;
	categoria: string;
	categoriaValor: CategoriaValor;
	uso: string;
	cantidad: number;
	minimo: number;
	unidad: "unidad" | "paquete";
};

const categorias: Record<CategoriaValor, string> = {
	color: "Colorimetría",
	cuidado: "Cuidado Capilar",
	manicura: "Manicura",
	desechables: "Desechables",
};

const insumosIniciales: Insumo[] = [
	{ sku: "COL-001", nombre: "Decolorante Polvo Azul 500g", categoria: "Colorimetría", categoriaValor: "color", uso: "Balayage, Mechas", cantidad: 1, minimo: 4, unidad: "unidad" },
	{ sku: "TIN-060", nombre: "Tintura Tono 6.0 60ml", categoria: "Colorimetría", categoriaValor: "color", uso: "Tintura Global, Raíz", cantidad: 4, minimo: 10, unidad: "unidad" },
	{ sku: "MAN-012", nombre: "Esmalte Base Coat Gel", categoria: "Manicura", categoriaValor: "manicura", uso: "Esmaltado Permanente", cantidad: 0, minimo: 2, unidad: "unidad" },
	{ sku: "LAV-001", nombre: "Shampoo Neutro 1 Litro", categoria: "Cuidado Capilar", categoriaValor: "cuidado", uso: "Todos los lavados", cantidad: 12, minimo: 5, unidad: "unidad" },
	{ sku: "DES-005", nombre: "Toallas Desechables (Paquete 50)", categoria: "Desechables", categoriaValor: "desechables", uso: "Lavado, Secado", cantidad: 8, minimo: 3, unidad: "paquete" },
];

function etiquetaCantidad(cantidad: number, unidad: Insumo["unidad"]) {
	const palabra = unidad === "paquete"
		? (cantidad === 1 ? "paquete" : "paquetes")
		: (cantidad === 1 ? "unidad" : "unidades");
	return `${cantidad} ${palabra}`;
}

function vistaStock(item: Insumo) {
	const stock = etiquetaCantidad(item.cantidad, item.unidad);
	const ancho = item.minimo > 0
		? `${Math.min(100, Math.round((item.cantidad / item.minimo) * 100))}%`
		: "0%";

	if (item.cantidad === 0) {
		return { stock, minimo: `Min: ${item.minimo}`, ancho, barra: "bg-danger", colorStock: "text-danger", estado: "Agotado", claseEstado: "badge bg-danger", estadoValor: "critico" as const };
	}
	if (item.cantidad < item.minimo) {
		const critico = item.cantidad <= Math.max(1, Math.floor(item.minimo / 2));
		if (critico) {
			return { stock, minimo: `Min: ${item.minimo}`, ancho, barra: "bg-danger", colorStock: "text-danger", estado: "Crítico", claseEstado: "badge bg-danger", estadoValor: "critico" as const };
		}
		return { stock, minimo: `Min: ${item.minimo}`, ancho, barra: "bg-warning", colorStock: "text-warning", estado: "Bajo", claseEstado: "badge bg-warning text-dark", estadoValor: "bajo" as const };
	}
	return { stock, minimo: `Min: ${item.minimo}`, ancho, barra: "bg-success", colorStock: "text-success", estado: "Óptimo", claseEstado: "badge bg-success", estadoValor: "ok" as const };
}

type ModalTipo = "" | "crear" | "editar" | "stock";

export function Insumos() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [lista, setLista] = useState(insumosIniciales);
	const [busqueda, setBusqueda] = useState("");
	const [categoria, setCategoria] = useState("");
	const [estado, setEstado] = useState("");
	const [modal, setModal] = useState<ModalTipo>("");
	const [skuActivo, setSkuActivo] = useState("");
	const [invalidos, setInvalidos] = useState<Record<string, boolean>>({});

	const [formNombre, setFormNombre] = useState("");
	const [formSku, setFormSku] = useState("");
	const [formCategoria, setFormCategoria] = useState<CategoriaValor>("color");
	const [formUso, setFormUso] = useState("");
	const [formCantidad, setFormCantidad] = useState("1");
	const [formMinimo, setFormMinimo] = useState("1");
	const [formUnidad, setFormUnidad] = useState<Insumo["unidad"]>("unidad");
	const [formSumar, setFormSumar] = useState("");

	function cerrarModal() {
		setModal("");
		setSkuActivo("");
		setInvalidos({});
	}

	function abrirCrear() {
		setFormNombre("");
		setFormSku("");
		setFormCategoria("color");
		setFormUso("");
		setFormCantidad("1");
		setFormMinimo("1");
		setFormUnidad("unidad");
		setInvalidos({});
		setModal("crear");
	}

	useEffect(() => {
		if (params.get("modal") !== "crear") return;
		abrirCrear();
		navigate("/admin/insumos", { replace: true });
	}, [params, navigate]);

	function abrirEditar(sku: string) {
		const item = lista.find((i) => i.sku === sku);
		if (!item) return;
		setSkuActivo(sku);
		setFormNombre(item.nombre);
		setFormSku(item.sku);
		setFormCategoria(item.categoriaValor);
		setFormUso(item.uso);
		setFormCantidad(String(item.cantidad));
		setFormMinimo(String(item.minimo));
		setFormUnidad(item.unidad);
		setInvalidos({});
		setModal("editar");
	}

	function abrirStock(sku: string) {
		setSkuActivo(sku);
		setFormSumar("1");
		setInvalidos({});
		setModal("stock");
	}

	function guardarProducto(event: FormEvent) {
		event.preventDefault();
		const cantidad = Number(formCantidad);
		const minimo = Number(formMinimo);
		const errores: Record<string, boolean> = {};
		if (!formNombre.trim()) errores.nombre = true;
		if (!formSku.trim()) errores.sku = true;
		if (!formUso.trim()) errores.uso = true;
		if (!Number.isFinite(cantidad) || cantidad < 0) errores.cantidad = true;
		if (!Number.isFinite(minimo) || minimo <= 0) errores.minimo = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		const nuevo: Insumo = {
			sku: formSku.trim(),
			nombre: formNombre.trim(),
			categoria: categorias[formCategoria],
			categoriaValor: formCategoria,
			uso: formUso.trim(),
			cantidad,
			minimo,
			unidad: formUnidad,
		};

		if (modal === "crear") {
			if (lista.some((i) => i.sku === nuevo.sku)) {
				setInvalidos({ sku: true });
				return;
			}
			setLista([...lista, nuevo]);
		} else if (modal === "editar") {
			setLista(lista.map((i) => (i.sku === skuActivo ? { ...nuevo, sku: i.sku } : i)));
		}
		cerrarModal();
	}

	function guardarStock(event: FormEvent) {
		event.preventDefault();
		const suma = Number(formSumar);
		const errores: Record<string, boolean> = {};
		if (!Number.isFinite(suma) || suma <= 0) errores.sumar = true;
		setInvalidos(errores);
		if (Object.keys(errores).length > 0) return;

		setLista(lista.map((i) => (i.sku === skuActivo ? { ...i, cantidad: i.cantidad + suma } : i)));
		cerrarModal();
	}

	const texto = busqueda.trim().toLowerCase();
	const visibles = lista.filter((item) => {
		const vista = vistaStock(item);
		const coincideTexto = (item.nombre + " " + item.sku).toLowerCase().includes(texto);
		const coincideCategoria = categoria === "" || item.categoriaValor === categoria;
		const coincideEstado = estado === "" || vista.estadoValor === estado;
		return coincideTexto && coincideCategoria && coincideEstado;
	});

	const criticos = lista.filter((i) => vistaStock(i).estadoValor === "critico").length;
	const resumen = useMemo(() => [
		{ icono: "bi-boxes", claseIcono: "bg-primary-subtle text-primary", etiqueta: "Total Insumos", valor: String(lista.length) },
		{ icono: "bi-exclamation-triangle", claseIcono: "bg-danger text-white", etiqueta: "Stock Crítico", valor: String(criticos), claseTarjeta: "border-danger shadow-sm", claseEtiqueta: "text-danger mb-0 small fw-bold" },
		{ icono: "bi-cart-dash", claseIcono: "bg-warning-subtle text-warning", etiqueta: "Por Reponer", valor: String(lista.filter((i) => vistaStock(i).estadoValor === "bajo").length) },
		{ icono: "bi-currency-dollar", claseIcono: "bg-success-subtle text-success", etiqueta: "Valor Inventario", valor: "$1.2M" },
	], [lista, criticos]);

	const insumoStock = lista.find((i) => i.sku === skuActivo);

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
				<h2 className="fw-bold m-0" style={{ color: "var(--color-primary)" }}>Control de Stock</h2>
				<div className="d-flex gap-2">
					<button className="btn btn-outline-secondary" type="button">
						<i className="bi bi-file-earmark-arrow-down me-2"></i>Exportar
					</button>
					<button className="btn btn-custom-primary" type="button" onClick={abrirCrear}>
						<i className="bi bi-plus-lg me-2"></i>Nuevo Insumo
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

			<div className="sketch-card mb-4 p-3">
				<div className="row g-2">
					<div className="col-12 col-md-5">
						<div className="input-group">
							<span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
							<input
								type="text"
								className="form-control"
								placeholder="Buscar insumo (ej: Decolorante, Tintura 6.0)..."
								value={busqueda}
								onChange={(event) => setBusqueda(event.target.value)}
							/>
						</div>
					</div>
					<div className="col-12 col-md-3">
						<select className="form-select" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
							<option value="">Todas las Categorías</option>
							<option value="color">Colorimetría</option>
							<option value="cuidado">Cuidado Capilar</option>
							<option value="manicura">Manicura</option>
							<option value="desechables">Desechables</option>
						</select>
					</div>
					<div className="col-12 col-md-3">
						<select className="form-select" value={estado} onChange={(event) => setEstado(event.target.value)}>
							<option value="">Cualquier Estado</option>
							<option value="critico">Stock Crítico</option>
							<option value="bajo">Stock Bajo</option>
							<option value="ok">Stock Óptimo</option>
						</select>
					</div>
					<div className="col-12 col-md-1 d-grid">
						<button className="btn btn-outline-secondary" type="button"><i className="bi bi-funnel"></i></button>
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
								<th>Uso en Servicio</th>
								<th style={{ width: 200 }}>Nivel de Stock</th>
								<th>Estado</th>
								<th className="text-end pe-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{visibles.map((item) => {
								const v = vistaStock(item);
								return (
									<tr key={item.sku}>
										<td className="ps-4">
											<div className="fw-bold text-dark">{item.nombre}</div>
											<small className="text-muted">SKU: {item.sku}</small>
										</td>
										<td><span className="badge bg-light text-dark border">{item.categoria}</span></td>
										<td className="text-muted small">{item.uso}</td>
										<td>
											<div className="d-flex justify-content-between small mb-1">
												<span className={"fw-bold " + v.colorStock}>{v.stock}</span>
												<span className="text-muted">{v.minimo}</span>
											</div>
											<div className="stock-progress">
												<div className={"stock-bar " + v.barra} style={{ width: v.ancho }}></div>
											</div>
										</td>
										<td><span className={v.claseEstado}>{v.estado}</span></td>
										<td className="text-end pe-4">
											<button className="btn btn-sm btn-outline-success me-1" type="button" title="Añadir Stock" onClick={() => abrirStock(item.sku)}>
												<i className="bi bi-plus-circle"></i>
											</button>
											<button className="btn btn-sm btn-outline-secondary" type="button" title="Editar" onClick={() => abrirEditar(item.sku)}>
												<i className="bi bi-pencil"></i>
											</button>
										</td>
									</tr>
								);
							})}
							{visibles.length === 0 && (
								<tr>
									<td colSpan={6} className="text-center text-muted py-3">No hay insumos con ese filtro.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				abierto={modal === "crear" || modal === "editar"}
				titulo={modal === "crear" ? "Nuevo insumo" : "Editar insumo"}
				onCerrar={cerrarModal}>
				<form onSubmit={guardarProducto} className="d-flex flex-column gap-3">
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
						<label className="form-label small fw-semibold">SKU</label>
						<input
							type="text"
							className={"form-control" + (invalidos.sku ? " is-invalid" : "")}
							value={formSku}
							onChange={(e) => setFormSku(e.target.value)}
							disabled={modal === "editar"}
						/>
					</div>
					<div>
						<label className="form-label small fw-semibold">Categoría</label>
						<select className="form-select" value={formCategoria} onChange={(e) => setFormCategoria(e.target.value as CategoriaValor)}>
							<option value="color">Colorimetría</option>
							<option value="cuidado">Cuidado Capilar</option>
							<option value="manicura">Manicura</option>
							<option value="desechables">Desechables</option>
						</select>
					</div>
					<div>
						<label className="form-label small fw-semibold">Uso en servicio</label>
						<input
							type="text"
							className={"form-control" + (invalidos.uso ? " is-invalid" : "")}
							value={formUso}
							onChange={(e) => setFormUso(e.target.value)}
						/>
					</div>
					<div className="row g-2">
						<div className="col-6">
							<label className="form-label small fw-semibold">Cantidad actual</label>
							<input
								type="number"
								min={0}
								className={"form-control" + (invalidos.cantidad ? " is-invalid" : "")}
								value={formCantidad}
								onChange={(e) => setFormCantidad(e.target.value)}
							/>
						</div>
						<div className="col-6">
							<label className="form-label small fw-semibold">Stock mínimo</label>
							<input
								type="number"
								min={1}
								className={"form-control" + (invalidos.minimo ? " is-invalid" : "")}
								value={formMinimo}
								onChange={(e) => setFormMinimo(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label className="form-label small fw-semibold">Unidad</label>
						<select className="form-select" value={formUnidad} onChange={(e) => setFormUnidad(e.target.value as Insumo["unidad"])}>
							<option value="unidad">Unidad</option>
							<option value="paquete">Paquete</option>
						</select>
					</div>
					<div className="d-flex justify-content-end gap-2">
						<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
						<button type="submit" className="btn btn-custom-primary">Guardar</button>
					</div>
				</form>
			</Modal>

			<Modal abierto={modal === "stock"} titulo="Añadir stock" onCerrar={cerrarModal}>
				{insumoStock && (
					<form onSubmit={guardarStock} className="d-flex flex-column gap-3">
						<p className="text-muted small mb-0">
							Producto: <strong>{insumoStock.nombre}</strong>
							<br />
							Stock actual: {etiquetaCantidad(insumoStock.cantidad, insumoStock.unidad)}
						</p>
						<div>
							<label className="form-label small fw-semibold">Cantidad a sumar</label>
							<input
								type="number"
								min={1}
								className={"form-control" + (invalidos.sumar ? " is-invalid" : "")}
								value={formSumar}
								onChange={(e) => setFormSumar(e.target.value)}
							/>
						</div>
						<div className="d-flex justify-content-end gap-2">
							<button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>Cancelar</button>
							<button type="submit" className="btn btn-custom-primary">Confirmar</button>
						</div>
					</form>
				)}
			</Modal>
		</>
	);
}
