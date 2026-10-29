import { abrirModal, campo, cerrarModal, enteroPositivo, escapar, guardar, invalidar, limpiarInvalidos, nuevoId, requerir, sembrarSiFalta, texto, textoRequerido, } from "./comun.js";
const CLAVE = "insumosSakura";
const valorCategoria = {
    Colorimetría: "color",
    "Cuidado Capilar": "cuidado",
    Manicura: "manicura",
    Desechables: "desechables",
};
function sembrar() {
    return Array.from(requerir("tablaInsumos").querySelectorAll("tr")).map((fila, indice) => {
        const celdas = fila.querySelectorAll("td");
        const cantidad = texto(celdas[3]?.querySelector("span") || null);
        const partes = cantidad.match(/^(\d+)\s+(\S+)/);
        const palabra = (partes?.[2] || "unidades").toLowerCase();
        return {
            id: `ins-${indice}`,
            nombre: texto(celdas[0]?.querySelector(".fw-bold") || null),
            sku: texto(celdas[0]?.querySelector("small") || null).replace(/^SKU:\s*/, ""),
            categoria: texto(celdas[1] || null),
            uso: texto(celdas[2] || null),
            stock: Number(partes?.[1] || 0),
            unidad: palabra.startsWith("paquete") ? "paquete" : "unidad",
            minimo: Number(texto(celdas[3] || null).replace(/.*Min:\s*/, "").replace(/\D/g, "")) || 0,
        };
    });
}
let insumos = sembrarSiFalta(CLAVE, sembrar);
let filtroTexto = "";
let filtroCategoria = "";
let filtroEstado = "";
function nivel(insumo) {
    if (insumo.stock <= 0)
        return "agotado";
    if (insumo.minimo > 0 && insumo.stock / insumo.minimo <= 0.25)
        return "critico";
    if (insumo.stock < insumo.minimo)
        return "bajo";
    return "optimo";
}
function ancho(insumo) {
    if (insumo.stock <= 0)
        return 0;
    if (insumo.minimo <= 0)
        return 100;
    return Math.min(100, Math.round((insumo.stock / insumo.minimo) * 100));
}
function etiquetaEstado(valor) {
    if (valor === "agotado")
        return "Agotado";
    if (valor === "critico")
        return "Crítico";
    if (valor === "bajo")
        return "Bajo";
    return "Óptimo";
}
function claseEstado(valor) {
    if (valor === "agotado")
        return "estado-agotado";
    if (valor === "critico")
        return "estado-critico";
    if (valor === "bajo")
        return "estado-bajo";
    return "estado-optimo";
}
function claseTexto(valor) {
    if (valor === "agotado" || valor === "critico")
        return "texto-critico";
    if (valor === "bajo")
        return "texto-bajo";
    return "fw-bold";
}
function claseBarra(valor) {
    if (valor === "agotado" || valor === "critico")
        return "nivel-critico";
    if (valor === "bajo")
        return "nivel-bajo";
    return "";
}
function cantidadTexto(insumo) {
    if (insumo.unidad === "paquete") {
        return insumo.stock === 1 ? "1 paquete" : `${insumo.stock} paquetes`;
    }
    return insumo.stock === 1 ? "1 unidad" : `${insumo.stock} unidades`;
}
function coincideEstado(insumo) {
    if (!filtroEstado)
        return true;
    const actual = nivel(insumo);
    if (filtroEstado === "ok")
        return actual === "optimo";
    if (filtroEstado === "critico")
        return actual === "critico" || actual === "agotado";
    return actual === filtroEstado;
}
function dibujar() {
    const consulta = filtroTexto.trim().toLowerCase();
    requerir("tablaInsumos").innerHTML = insumos
        .map((insumo) => {
        const estado = nivel(insumo);
        const visible = (consulta === "" ||
            insumo.nombre.toLowerCase().includes(consulta) ||
            insumo.sku.toLowerCase().includes(consulta)) &&
            (filtroCategoria === "" || valorCategoria[insumo.categoria] === filtroCategoria) &&
            coincideEstado(insumo);
        return `
			<tr class="${visible ? "" : "d-none"}">
				<td class="ps-4">
					<div class="fw-bold">${escapar(insumo.nombre)}</div>
					<small class="text-muted">SKU: ${escapar(insumo.sku)}</small>
				</td>
				<td><span class="badge-salon">${escapar(insumo.categoria)}</span></td>
				<td class="text-muted small">${escapar(insumo.uso)}</td>
				<td>
					<div class="d-flex justify-content-between small mb-1">
						<span class="${claseTexto(estado)}">${escapar(cantidadTexto(insumo))}</span>
						<span class="text-muted">Min: ${insumo.minimo}</span>
					</div>
					<div class="stock-progress">
						<div class="stock-bar ${claseBarra(estado)}" style="width: ${ancho(insumo)}%"></div>
					</div>
				</td>
				<td><span class="estado ${claseEstado(estado)}">${etiquetaEstado(estado)}</span></td>
				<td class="text-end pe-4">
					<button class="btn btn-sm btn-salon me-1" type="button" data-accion="sumar" data-id="${escapar(insumo.id)}" title="Añadir stock">
						<i class="bi bi-plus-circle"></i>
					</button>
					<button class="btn btn-sm btn-salon" type="button" data-accion="editar" data-id="${escapar(insumo.id)}" title="Editar">
						<i class="bi bi-pencil"></i>
					</button>
				</td>
			</tr>`;
    })
        .join("");
}
function skuNuevo(categoria) {
    const prefijos = {
        Colorimetría: "COL",
        "Cuidado Capilar": "LAV",
        Manicura: "MAN",
        Desechables: "DES",
    };
    const prefijo = prefijos[categoria] || "INS";
    const numeros = insumos
        .map((insumo) => insumo.sku)
        .filter((sku) => sku.startsWith(`${prefijo}-`))
        .map((sku) => Number(sku.split("-")[1]))
        .filter((numero) => !Number.isNaN(numero));
    const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
    return `${prefijo}-${String(siguiente).padStart(3, "0")}`;
}
function abrirProducto(insumo) {
    const formulario = requerir("formProducto");
    if (formulario instanceof HTMLFormElement) {
        formulario.reset();
        limpiarInvalidos(formulario);
    }
    campo("insId").value = insumo?.id || "";
    if (insumo) {
        campo("insNombre").value = insumo.nombre;
        campo("insCategoria").value = insumo.categoria;
        campo("insUso").value = insumo.uso;
        campo("insMinimo").value = String(insumo.minimo);
    }
    requerir("tituloModalProducto").textContent = insumo ? "Editar producto" : "Nuevo producto";
    abrirModal("modalProducto");
}
function abrirStock(insumo) {
    const formulario = requerir("formStock");
    if (formulario instanceof HTMLFormElement) {
        formulario.reset();
        limpiarInvalidos(formulario);
    }
    campo("stockId").value = insumo.id;
    requerir("tituloModalStock").textContent = insumo.nombre;
    abrirModal("modalStock");
}
const formProducto = requerir("formProducto");
if (formProducto instanceof HTMLFormElement) {
    formProducto.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limpiarInvalidos(formProducto);
        const nombre = campo("insNombre");
        const categoria = campo("insCategoria");
        const uso = campo("insUso");
        const minimo = campo("insMinimo");
        const valido = [
            invalidar(nombre, !textoRequerido(nombre.value)),
            invalidar(categoria, categoria.value.trim() === ""),
            invalidar(uso, !textoRequerido(uso.value)),
            invalidar(minimo, !enteroPositivo(minimo.value)),
        ].every(Boolean);
        if (!valido) {
            return;
        }
        const id = campo("insId").value;
        const actual = insumos.find((insumo) => insumo.id === id);
        const guardado = {
            id: actual?.id || nuevoId("ins"),
            nombre: nombre.value.trim(),
            sku: actual?.sku || skuNuevo(categoria.value),
            categoria: categoria.value,
            uso: uso.value.trim(),
            stock: actual?.stock || 0,
            unidad: actual?.unidad || "unidad",
            minimo: Number(minimo.value),
        };
        if (actual) {
            insumos = insumos.map((insumo) => (insumo.id === id ? guardado : insumo));
        }
        else {
            insumos.push(guardado);
        }
        guardar(CLAVE, insumos);
        cerrarModal("modalProducto");
        dibujar();
    });
}
const formStock = requerir("formStock");
if (formStock instanceof HTMLFormElement) {
    formStock.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limpiarInvalidos(formStock);
        const cantidad = campo("stockCantidad");
        if (!invalidar(cantidad, !enteroPositivo(cantidad.value))) {
            return;
        }
        const id = campo("stockId").value;
        insumos = insumos.map((insumo) => insumo.id === id ? { ...insumo, stock: insumo.stock + Number(cantidad.value) } : insumo);
        guardar(CLAVE, insumos);
        cerrarModal("modalStock");
        dibujar();
    });
}
requerir("btnNuevoProducto").addEventListener("click", () => abrirProducto());
requerir("tablaInsumos").addEventListener("click", (evento) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof Element)) {
        return;
    }
    const boton = objetivo.closest("[data-accion]");
    if (!(boton instanceof HTMLElement) || !boton.dataset.id) {
        return;
    }
    const insumo = insumos.find((item) => item.id === boton.dataset.id);
    if (!insumo) {
        return;
    }
    if (boton.dataset.accion === "editar")
        abrirProducto(insumo);
    if (boton.dataset.accion === "sumar")
        abrirStock(insumo);
});
function leerFiltros() {
    const buscar = document.getElementById("buscarInsumo");
    const categoria = document.getElementById("filtroCategoria");
    const estado = document.getElementById("filtroEstado");
    filtroTexto = buscar instanceof HTMLInputElement ? buscar.value : "";
    filtroCategoria = categoria instanceof HTMLSelectElement ? categoria.value : "";
    filtroEstado = estado instanceof HTMLSelectElement ? estado.value : "";
    dibujar();
}
["buscarInsumo", "filtroCategoria", "filtroEstado"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", leerFiltros);
    document.getElementById(id)?.addEventListener("change", leerFiltros);
});
dibujar();
