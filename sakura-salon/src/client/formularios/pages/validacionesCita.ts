export interface Cita {
    nombre: string;
    apellido: string;
    rut?: string;
    run?: string;
    telefono?: string;
    correo: string;
    servicio: string;
    profesional: string;
    fecha: string;
    hora: string;
    tipoPago: "abono" | "total" | string;
    montoPagado: number;
}

export {
	nombreEsValido as nombreValido,
	rutEsValido as rutValido,
	telefonoEsValido as telefonoValido,
	correoEsValido as correoValido,
} from "../../cuenta/validaciones";

export function hoyLocal(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${ahora.getFullYear()}-${mes}-${dia}`;
}

export function fechaNoAnterior(valor: string): boolean {
    const fecha = valor.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && fecha >= hoyLocal();
}

export function guardarCitaEnStorage(cita: Cita): void {
    const CLAVE = "citasSakura";
    let lista: Cita[] = [];

    try {
        const crudo = localStorage.getItem(CLAVE);
        if (crudo) {
            const parsed = JSON.parse(crudo);
            if (Array.isArray(parsed)) lista = parsed;
        }
    } catch {
        lista = [];
    }

    // Migrate single loose appointment if present (from citas.ts)
    if (lista.length === 0) {
        const sueltaRaw = localStorage.getItem("detallesCita") || sessionStorage.getItem("detallesCita");
        if (sueltaRaw) {
            try {
                lista.push(JSON.parse(sueltaRaw));
            } catch { /* ignore */ }
        }
    }

    lista.push(cita);
    localStorage.setItem(CLAVE, JSON.stringify(lista));
    localStorage.removeItem("detallesCita");
    sessionStorage.removeItem("detallesCita");
}

export const MENSAJE_CITA_SOLAPADA =
    "Ya tienes una cita en ese horario. Elige un horario que no se cruce con tus reservas.";

const ESTADOS_QUE_OCUPAN = new Set([
    "CONFIRMADA",
    "PAGADA_COMPLETA",
    "EN_PROCESO",
    "PENDIENTE_PAGO",
]);

export interface RangoCita {
    fecha: string;
    horaInicio: string;
    horaFin?: string;
    duracionMinutos?: number;
    estado?: string;
    expiraEn?: string | null;
}

export function minutosDelDia(hora: string): number {
    const partes = hora.trim().split(":");
    const horas = Number(partes[0]);
    const minutos = Number(partes[1] ?? 0);
    if (!Number.isFinite(horas) || !Number.isFinite(minutos)) return 0;
    return horas * 60 + minutos;
}

function reservaSigueOcupando(reserva: RangoCita): boolean {
    if (reserva.estado && !ESTADOS_QUE_OCUPAN.has(reserva.estado)) return false;
    if (reserva.estado === "PENDIENTE_PAGO" && reserva.expiraEn) {
        const expira = new Date(reserva.expiraEn);
        if (!Number.isNaN(expira.getTime()) && expira.getTime() <= Date.now()) return false;
    }
    return true;
}

function finMinutos(reserva: RangoCita): number {
    const inicio = minutosDelDia(reserva.horaInicio);
    const porDuracion = inicio + Math.max(reserva.duracionMinutos ?? 0, 0);
    if (!reserva.horaFin) return porDuracion;
    const porHora = minutosDelDia(reserva.horaFin);
    if (porHora <= inicio) return porDuracion;
    return Math.max(porHora, porDuracion);
}

export function slotSolapaReservas(
    fecha: string,
    horaInicio: string,
    duracionMinutos: number,
    reservas: RangoCita[],
): boolean {
    const inicio = minutosDelDia(horaInicio);
    const fin = inicio + Math.max(duracionMinutos, 0);
    if (fin <= inicio) return false;
    return reservas.some((reserva) => {
        if (reserva.fecha !== fecha || !reservaSigueOcupando(reserva)) return false;
        const otroInicio = minutosDelDia(reserva.horaInicio);
        const otroFin = finMinutos(reserva);
        return inicio < otroFin && otroInicio < fin;
    });
}