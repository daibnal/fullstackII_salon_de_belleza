
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface CitaForm {
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    correo: string;
    profesional: string;
    fechaCita: string;
    hora: string;
    tipoPago: "abono" | "total";
}

interface DetallesCita {
    nombre: string;
    apellido: string;
    servicio: string;
    profesional: string;
    fecha: string;
    hora: string;
    tipoPago: "abono" | "total";
    montoPagado: number;
    correo: string;
}

const HORARIOS = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "12:30",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00"
];

const API_URL = "http://localhost:8080/api/citas";

export function AgendarCita() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CitaForm>({
        nombre: "",
        apellido: "",
        rut: "",
        telefono: "",
        correo: "",
        profesional: "",
        fechaCita: "",
        hora: "",
        tipoPago: "abono"
    });

    const [mostrarResumen, setMostrarResumen] = useState(false);
    const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);
    const [errorDisponibilidad, setErrorDisponibilidad] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const servicioActual = {
        nombre: "Lifting y Cejas",
        precio: 25000
    };

    const montoAbono = servicioActual.precio * 0.5;

    // Obtener la fecha actual en formato YYYY-MM-DD
    const obtenerFechaActual = () => {
        const hoy = new Date();

        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    };

    // Validar RUT chileno
    const validarRut = (rut: string) => {
        const rutLimpio = rut
            .replace(/\./g, "")
            .replace(/-/g, "")
            .toUpperCase();

        if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
            return false;
        }

        const cuerpo = rutLimpio.slice(0, -1);
        const digitoIngresado = rutLimpio.slice(-1);

        let suma = 0;
        let multiplicador = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += Number(cuerpo[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resto = 11 - (suma % 11);

        let digitoCalculado = String(resto);

        if (resto === 11) digitoCalculado = "0";
        if (resto === 10) digitoCalculado = "K";

        return digitoIngresado === digitoCalculado;
    };

    // Validar que la fecha y hora no sean anteriores al momento actual
    const fechaHoraValida = (fecha: string, hora: string) => {
        const [anio, mes, dia] = fecha.split("-").map(Number);
        const [horas, minutos] = hora.split(":").map(Number);

        const fechaSeleccionada = new Date(
            anio,
            mes - 1,
            dia,
            horas,
            minutos
        );

        return fechaSeleccionada.getTime() > Date.now();
    };

    // Consultar horarios ocupados en Spring Boot
    useEffect(() => {
        if (!formData.fechaCita || !formData.profesional) {
            setHorariosOcupados([]);
            setErrorDisponibilidad("");
            return;
        }

        const controller = new AbortController();

        const consultarDisponibilidad = async () => {
            setCargandoHorarios(true);
            setErrorDisponibilidad("");
            setHorariosOcupados([]);

            try {
                const parametros = new URLSearchParams({
                    fecha: formData.fechaCita,
                    profesional: formData.profesional
                });

                const respuesta = await fetch(
                    `${API_URL}/disponibilidad?${parametros}`,
                    { signal: controller.signal }
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo consultar la disponibilidad.");
                }

                const datos = await respuesta.json();

                setHorariosOcupados(datos.horariosOcupados || []);

            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setErrorDisponibilidad(
                    "No se pudieron cargar los horarios. Intenta nuevamente."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setCargandoHorarios(false);
                }
            }
        };

        consultarDisponibilidad();

        return () => controller.abort();

    }, [formData.fechaCita, formData.profesional]);

    // Actualizar campos del formulario
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;

        setMensajeError("");

        setFormData(prev => ({
            ...prev,
            [id]: value,
            ...(id === "fechaCita" || id === "profesional"
                ? { hora: "" }
                : {})
        }));
    };

    // Seleccionar horario
    const handleHoraChange = (hora: string) => {
        setFormData(prev => ({
            ...prev,
            hora
        }));

        setMensajeError("");
    };

    // Seleccionar método de pago
    const handlePagoChange = (tipoPago: "abono" | "total") => {
        setFormData(prev => ({
            ...prev,
            tipoPago
        }));
    };

    // Validar todos los campos
    const validarFormulario = () => {
        if (
            !formData.nombre.trim() ||
            !formData.apellido.trim() ||
            !formData.rut.trim() ||
            !formData.telefono.trim() ||
            !formData.correo.trim() ||
            !formData.profesional ||
            !formData.fechaCita ||
            !formData.hora
        ) {
            return "Debes completar todos los campos.";
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
            return "Ingresa un nombre válido.";
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido.trim())) {
            return "Ingresa un apellido válido.";
        }

        if (!validarRut(formData.rut)) {
            return "El RUT ingresado no es válido.";
        }

        const telefonoLimpio = formData.telefono.replace(/[\s-]/g, "");

        if (!/^(?:\+?56)?9\d{8}$/.test(telefonoLimpio)) {
            return "Ingresa un teléfono válido de Chile.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            return "Ingresa un correo electrónico válido.";
        }

        if (formData.fechaCita < obtenerFechaActual()) {
            return "No puedes seleccionar una fecha pasada.";
        }

        if (!fechaHoraValida(formData.fechaCita, formData.hora)) {
            return "Selecciona un horario posterior a la hora actual.";
        }

        if (horariosOcupados.includes(formData.hora)) {
            return "Este horario ya está ocupado. Selecciona otro.";
        }

        if (errorDisponibilidad || cargandoHorarios) {
            return "Debes esperar a que se confirme la disponibilidad.";
        }

        return "";
    };

    // Primera etapa: validar y mostrar resumen
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const error = validarFormulario();

        if (error) {
            setMensajeError(error);
            return;
        }

        setMostrarResumen(true);
        setMensajeError("");
    };

    // Segunda etapa: registrar cita en Spring Boot
    const confirmarCita = async () => {
        const error = validarFormulario();

        if (error) {
            setMensajeError(error);
            setMostrarResumen(false);
            return;
        }

        setGuardando(true);
        setMensajeError("");

        const datosCita = {
            ...formData,
            servicio: servicioActual.nombre,
            total: servicioActual.precio,
            montoPagar:
                formData.tipoPago === "abono"
                    ? montoAbono
                    : servicioActual.precio
        };

        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosCita)
            });

            if (respuesta.status === 409) {
                throw new Error(
                    "Este horario acaba de ser ocupado. Selecciona otro."
                );
            }

            if (!respuesta.ok) {
                throw new Error("No se pudo registrar la cita.");
            }

            const detalles: DetallesCita = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                servicio: servicioActual.nombre,
                profesional: formData.profesional,
                fecha: formData.fechaCita,
                hora: formData.hora,
                tipoPago: formData.tipoPago,
                montoPagado: datosCita.montoPagar,
                correo: formData.correo
            };

            sessionStorage.setItem(
                "detallesCita",
                JSON.stringify(detalles)
            );

            navigate("/cita-confirmada");

        } catch (error) {
            setMensajeError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar la cita."
            );

            setMostrarResumen(false);

        } finally {
            setGuardando(false);
        }
    };

    // Pantalla de revisión antes de confirmar
    if (mostrarResumen) {
        return (
            <main className="container my-5 pt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card sketch-card p-4 shadow-sm">

                            <h2 className="h3 fw-bold text-center mb-4">
                                Revisa tu reserva
                            </h2>

                            <p>
                                <strong>Nombre:</strong> {formData.nombre} {formData.apellido}
                            </p>

                            <p>
                                <strong>RUT:</strong> {formData.rut}
                            </p>

                            <p>
                                <strong>Correo:</strong> {formData.correo}
                            </p>

                            <p>
                                <strong>Servicio:</strong> {servicioActual.nombre}
                            </p>

                            <p>
                                <strong>Profesional:</strong> {formData.profesional}
                            </p>

                            <p>
                                <strong>Fecha:</strong> {formData.fechaCita}
                            </p>

                            <p>
                                <strong>Hora:</strong> {formData.hora}
                            </p>

                            <p>
                                <strong>Total:</strong> $
                                {servicioActual.precio.toLocaleString("es-CL")}
                            </p>

                            <p>
                                <strong>Monto seleccionado:</strong> $
                                {(formData.tipoPago === "abono"
                                    ? montoAbono
                                    : servicioActual.precio
                                ).toLocaleString("es-CL")}
                            </p>

                            <p>
                                <strong>Forma de pago:</strong>{" "}
                                {formData.tipoPago === "abono"
                                    ? "Abono del 50%"
                                    : "Pago total"}
                            </p>

                            {mensajeError && (
                                <div className="alert alert-danger">
                                    {mensajeError}
                                </div>
                            )}

                            <div className="d-flex gap-2 mt-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-50"
                                    onClick={() => setMostrarResumen(false)}
                                    disabled={guardando}
                                >
                                    Volver
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-custom-primary w-50"
                                    onClick={confirmarCita}
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? "Registrando..."
                                        : "Confirmar cita"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container my-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">

                    <div className="card sketch-card p-4 shadow-sm">

                        <div className="text-center mb-4">
                            <h1
                                className="h3 fw-bold"
                                style={{ color: "var(--color-primary)" }}
                            >
                                Reserva tu Cita
                            </h1>

                            <p className="text-muted small">
                                Completa los datos para agendar tu cita.
                            </p>
                        </div>

                        <form
                            id="formAgendar"
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            {/* Nombre y apellido */}
                            <div className="row">

                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold small">
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        placeholder="Tu nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="apellido" className="form-label fw-bold small">
                                        Apellido
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        placeholder="Tu apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            {/* RUT y teléfono */}
                            <div className="row">

                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="rut" className="form-label fw-bold small">
                                        RUT
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="rut"
                                        placeholder="12345678-9"
                                        value={formData.rut}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="telefono" className="form-label fw-bold small">
                                        Teléfono
                                    </label>

                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="telefono"
                                        placeholder="+56912345678"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            {/* Correo */}
                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label fw-bold small">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    id="correo"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Servicio */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small">
                                    Servicio seleccionado
                                </label>

                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    readOnly
                                    value={servicioActual.nombre}
                                />
                            </div>

                            {/* Profesional */}
                            <div className="mb-3">
                                <label htmlFor="profesional" className="form-label fw-bold small">
                                    Profesional
                                </label>

                                <select
                                    className="form-select"
                                    id="profesional"
                                    value={formData.profesional}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Selecciona un profesional...
                                    </option>

                                    <option value="Carlos Pérez">Carlos Pérez</option>
                                    <option value="María Gómez">María Gómez</option>
                                    <option value="Valentina Soto">Valentina Soto</option>
                                    <option value="Alicia Varela">Alicia Varela</option>
                                    <option value="Sebastián Vasquez">Sebastián Vasquez</option>
                                    <option value="Lucia Garrido">Lucia Garrido</option>
                                </select>
                            </div>

                            {/* Fecha */}
                            <div className="mb-3">
                                <label htmlFor="fechaCita" className="form-label fw-bold small">
                                    Fecha de la cita
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaCita"
                                    min={obtenerFechaActual()}
                                    value={formData.fechaCita}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Horarios */}
                            <div className="mb-4">
                                <label className="form-label fw-bold small d-block">
                                    Horarios disponibles
                                </label>

                                {!formData.fechaCita || !formData.profesional ? (
                                    <p className="text-muted small">
                                        Selecciona una fecha y un profesional para ver los horarios.
                                    </p>
                                ) : cargandoHorarios ? (
                                    <p className="text-muted small">
                                        Consultando horarios...
                                    </p>
                                ) : errorDisponibilidad ? (
                                    <div className="alert alert-danger">
                                        {errorDisponibilidad}
                                    </div>
                                ) : (
                                    <div className="row g-2">
                                        {HORARIOS.map((hora) => {
                                            const ocupado = horariosOcupados.includes(hora);
                                            const pasado = !fechaHoraValida(
                                                formData.fechaCita,
                                                hora
                                            );

                                            const deshabilitado = ocupado || pasado;

                                            return (
                                                <div className="col-6" key={hora}>
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="hora"
                                                        id={`hora-${hora}`}
                                                        checked={formData.hora === hora}
                                                        onChange={() => handleHoraChange(hora)}
                                                        disabled={deshabilitado}
                                                    />

                                                    <label
                                                        className={`btn w-100 btn-sm ${
                                                            deshabilitado
                                                                ? "btn-outline-secondary disabled"
                                                                : "btn-outline-secondary"
                                                        }`}
                                                        htmlFor={`hora-${hora}`}
                                                    >
                                                        {hora}
                                                        {ocupado ? " - Ocupado" : ""}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Resumen de precios */}
                            <div className="summary-box mb-4 p-3 border rounded bg-light">
                                <h6
                                    className="fw-bold mb-3"
                                    style={{ color: "var(--color-primary)" }}
                                >
                                    <i className="bi bi-stars"></i> Resumen de tu cita
                                </h6>

                                <p className="mb-1">
                                    <strong>Servicio:</strong> {servicioActual.nombre}
                                </p>

                                <p className="mb-1">
                                    <strong>Profesional:</strong>{" "}
                                    {formData.profesional || "No seleccionado"}
                                </p>

                                <p className="mb-2">
                                    <strong>Fecha y hora:</strong>{" "}
                                    {formData.fechaCita && formData.hora
                                        ? `${formData.fechaCita} a las ${formData.hora}`
                                        : "Por definir"}
                                </p>

                                <h4 className="fw-bold text-dark">
                                    $ {servicioActual.precio.toLocaleString("es-CL")}
                                </h4>

                                <p className="mb-0">
                                    Abono (50%):{" "}
                                    <strong>
                                        $ {montoAbono.toLocaleString("es-CL")}
                                    </strong>
                                </p>
                            </div>

                            {/* Método de pago */}
                            <div className="mb-4">
                                <label className="form-label fw-bold mb-3">
                                    <i className="bi bi-credit-card"></i> Método de pago
                                </label>

                                <div className="row g-3">

                                    <div className="col-12 col-md-6">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="tipoPago"
                                            id="abono"
                                            checked={formData.tipoPago === "abono"}
                                            onChange={() => handlePagoChange("abono")}
                                        />

                                        <label
                                            className="payment-card h-100 d-block p-3 border rounded"
                                            htmlFor="abono"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-cash-stack fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Abonar (50%)</span>
                                            </div>

                                            <p className="text-muted small mb-0">
                                                Paga el 50% ahora y el resto el día de tu cita.
                                            </p>
                                        </label>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="tipoPago"
                                            id="total"
                                            checked={formData.tipoPago === "total"}
                                            onChange={() => handlePagoChange("total")}
                                        />

                                        <label
                                            className="payment-card h-100 d-block p-3 border rounded"
                                            htmlFor="total"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-credit-card-2-front fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Pagar el total</span>
                                            </div>

                                            <p className="text-muted small mb-0">
                                                Selecciona el pago completo de tu cita.
                                            </p>
                                        </label>
                                    </div>

                                </div>
                            </div>

                            {mensajeError && (
                                <div className="alert alert-danger">
                                    {mensajeError}
                                </div>
                            )}

                            {/* Botón */}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="submit"
                                    className="btn btn-custom-primary w-100 py-2"
                                >
                                    Revisar y confirmar cita
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
