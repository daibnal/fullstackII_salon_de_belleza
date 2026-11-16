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

const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Optional Chilean phone format validation (+569XXXXXXXX or 9XXXXXXXX)
const regexTelefono = /^(\+?56)?\s?9\d{8}$/;

export function hoyLocal(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${ahora.getFullYear()}-${mes}-${dia}`;
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

export function telefonoValido(valor: string): boolean {
    return regexTelefono.test(valor.trim());
}

export function correoValido(valor: string): boolean {
    return regexCorreo.test(valor.trim());
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