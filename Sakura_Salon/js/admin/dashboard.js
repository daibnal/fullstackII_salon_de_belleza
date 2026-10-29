import { abrirNuevaCita, prepararFormularioCita } from "./citas.js";
import { requerir } from "./comun.js";
prepararFormularioCita((cita) => {
    window.location.href = `admin_agenda.html?fecha=${encodeURIComponent(cita.fecha)}`;
});
requerir("btnNuevaCita").addEventListener("click", () => {
    abrirNuevaCita("");
});
