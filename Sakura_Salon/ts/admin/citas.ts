import {
	abrirModal,
	campo,
	cerrarModal,
	correoValido,
	enteroNoNegativo,
	escapar,
	guardar,
	invalidar,
	leerLista,
	leerObjeto,
	limpiarInvalidos,
	nombreValido,
	pesos,
	requerir,
	rutValido,
	textoRequerido,
} from "./comun.js";

export interface Cita {
	nombre: string;
	apellido: string;
	rut?: string;
	run?: string;
	correo: string;
	servicio: string;
	profesional: string;
	fecha: string;
	hora: string;
	tipoPago: string;
	montoPagado: number;
}

const CLAVE = "citasSakura";

function hoyLocal(): string {
	const ahora = new Date();
	const mes = String(ahora.getMonth() + 1).padStart(2, "0");
	const dia = String(ahora.getDate()).padStart(2, "0");
	return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function fechaNoAnterior(valor: string): boolean {
	const fecha = valor.trim();
	return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && fecha >= hoyLocal();
}

export function leerCitas(): Cita[] {
	return leerLista<Cita>(CLAVE) || [];
}

function citaSuelta(): Cita | null {
	return leerObjeto<Cita>("detallesCita") || leerObjeto<Cita>("detallesCita", sessionStorage);
}

export function citasParaMostrar(): Cita[] {
	const lista = leerCitas();
	if (lista.length > 0) {
		return lista;
	}
	const suelta = citaSuelta();
	return suelta ? [suelta] : [];
}

export function agregarCita(cita: Cita): void {
	const lista = leerCitas();
	if (lista.length === 0) {
		const suelta = citaSuelta();
		if (suelta) {
			lista.push(suelta);
		}
	}
	lista.push(cita);
	guardar(CLAVE, lista);
	localStorage.removeItem("detallesCita");
	sessionStorage.removeItem("detallesCita");
}

export function eliminarCita(indice: number): void {
	const lista = leerCitas();
	if (lista.length === 0) {
		localStorage.removeItem("detallesCita");
		sessionStorage.removeItem("detallesCita");
		return;
	}
	lista.splice(indice, 1);
	guardar(CLAVE, lista);
	localStorage.removeItem("detallesCita");
	sessionStorage.removeItem("detallesCita");
}

export function vaciarCitas(): void {
	localStorage.removeItem(CLAVE);
	localStorage.removeItem("detallesCita");
	sessionStorage.removeItem("detallesCita");
}

export function coincideFecha(cita: Cita, fecha: string): boolean {
	if (!fecha) {
		return true;
	}
	const guardada = cita.fecha || "";
	if (guardada === fecha) {
		return true;
	}
	const partes = fecha.split("-");
	if (partes.length !== 3) {
		return false;
	}
	const [anio, mes, dia] = partes;
	return guardada.includes(`${dia}/${mes}/${anio}`) || guardada.includes(`${dia}-${mes}-${anio}`);
}

export function filaCita(cita: Cita, indice: number): string {
	const nombre = `${cita.nombre || ""} ${cita.apellido || ""}`.trim() || "Cliente";
	const correo = cita.correo || "Sin correo";
	const rut = cita.rut || cita.run || "No registrado";
	const monto = Number(cita.montoPagado) || 0;
	const pago =
		cita.tipoPago === "abono"
			? `<span class="estado estado-pendiente">Abono 50% (${pesos(monto)})</span>`
			: `<span class="estado estado-confirmada">Total (${pesos(monto)})</span>`;

	return `
		<tr>
			<td><strong>${escapar(nombre)}</strong><br><small class="text-muted">${escapar(correo)}</small></td>
			<td>${escapar(rut)}</td>
			<td>${escapar(cita.servicio || "Servicio General")}</td>
			<td>${escapar(cita.profesional || "Por asignar")}</td>
			<td>${escapar(cita.fecha || "Próximamente")}<br><small class="text-muted">${escapar(cita.hora || "")}</small></td>
			<td>${pago}</td>
			<td>
				<button class="btn btn-sm btn-salon" type="button" data-accion="eliminar" data-indice="${indice}" title="Eliminar cita">
					<i class="bi bi-trash"></i>
				</button>
			</td>
		</tr>
	`;
}

export function prepararFormularioCita(alGuardar: (cita: Cita) => void): void {
	const formulario = requerir("formCita");
	if (!(formulario instanceof HTMLFormElement)) {
		return;
	}

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		limpiarInvalidos(formulario);

		const nombre = campo("citaNombre");
		const apellido = campo("citaApellido");
		const rut = campo("citaRut");
		const correo = campo("citaCorreo");
		const servicio = campo("citaServicio");
		const profesional = campo("citaProfesional");
		const fecha = campo("citaFecha");
		const hora = campo("citaHora");
		const monto = campo("citaMonto");

		const avisoFecha = fecha.parentElement?.querySelector(".invalid-feedback");
		if (avisoFecha) {
			avisoFecha.textContent =
				fecha.value.trim() !== "" && fecha.value < hoyLocal()
					? "La fecha no puede ser anterior al día actual."
					: "Elige una fecha.";
		}

		const valido = [
			invalidar(nombre, !nombreValido(nombre.value)),
			invalidar(apellido, !nombreValido(apellido.value)),
			invalidar(rut, !rutValido(rut.value)),
			invalidar(correo, !correoValido(correo.value)),
			invalidar(servicio, !textoRequerido(servicio.value)),
			invalidar(profesional, profesional.value.trim() === ""),
			invalidar(fecha, !fechaNoAnterior(fecha.value)),
			invalidar(hora, hora.value.trim() === ""),
			invalidar(monto, !enteroNoNegativo(monto.value)),
		].every(Boolean);

		if (!valido) {
			return;
		}

		const cita: Cita = {
			nombre: nombre.value.trim(),
			apellido: apellido.value.trim(),
			rut: rut.value.trim(),
			correo: correo.value.trim(),
			servicio: servicio.value.trim(),
			profesional: profesional.value,
			fecha: fecha.value,
			hora: hora.value,
			tipoPago: "total",
			montoPagado: Number(monto.value),
		};

		agregarCita(cita);
		cerrarModal("modalCita");
		alGuardar(cita);
	});
}

export function abrirNuevaCita(fechaInicial: string): void {
	const formulario = requerir("formCita");
	if (formulario instanceof HTMLFormElement) {
		formulario.reset();
		limpiarInvalidos(formulario);
	}
	const fecha = document.getElementById("citaFecha");
	if (fecha instanceof HTMLInputElement) {
		fecha.min = hoyLocal();
		if (fechaInicial) {
			fecha.value = fechaInicial;
		}
	}
	abrirModal("modalCita");
}
