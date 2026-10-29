interface InstanciaModal {
	show(): void;
	hide(): void;
}

interface BootstrapGlobal {
	Modal: {
		getOrCreateInstance(elemento: Element): InstanciaModal;
	};
}

function modalDe(id: string): InstanciaModal {
	const ventana = window as Window & { bootstrap?: BootstrapGlobal };
	if (!ventana.bootstrap) {
		throw new Error("Bootstrap no está disponible");
	}
	return ventana.bootstrap.Modal.getOrCreateInstance(requerir(id));
}

const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requerir(id: string): HTMLElement {
	const elemento = document.getElementById(id);
	if (!elemento) {
		throw new Error(`No existe #${id}`);
	}
	return elemento;
}

export function campo(id: string): HTMLInputElement | HTMLSelectElement {
	const elemento = requerir(id);
	if (elemento instanceof HTMLInputElement || elemento instanceof HTMLSelectElement) {
		return elemento;
	}
	throw new Error(`#${id} no es un campo`);
}

export function leerLista<T>(clave: string): T[] | null {
	const crudo = localStorage.getItem(clave);
	if (crudo === null) {
		return null;
	}
	try {
		const dato: unknown = JSON.parse(crudo);
		return Array.isArray(dato) ? (dato as T[]) : [];
	} catch {
		return [];
	}
}

export function guardar<T>(clave: string, valor: T): void {
	localStorage.setItem(clave, JSON.stringify(valor));
}

export function leerObjeto<T>(clave: string, origen: Storage = localStorage): T | null {
	const crudo = origen.getItem(clave);
	if (!crudo) {
		return null;
	}
	try {
		return JSON.parse(crudo) as T;
	} catch {
		return null;
	}
}

export function confirmar(mensaje: string): boolean {
	return confirm(mensaje);
}

export function abrirModal(id: string): void {
	modalDe(id).show();
}

export function cerrarModal(id: string): void {
	modalDe(id).hide();
}

export function limpiarInvalidos(formulario: HTMLFormElement): void {
	formulario.querySelectorAll(".is-invalid").forEach((elemento) => {
		elemento.classList.remove("is-invalid");
	});
}

export function invalidar(
	control: HTMLInputElement | HTMLSelectElement,
	esInvalido: boolean
): boolean {
	control.classList.toggle("is-invalid", esInvalido);
	return !esInvalido;
}

export function nombreValido(valor: string): boolean {
	return regexNombre.test(valor.trim());
}

export function rutValido(valor: string): boolean {
	const limpio = valor.trim().replace(/\./g, "").replace(/-/g, "").toUpperCase();
	if (!/^\d{7,8}[\dK]$/.test(limpio)) {
		return false;
	}

	const cuerpo = limpio.slice(0, -1);
	const digito = limpio.slice(-1);
	let suma = 0;
	let multiplicador = 2;

	for (let i = cuerpo.length - 1; i >= 0; i--) {
		suma += Number(cuerpo[i]) * multiplicador;
		multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
	}

	const resto = 11 - (suma % 11);
	const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
	return digito === esperado;
}

export function correoValido(valor: string): boolean {
	return regexCorreo.test(valor.trim());
}

export function textoRequerido(valor: string): boolean {
	return valor.trim().length >= 2;
}

export function enteroPositivo(valor: string): boolean {
	return /^\d+$/.test(valor.trim()) && Number(valor) > 0;
}

export function enteroNoNegativo(valor: string): boolean {
	return /^\d+$/.test(valor.trim());
}

export function escapar(valor: string): string {
	return valor
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function texto(elemento: Element | null): string {
	return (elemento?.textContent || "").replace(/\s+/g, " ").trim();
}

export function pesos(monto: number): string {
	return `$${monto.toLocaleString("es-CL")}`;
}

export function nuevoId(prefijo: string): string {
	return `${prefijo}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

export function inicialesDe(nombre: string): string {
	const primera = nombre.trim().split(/\s+/)[0] || "";
	const limpio = primera.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return limpio.slice(0, 2).toUpperCase();
}

export function sembrarSiFalta<T>(clave: string, sembrar: () => T[]): T[] {
	const guardado = leerLista<T>(clave);
	if (guardado) {
		return guardado;
	}
	const datos = sembrar();
	guardar(clave, datos);
	return datos;
}
