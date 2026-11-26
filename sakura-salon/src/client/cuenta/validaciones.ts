const regexTexto = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^(\+?56)?\s?9\d{8}$|^\d{9}$/;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 100;

export function nombreEsValido(valor: string): boolean {
	return regexTexto.test(valor.trim());
}

export function apellidoEsValido(valor: string): boolean {
	return regexTexto.test(valor.trim());
}

export function rutEsValido(valor: string): boolean {
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

export function telefonoEsValido(valor: string): boolean {
	return regexTelefono.test(valor.trim());
}

export function correoEsValido(valor: string): boolean {
	return regexCorreo.test(valor.trim());
}

export function passwordRegistroEsValido(valor: string): boolean {
	return valor.length >= PASSWORD_MIN && valor.length <= PASSWORD_MAX;
}

export function mensajePasswordRegistro(valor: string): string {
	if (valor.length > PASSWORD_MAX) {
		return "La contraseña no puede superar 100 caracteres.";
	}
	return "La contraseña debe tener al menos 6 caracteres.";
}

export function confirmacionPasswordEsValida(
	password: string,
	confirmacion: string
): boolean {
	return confirmacion === password;
}