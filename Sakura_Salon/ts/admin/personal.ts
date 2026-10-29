import {
	abrirModal,
	campo,
	cerrarModal,
	enteroNoNegativo,
	escapar,
	guardar,
	inicialesDe,
	invalidar,
	limpiarInvalidos,
	nombreValido,
	nuevoId,
	pesos,
	requerir,
	rutValido,
	sembrarSiFalta,
	texto,
} from "./comun.js";

interface Empleado {
	id: string;
	nombre: string;
	rut: string;
	especialidad: string;
	contrato: string;
	detalle: string;
	sueldo: number;
	comision: number;
	turno: string;
	estado: "Activa" | "Descanso" | "Ausente";
}

const CLAVE = "personalSakura";

function estadoDe(valor: string): Empleado["estado"] {
	if (valor === "Descanso" || valor === "Ausente") {
		return valor;
	}
	return "Activa";
}

function sembrar(): Empleado[] {
	return Array.from(requerir("tablaPersonal").querySelectorAll("tr")).map((fila, indice) => {
		const celdas = fila.querySelectorAll("td");
		const sueldoTexto = texto(celdas[3]?.querySelector(".fw-medium") || null);
		const comisionTexto = texto(celdas[3]?.querySelector("small") || null);
		return {
			id: `emp-${indice}`,
			nombre: texto(celdas[0]?.querySelector(".fw-bold") || null),
			rut: texto(celdas[0]?.querySelector("small") || null).replace(/^RUT:\s*/, ""),
			especialidad: texto(celdas[1] || null),
			contrato: texto(celdas[2]?.querySelector(".fw-medium") || null),
			detalle: texto(celdas[2]?.querySelector("small") || null),
			sueldo: Number(sueldoTexto.replace(/\D/g, "")) || 0,
			comision: Number(comisionTexto.replace(/\D/g, "")) || 0,
			turno: texto(celdas[4] || null),
			estado: estadoDe(texto(celdas[5] || null)),
		};
	});
}

const rutsCorregidos: Record<string, string> = {
	"18.234.567-8": "18.234.567-9",
	"19.876.543-2": "19.876.543-0",
	"17.555.444-1": "17.555.444-0",
	"16.111.222-3": "16.111.222-4",
};

const equipoGuardado = sembrarSiFalta<Empleado>(CLAVE, sembrar);
const hayRutAntiguo = equipoGuardado.some((empleado) => empleado.rut in rutsCorregidos);
let equipo = equipoGuardado.map((empleado) => ({
	...empleado,
	rut: rutsCorregidos[empleado.rut] || empleado.rut,
}));
if (hayRutAntiguo) {
	guardar(CLAVE, equipo);
}
let busqueda = "";

function iconoTurno(turno: string): string {
	if (turno.startsWith("Mañana")) return "bi-sun";
	if (turno.startsWith("Tarde")) return "bi-moon";
	if (turno.startsWith("Vacaciones")) return "bi-airplane";
	return "bi-cup-hot";
}

function claseEstado(estado: Empleado["estado"]): string {
	if (estado === "Descanso") return "estado-descanso";
	if (estado === "Ausente") return "estado-ausente";
	return "estado-activo";
}

function dibujar(): void {
	const consulta = busqueda.trim().toLowerCase();
	requerir("tablaPersonal").innerHTML = equipo
		.map((empleado) => {
			const oculta = consulta !== "" && !empleado.nombre.toLowerCase().includes(consulta);
			const fila = empleado.estado === "Ausente" ? "fila-ausente" : "";
			return `
			<tr class="${fila} ${oculta ? "d-none" : ""}" data-nombre="${escapar(empleado.nombre)}">
				<td class="ps-4">
					<div class="d-flex align-items-center gap-3">
						<div class="iniciales">${escapar(inicialesDe(empleado.nombre))}</div>
						<div>
							<div class="fw-bold">${escapar(empleado.nombre)}</div>
							<small class="text-muted">RUT: ${escapar(empleado.rut)}</small>
						</div>
					</div>
				</td>
				<td><span class="badge-salon">${escapar(empleado.especialidad)}</span></td>
				<td>
					<div class="fw-medium">${escapar(empleado.contrato)}</div>
					<small class="text-muted">${escapar(empleado.detalle)}</small>
				</td>
				<td>
					<div class="fw-medium">${pesos(empleado.sueldo)}</div>
					<small>${empleado.comision}% servicios</small>
				</td>
				<td><span class="schedule-badge"><i class="bi ${iconoTurno(empleado.turno)}"></i> ${escapar(empleado.turno)}</span></td>
				<td><span class="estado ${claseEstado(empleado.estado)}">${escapar(empleado.estado)}</span></td>
				<td class="text-end pe-4">
					<button class="btn btn-sm btn-salon me-1" type="button" data-accion="editar" data-id="${escapar(empleado.id)}" title="Editar contrato">
						<i class="bi bi-pencil"></i>
					</button>
					<button class="btn btn-sm btn-salon" type="button" data-accion="turno" data-id="${escapar(empleado.id)}" title="Asignar turno">
						<i class="bi bi-calendar2-week"></i>
					</button>
				</td>
			</tr>`;
		})
		.join("");
}

function asegurarOpcion(select: HTMLSelectElement, valor: string): void {
	if (!valor) return;
	const existe = Array.from(select.options).some((opcion) => opcion.value === valor);
	if (!existe) {
		select.add(new Option(valor, valor));
	}
}

function abrirContrato(empleado?: Empleado): void {
	const formulario = requerir("formContrato");
	if (formulario instanceof HTMLFormElement) {
		formulario.reset();
		limpiarInvalidos(formulario);
	}
	campo("empId").value = empleado?.id || "";
	const especialidad = campo("empEspecialidad");
	const contrato = campo("empContrato");
	if (especialidad instanceof HTMLSelectElement && empleado) {
		asegurarOpcion(especialidad, empleado.especialidad);
	}
	if (contrato instanceof HTMLSelectElement && empleado) {
		asegurarOpcion(contrato, empleado.contrato);
	}
	if (empleado) {
		campo("empNombre").value = empleado.nombre;
		campo("empRut").value = empleado.rut;
		especialidad.value = empleado.especialidad;
		contrato.value = empleado.contrato;
		campo("empSueldo").value = String(empleado.sueldo);
		campo("empComision").value = String(empleado.comision);
	}
	requerir("tituloModalContrato").textContent = empleado ? "Editar contrato" : "Nuevo contrato";
	abrirModal("modalContrato");
}

function abrirTurno(empleado: Empleado): void {
	const formulario = requerir("formTurno");
	if (formulario instanceof HTMLFormElement) {
		formulario.reset();
		limpiarInvalidos(formulario);
	}
	campo("turnoId").value = empleado.id;
	const turno = campo("turnoValor");
	if (turno instanceof HTMLSelectElement) {
		asegurarOpcion(turno, empleado.turno);
	}
	turno.value = empleado.turno;
	campo("turnoEstado").value = empleado.estado;
	requerir("tituloModalTurno").textContent = empleado.nombre;
	abrirModal("modalTurno");
}

const formContrato = requerir("formContrato");
if (formContrato instanceof HTMLFormElement) {
	formContrato.addEventListener("submit", (evento) => {
		evento.preventDefault();
		limpiarInvalidos(formContrato);
		const nombre = campo("empNombre");
		const rut = campo("empRut");
		const especialidad = campo("empEspecialidad");
		const contrato = campo("empContrato");
		const sueldo = campo("empSueldo");
		const comision = campo("empComision");
		const comisionNumero = Number(comision.value);
		const valido = [
			invalidar(nombre, !nombreValido(nombre.value)),
			invalidar(rut, !rutValido(rut.value)),
			invalidar(especialidad, especialidad.value.trim() === ""),
			invalidar(contrato, contrato.value.trim() === ""),
			invalidar(sueldo, !enteroNoNegativo(sueldo.value)),
			invalidar(comision, !enteroNoNegativo(comision.value) || comisionNumero > 100),
		].every(Boolean);

		if (!valido) {
			return;
		}

		const id = campo("empId").value;
		const actual = equipo.find((empleado) => empleado.id === id);
		const hoy = new Date();
		const detalleNuevo = `Desde: ${String(hoy.getDate()).padStart(2, "0")}/${String(hoy.getMonth() + 1).padStart(2, "0")}/${hoy.getFullYear()}`;
		const guardado: Empleado = {
			id: actual?.id || nuevoId("emp"),
			nombre: nombre.value.trim(),
			rut: rut.value.trim(),
			especialidad: especialidad.value,
			contrato: contrato.value,
			detalle: actual?.detalle || detalleNuevo,
			sueldo: Number(sueldo.value),
			comision: comisionNumero,
			turno: actual?.turno || "Mañana (09:00 - 15:00)",
			estado: actual?.estado || "Activa",
		};
		if (actual) {
			equipo = equipo.map((empleado) => (empleado.id === id ? guardado : empleado));
		} else {
			equipo.push(guardado);
		}
		guardar(CLAVE, equipo);
		cerrarModal("modalContrato");
		dibujar();
	});
}

const formTurno = requerir("formTurno");
if (formTurno instanceof HTMLFormElement) {
	formTurno.addEventListener("submit", (evento) => {
		evento.preventDefault();
		limpiarInvalidos(formTurno);
		const turno = campo("turnoValor");
		const estado = campo("turnoEstado");
		const valido = [
			invalidar(turno, turno.value.trim() === ""),
			invalidar(
				estado,
				estado.value !== "Activa" && estado.value !== "Descanso" && estado.value !== "Ausente"
			),
		].every(Boolean);
		if (!valido) {
			return;
		}
		const id = campo("turnoId").value;
		equipo = equipo.map((empleado) =>
			empleado.id === id
				? { ...empleado, turno: turno.value, estado: estadoDe(estado.value) }
				: empleado
		);
		guardar(CLAVE, equipo);
		cerrarModal("modalTurno");
		dibujar();
	});
}

requerir("btnNuevoContrato").addEventListener("click", () => abrirContrato());

requerir("tablaPersonal").addEventListener("click", (evento) => {
	const objetivo = evento.target;
	if (!(objetivo instanceof Element)) {
		return;
	}
	const boton = objetivo.closest("[data-accion]");
	if (!(boton instanceof HTMLElement) || !boton.dataset.id) {
		return;
	}
	const empleado = equipo.find((item) => item.id === boton.dataset.id);
	if (!empleado) {
		return;
	}
	if (boton.dataset.accion === "editar") {
		abrirContrato(empleado);
	}
	if (boton.dataset.accion === "turno") {
		abrirTurno(empleado);
	}
});

const buscador = document.getElementById("buscarEmpleado");
if (buscador instanceof HTMLInputElement) {
	buscador.addEventListener("input", () => {
		busqueda = buscador.value;
		dibujar();
	});
}

dibujar();
