import { abrirModal, campo, cerrarModal, confirmar, enteroPositivo, escapar, guardar, invalidar, limpiarInvalidos, nuevoId, pesos, requerir, sembrarSiFalta, texto, textoRequerido, } from "./comun.js";
const CLAVE = "serviciosSakura";
let categoriaActiva = "";
function sembrar() {
    const filas = requerir("tablaServicios").querySelectorAll("tr");
    return Array.from(filas).map((fila, indice) => {
        const celdas = fila.querySelectorAll("td");
        const imagen = celdas[0]?.querySelector("img");
        return {
            id: `srv-${indice}`,
            nombre: texto(celdas[1] || null),
            categoria: texto(celdas[2] || null),
            duracion: texto(celdas[3] || null),
            precio: Number(texto(celdas[4] || null).replace(/\D/g, "")) || 0,
            imagen: imagen?.getAttribute("src") || "",
            alt: imagen?.getAttribute("alt") || texto(celdas[1] || null),
        };
    });
}
let servicios = sembrarSiFalta(CLAVE, sembrar);
function dibujar() {
    const tbody = requerir("tablaServicios");
    tbody.innerHTML = servicios
        .map((servicio) => {
        const oculta = categoriaActiva !== "" && servicio.categoria !== categoriaActiva;
        return `
			<tr data-categoria="${escapar(servicio.categoria)}" class="${oculta ? "d-none" : ""}">
				<td>
					<img src="${escapar(servicio.imagen)}" class="service-thumbnail" alt="${escapar(servicio.alt)}" />
				</td>
				<td class="fw-bold">${escapar(servicio.nombre)}</td>
				<td><span class="badge-salon">${escapar(servicio.categoria)}</span></td>
				<td class="text-muted"><i class="bi bi-clock me-1"></i>${escapar(servicio.duracion)}</td>
				<td class="fw-bold">${pesos(servicio.precio)}</td>
				<td><span class="estado estado-activo">Activo</span></td>
				<td class="text-end">
					<button class="btn btn-sm btn-salon me-1" type="button" data-accion="editar" data-id="${escapar(servicio.id)}" title="Editar">
						<i class="bi bi-pencil"></i>
					</button>
					<button class="btn btn-sm btn-salon" type="button" data-accion="eliminar" data-id="${escapar(servicio.id)}" title="Eliminar">
						<i class="bi bi-trash"></i>
					</button>
				</td>
			</tr>`;
    })
        .join("");
}
function abrirServicio(servicio) {
    const formulario = requerir("formServicio");
    if (formulario instanceof HTMLFormElement) {
        formulario.reset();
        limpiarInvalidos(formulario);
    }
    campo("srvId").value = servicio?.id || "";
    if (servicio) {
        campo("srvNombre").value = servicio.nombre;
        campo("srvCategoria").value = servicio.categoria;
        campo("srvDuracion").value = servicio.duracion;
        campo("srvPrecio").value = String(servicio.precio);
    }
    requerir("tituloModalServicio").textContent = servicio ? "Editar servicio" : "Nuevo servicio";
    abrirModal("modalServicio");
}
const formulario = requerir("formServicio");
if (formulario instanceof HTMLFormElement) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limpiarInvalidos(formulario);
        const nombre = campo("srvNombre");
        const categoria = campo("srvCategoria");
        const duracion = campo("srvDuracion");
        const precio = campo("srvPrecio");
        const valido = [
            invalidar(nombre, !textoRequerido(nombre.value)),
            invalidar(categoria, categoria.value.trim() === ""),
            invalidar(duracion, !textoRequerido(duracion.value)),
            invalidar(precio, !enteroPositivo(precio.value)),
        ].every(Boolean);
        if (!valido) {
            return;
        }
        const id = campo("srvId").value;
        const actual = servicios.find((servicio) => servicio.id === id);
        const guardado = {
            id: actual?.id || nuevoId("srv"),
            nombre: nombre.value.trim(),
            categoria: categoria.value,
            duracion: duracion.value.trim(),
            precio: Number(precio.value),
            imagen: actual?.imagen || "../assets/admin-servicios/botox1.png",
            alt: nombre.value.trim(),
        };
        if (actual) {
            servicios = servicios.map((servicio) => (servicio.id === id ? guardado : servicio));
        }
        else {
            servicios.push(guardado);
        }
        guardar(CLAVE, servicios);
        cerrarModal("modalServicio");
        dibujar();
    });
}
requerir("btnNuevoServicio").addEventListener("click", () => abrirServicio());
requerir("tablaServicios").addEventListener("click", (evento) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof Element)) {
        return;
    }
    const boton = objetivo.closest("[data-accion]");
    if (!(boton instanceof HTMLElement) || !boton.dataset.id) {
        return;
    }
    const servicio = servicios.find((item) => item.id === boton.dataset.id);
    if (!servicio) {
        return;
    }
    if (boton.dataset.accion === "editar") {
        abrirServicio(servicio);
    }
    if (boton.dataset.accion === "eliminar" && confirmar(`¿Eliminar ${servicio.nombre}?`)) {
        servicios = servicios.filter((item) => item.id !== servicio.id);
        guardar(CLAVE, servicios);
        dibujar();
    }
});
document.querySelectorAll("#serviciosTab [data-categoria]").forEach((boton) => {
    boton.addEventListener("click", () => {
        document.querySelectorAll("#serviciosTab .nav-link").forEach((enlace) => {
            enlace.classList.remove("active");
        });
        boton.classList.add("active");
        categoriaActiva = boton.getAttribute("data-categoria") || "";
        dibujar();
    });
});
dibujar();
