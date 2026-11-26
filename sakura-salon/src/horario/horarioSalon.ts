const APERTURA_SEMANA = 9 * 60;
const APERTURA_SABADO = 10 * 60;
const CIERRE = 19 * 60;

export const TEXTO_HORARIO = [
	"Lunes a viernes: 9:00 a 19:00",
	"Sábado: 10:00 a 19:00",
	"Domingo: cerrado",
];

export function diaDeFecha(fecha: string): number | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) return null;
	const [anio, mes, dia] = fecha.split("-").map(Number);
	return new Date(anio, mes - 1, dia).getDay();
}

export function esDomingo(fecha: string): boolean {
	return diaDeFecha(fecha) === 0;
}

export function minutosDelReloj(hora: string): number {
	const partes = hora.trim().split(":");
	const horas = Number(partes[0]);
	const minutos = Number(partes[1] ?? 0);
	if (!Number.isFinite(horas) || !Number.isFinite(minutos)) return Number.NaN;
	return horas * 60 + minutos;
}

export function slotDentroDeHorario(fecha: string, horaInicio: string, duracionMinutos: number): boolean {
	const dia = diaDeFecha(fecha);
	if (dia === null || dia === 0) return false;
	const inicio = minutosDelReloj(horaInicio);
	if (!Number.isFinite(inicio)) return false;
	const apertura = dia === 6 ? APERTURA_SABADO : APERTURA_SEMANA;
	const fin = inicio + Math.max(duracionMinutos, 0);
	return inicio >= apertura && fin > inicio && fin <= CIERRE;
}

export function mensajeFueraDeHorario(fecha: string): string {
	if (esDomingo(fecha)) return "El domingo el salón está cerrado.";
	if (diaDeFecha(fecha) === 6) {
		return "El sábado atendemos de 10:00 a 19:00. El servicio debe terminar a las 19:00 o antes.";
	}
	return "De lunes a viernes atendemos de 9:00 a 19:00. El servicio debe terminar a las 19:00 o antes.";
}
