function modalDe(id) {
    const ventana = window;
    if (!ventana.bootstrap) {
        throw new Error("Bootstrap no está disponible");
    }
    return ventana.bootstrap.Modal.getOrCreateInstance(requerir(id));
}
const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function requerir(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        throw new Error(`No existe #${id}`);
    }
    return elemento;
}
export function campo(id) {
    const elemento = requerir(id);
    if (elemento instanceof HTMLInputElement || elemento instanceof HTMLSelectElement) {
        return elemento;
    }
    throw new Error(`#${id} no es un campo`);
}
export function leerLista(clave) {
    const crudo = localStorage.getItem(clave);
    if (crudo === null) {
        return null;
    }
    try {
        const dato = JSON.parse(crudo);
        return Array.isArray(dato) ? dato : [];
    }
    catch {
        return [];
    }
}
export function guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}
export function leerObjeto(clave, origen = localStorage) {
    const crudo = origen.getItem(clave);
    if (!crudo) {
        return null;
    }
    try {
        return JSON.parse(crudo);
    }
    catch {
        return null;
    }
}
export function confirmar(mensaje) {
    return confirm(mensaje);
}
export function abrirModal(id) {
    modalDe(id).show();
}
export function cerrarModal(id) {
    modalDe(id).hide();
}
export function limpiarInvalidos(formulario) {
    formulario.querySelectorAll(".is-invalid").forEach((elemento) => {
        elemento.classList.remove("is-invalid");
    });
}
export function invalidar(control, esInvalido) {
    control.classList.toggle("is-invalid", esInvalido);
    return !esInvalido;
}
export function nombreValido(valor) {
    return regexNombre.test(valor.trim());
}
export function rutValido(valor) {
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
export function correoValido(valor) {
    return regexCorreo.test(valor.trim());
}
export function textoRequerido(valor) {
    return valor.trim().length >= 2;
}
export function enteroPositivo(valor) {
    return /^\d+$/.test(valor.trim()) && Number(valor) > 0;
}
export function enteroNoNegativo(valor) {
    return /^\d+$/.test(valor.trim());
}
export function escapar(valor) {
    return valor
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
export function texto(elemento) {
    return (elemento?.textContent || "").replace(/\s+/g, " ").trim();
}
export function pesos(monto) {
    return `$${monto.toLocaleString("es-CL")}`;
}
export function nuevoId(prefijo) {
    return `${prefijo}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}
export function inicialesDe(nombre) {
    const primera = nombre.trim().split(/\s+/)[0] || "";
    const limpio = primera.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return limpio.slice(0, 2).toUpperCase();
}
export function sembrarSiFalta(clave, sembrar) {
    const guardado = leerLista(clave);
    if (guardado) {
        return guardado;
    }
    const datos = sembrar();
    guardar(clave, datos);
    return datos;
}
