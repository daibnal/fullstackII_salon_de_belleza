const ALIAS: Record<string, string> = {
	peluqueria: "cabello",
	pelo: "cabello",
	hair: "cabello",
	manicure: "unas",
	manicura: "unas",
	nails: "unas",
	cejas: "ojos",
	pestanas: "ojos",
	lifting: "ojos",
	eyes: "ojos",
};

export function normalizarTexto(valor: string): string {
	return valor
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

function canon(valor: string | null | undefined): string {
	const normal = normalizarTexto(valor ?? "");
	return ALIAS[normal] ?? normal;
}

export function coincideEspecialidad(especialidad: string | null | undefined, categoria: string | null | undefined): boolean {
	const esp = canon(especialidad);
	const cat = canon(categoria);
	return esp !== "" && esp === cat;
}
