export const CLAVE_SESION = "sesionSakura";

export type Sesion = {
	id: number;
	token: string;
	rol: string;
	correo: string;
	nombre: string;
	apellido?: string;
	telefono?: string;
	rut?: string;
};

export function leerSesion(): Sesion | null {
	const crudo = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
	if (!crudo) {
		return null;
	}
	try {
		const datos = JSON.parse(crudo) as Sesion;
		if (!datos.token || !datos.rol) {
			return null;
		}
		return datos;
	} catch {
		return null;
	}
}

export function guardarSesion(sesion: Sesion, mantener: boolean) {
	sessionStorage.removeItem(CLAVE_SESION);
	localStorage.removeItem(CLAVE_SESION);
	const destino = mantener ? localStorage : sessionStorage;
	destino.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion() {
	sessionStorage.removeItem(CLAVE_SESION);
	localStorage.removeItem(CLAVE_SESION);
}

export function haySesionAdmin(): boolean {
	return leerSesion()?.rol === "ADMIN";
}

export function haySesionProfesional(): boolean {
	return leerSesion()?.rol === "PROFESIONAL";
}

export function actualizarSesion(parcial: Partial<Sesion>) {
	const actual = leerSesion();
	if (!actual) return;
	const enLocal = localStorage.getItem(CLAVE_SESION) !== null;
	guardarSesion({ ...actual, ...parcial }, enLocal);
}

export function tokenSesion(): string | null {
	return leerSesion()?.token ?? null;
}
