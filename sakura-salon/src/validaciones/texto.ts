export function tieneLetra(valor: string): boolean {
	return /\p{L}/u.test(valor);
}
