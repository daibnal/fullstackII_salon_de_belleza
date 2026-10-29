import { citasParaMostrar, coincideFecha, eliminarCita, filaCita, abrirNuevaCita, prepararFormularioCita, vaciarCitas, } from "./citas.js";
import { confirmar, escapar, requerir } from "./comun.js";
const PROFESIONALES = ["María", "Camila", "Javiera"];
const HORAS_BASE = ["09:00", "10:00", "11:00"];
const FECHA_EJEMPLO = "2026-10-24";
const BLOQUES_EJEMPLO = [
    {
        profesional: "María",
        hora: "09:00",
        titulo: "Corte Mujer",
        cliente: "Ana García",
        rango: "09:00 - 10:00",
        clase: "event-confirmed",
    },
    {
        profesional: "Javiera",
        hora: "09:00",
        titulo: "Balayage Completo",
        cliente: "Laura Martínez",
        rango: "09:00 - 11:00",
        clase: "event-process",
        etiqueta: "En curso",
    },
    {
        profesional: "María",
        hora: "10:00",
        titulo: "Brushing",
        cliente: "Marta López",
        rango: "10:15 - 11:00",
        clase: "event-pending",
    },
    {
        profesional: "Camila",
        hora: "10:00",
        titulo: "Manicura Permanente",
        cliente: "Valentina Soto",
        rango: "10:00 - 11:30",
        clase: "event-confirmed",
    },
    {
        profesional: "María",
        hora: "11:00",
        titulo: "",
        cliente: "",
        rango: "",
        clase: "",
        bloqueado: true,
    },
    {
        profesional: "Javiera",
        hora: "11:00",
        titulo: "Retoque Raíz",
        cliente: "Carla Gómez",
        rango: "11:30 - 12:30",
        clase: "event-confirmed",
    },
];
function fechaElegida() {
    const campoFecha = document.getElementById("fechaAgenda");
    return campoFecha instanceof HTMLInputElement ? campoFecha.value : "";
}
function dibujar() {
    const tbody = requerir("tablaCitasWeb");
    const mensaje = document.getElementById("sinCitasWeb");
    const todas = citasParaMostrar();
    const fecha = fechaElegida();
    const filas = [];
    todas.forEach((cita, indice) => {
        if (coincideFecha(cita, fecha)) {
            filas.push(filaCita(cita, indice));
        }
    });
    tbody.innerHTML = filas.join("");
    if (mensaje && filas.length === 0) {
        mensaje.textContent =
            todas.length === 0
                ? "No hay nuevas citas agendadas desde la web en este momento."
                : "No hay citas para el día seleccionado.";
        mensaje.classList.remove("d-none");
    }
    else if (mensaje) {
        mensaje.classList.add("d-none");
    }
    dibujarCalendario(fecha, todas);
}
function profesionalDe(nombre) {
    const texto = nombre.toLowerCase();
    if (texto.includes("maría") || texto.includes("maria"))
        return "María";
    if (texto.includes("camila"))
        return "Camila";
    if (texto.includes("javiera"))
        return "Javiera";
    return null;
}
function horaEnPunto(hora) {
    const coincidencia = hora.match(/(\d{2}):(\d{2})/);
    if (!coincidencia)
        return "";
    return `${coincidencia[1]}:00`;
}
function tituloFecha(iso) {
    const [anio, mes, dia] = iso.split("-").map(Number);
    if (!anio || !mes || !dia)
        return "";
    return new Date(anio, mes - 1, dia).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
function bloqueDeCita(cita) {
    const profesional = profesionalDe(cita.profesional || "");
    const hora = horaEnPunto(cita.hora || "");
    if (!profesional || !hora)
        return null;
    const cliente = `${cita.nombre || ""} ${cita.apellido || ""}`.trim() || "Cliente";
    return {
        profesional,
        hora,
        titulo: cita.servicio || "Servicio",
        cliente,
        rango: cita.hora || hora,
        clase: "event-confirmed",
    };
}
function contenidoBloque(bloque) {
    if (bloque.bloqueado) {
        return "";
    }
    const etiqueta = bloque.etiqueta
        ? `<span class="estado estado-proceso mt-1 align-self-start">${escapar(bloque.etiqueta)}</span>`
        : "";
    return `
		<div class="event-block ${bloque.clase}">
			<span class="event-title">${escapar(bloque.titulo)}</span>
			<span class="event-client">${escapar(bloque.cliente)}</span>
			<span class="event-time"><i class="bi bi-clock-history"></i> ${escapar(bloque.rango)}</span>
			${etiqueta}
		</div>`;
}
function dibujarCalendario(fecha, citas) {
    const cuerpo = document.getElementById("cuerpoCalendario");
    const titulo = document.getElementById("tituloDiaCalendario");
    if (!cuerpo)
        return;
    if (titulo)
        titulo.textContent = tituloFecha(fecha);
    const bloques = fecha === FECHA_EJEMPLO ? [...BLOQUES_EJEMPLO] : [];
    citas.forEach((cita) => {
        if (!coincideFecha(cita, fecha))
            return;
        const bloque = bloqueDeCita(cita);
        if (bloque)
            bloques.push(bloque);
    });
    const horas = [...HORAS_BASE];
    bloques.forEach((bloque) => {
        if (!horas.includes(bloque.hora))
            horas.push(bloque.hora);
    });
    horas.sort();
    cuerpo.innerHTML = horas
        .map((hora) => {
        const celdas = PROFESIONALES.map((profesional) => {
            const delProfesional = bloques.filter((bloque) => bloque.hora === hora && bloque.profesional === profesional);
            if (delProfesional.length === 1 && delProfesional[0].bloqueado) {
                return `<td class="bloque-libre text-center align-middle small"><i class="bi bi-cup-hot"></i> Descanso / Bloqueado</td>`;
            }
            const eventos = delProfesional.filter((bloque) => !bloque.bloqueado).map(contenidoBloque).join("");
            return eventos ? `<td>${eventos}</td>` : "<td></td>";
        }).join("");
        return `<tr><td class="time-col">${hora}</td>${celdas}</tr>`;
    })
        .join("");
}
const params = new URLSearchParams(window.location.search);
const fechaUrl = params.get("fecha");
const inputFecha = document.getElementById("fechaAgenda");
if (fechaUrl && inputFecha instanceof HTMLInputElement) {
    inputFecha.value = fechaUrl;
}
prepararFormularioCita(() => {
    dibujar();
});
requerir("btnNuevaCita").addEventListener("click", () => {
    abrirNuevaCita(fechaElegida());
});
if (inputFecha instanceof HTMLInputElement) {
    inputFecha.addEventListener("change", dibujar);
    inputFecha.addEventListener("input", dibujar);
}
requerir("btnVaciar").addEventListener("click", () => {
    if (confirmar("¿Deseas eliminar todas las reservas web?")) {
        vaciarCitas();
        dibujar();
    }
});
requerir("tablaCitasWeb").addEventListener("click", (evento) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof Element)) {
        return;
    }
    const boton = objetivo.closest("[data-accion='eliminar']");
    if (!(boton instanceof HTMLElement)) {
        return;
    }
    const indice = Number(boton.dataset.indice);
    if (Number.isNaN(indice)) {
        return;
    }
    if (confirmar("¿Estás seguro de eliminar esta cita del sistema?")) {
        eliminarCita(indice);
        dibujar();
    }
});
dibujar();
