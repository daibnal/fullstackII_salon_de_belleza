import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useServicios } from "../../../hooks/useServicios";
import { useProfesionales } from "../../../hooks/useProfesionales";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { Reservas } from "../../../services/reservas.service";
import {
    nombreValido,
    rutValido,
    telefonoValido,
    correoValido,
    fechaNoAnterior,
    hoyLocal,
} from "./validacionesCita";

interface CitaForm {
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    correo: string;
    servicioId: string;
    profesionalId: string;
    fechaCita: string;
    hora: string;
}

type FormErrors = Partial<Record<keyof CitaForm, string>>;

function horaCorta(hora: string) {
    return hora.slice(0, 5);
}

export function AgendarCita() {
    const navigate = useNavigate();
    const { servicios, loading: cargandoServicios, error: errorServicios } = useServicios();
    const { profesionales, loading: cargandoProfesionales, error: errorProfesionales } = useProfesionales();
    const [formData, setFormData] = useState<CitaForm>({
        nombre: "",
        apellido: "",
        rut: "",
        telefono: "",
        correo: "",
        servicioId: "",
        profesionalId: "",
        fechaCita: "",
        hora: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState("");

    const servicioId = Number(formData.servicioId);
    const profesionalId = Number(formData.profesionalId);
    const { huecos, loading: cargandoHuecos, error: errorHuecos } = useDisponibilidad(
        profesionalId,
        servicioId,
        formData.fechaCita
    );

    const servicioActual = servicios.find((servicio) => servicio.id === servicioId);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fechaUrl = params.get("fecha");
        if (fechaUrl && fechaNoAnterior(fechaUrl)) {
            setFormData((prev) => ({ ...prev, fechaCita: fechaUrl }));
        }
    }, []);

    const clearError = (field: keyof CitaForm) => {
        if (errors[field]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "servicioId" || id === "profesionalId" || id === "fechaCita" ? { hora: "" } : {}),
        }));
        clearError(id as keyof CitaForm);
    };

    const handleHoraChange = (hora: string) => {
        setFormData((prev) => ({ ...prev, hora }));
        clearError("hora");
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!nombreValido(formData.nombre)) {
            newErrors.nombre = "Ingresa un nombre válido (solo letras, mínimo 2 caracteres).";
        }
        if (!nombreValido(formData.apellido)) {
            newErrors.apellido = "Ingresa un apellido válido (solo letras, mínimo 2 caracteres).";
        }
        if (!rutValido(formData.rut)) {
            newErrors.rut = "Ingresa un RUT válido (ej: 12345678-9).";
        }
        if (!telefonoValido(formData.telefono)) {
            newErrors.telefono = "Ingresa un teléfono móvil válido (ej: +56912345678).";
        }
        if (!correoValido(formData.correo)) {
            newErrors.correo = "Ingresa un correo electrónico válido.";
        }
        if (!formData.servicioId) {
            newErrors.servicioId = "Selecciona un servicio.";
        }
        if (!formData.profesionalId) {
            newErrors.profesionalId = "Selecciona un profesional.";
        }
        if (!fechaNoAnterior(formData.fechaCita)) {
            newErrors.fechaCita =
                formData.fechaCita.trim() !== "" && formData.fechaCita < hoyLocal()
                    ? "La fecha no puede ser anterior al día actual."
                    : "Elige una fecha válida.";
        }
        if (formData.hora.trim() === "") {
            newErrors.hora = "Selecciona un horario disponible.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorEnvio("");
        if (!validateForm()) {
            return;
        }

        setEnviando(true);
        void Reservas.crearInvitado({
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            correo: formData.correo.trim(),
            telefono: formData.telefono.trim(),
            servicioId,
            profesionalId,
            fecha: formData.fechaCita,
            horaInicio: formData.hora,
        })
            .then((resultado) => {
                const reserva = resultado.reserva;
                sessionStorage.setItem("detallesCita", JSON.stringify({
                    nombre: reserva.nombreCliente,
                    apellido: "",
                    servicio: reserva.nombreServicio,
                    profesional: reserva.nombreProfesional,
                    fecha: reserva.fecha,
                    hora: horaCorta(reserva.horaInicio),
                    correo: reserva.correoCliente,
                    montoTotal: reserva.montoTotal,
                    montoAbono: reserva.montoAbono,
                    estado: reserva.estado,
                }));
                navigate("/agendar/confirmacion");
            })
            .catch(() => {
                setErrorEnvio("No se pudo agendar la cita. Revisa el horario o intenta de nuevo.");
            })
            .finally(() => setEnviando(false));
    };

    const profesionalNombre = profesionales.find((persona) => persona.id === profesionalId)?.nombre;
    const precio = servicioActual?.precio ?? 0;

    return (
        <main className="container my-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card sketch-card p-4 shadow-sm">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold" style={{ color: "var(--color-primary)" }}>
                                Reserva tu Cita
                            </h1>
                            <p className="text-muted small">Completa los datos. No necesitas crear una cuenta.</p>
                        </div>

                        {(errorServicios || errorProfesionales) && (
                            <p className="text-danger small">No se pudo cargar el catálogo o el equipo.</p>
                        )}

                        <form id="formAgendar" onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold small">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                        id="nombre"
                                        required
                                        placeholder="Tu nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="apellido" className="form-label fw-bold small">Apellido</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                                        id="apellido"
                                        required
                                        placeholder="Tu apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                    />
                                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="rut" className="form-label fw-bold small">RUT</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.rut ? "is-invalid" : ""}`}
                                        id="rut"
                                        required
                                        placeholder="12345678-9"
                                        value={formData.rut}
                                        onChange={handleChange}
                                    />
                                    {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="telefono" className="form-label fw-bold small">Teléfono</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                                        id="telefono"
                                        required
                                        placeholder="+56912345678"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                    />
                                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label fw-bold small">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                                    id="correo"
                                    required
                                    placeholder="correo@ejemplo.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="servicioId" className="form-label fw-bold small">Servicio</label>
                                <select
                                    className={`form-select ${errors.servicioId ? "is-invalid" : ""}`}
                                    id="servicioId"
                                    value={formData.servicioId}
                                    onChange={handleChange}
                                >
                                    <option value="">{cargandoServicios ? "Cargando..." : "Selecciona un servicio..."}</option>
                                    {servicios.filter((servicio) => servicio.activo).map((servicio) => (
                                        <option key={servicio.id} value={servicio.id}>
                                            {servicio.nombre} (${servicio.precio.toLocaleString("es-CL")})
                                        </option>
                                    ))}
                                </select>
                                {errors.servicioId && <div className="invalid-feedback">{errors.servicioId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="profesionalId" className="form-label fw-bold small">Profesional</label>
                                <select
                                    className={`form-select ${errors.profesionalId ? "is-invalid" : ""}`}
                                    id="profesionalId"
                                    value={formData.profesionalId}
                                    onChange={handleChange}
                                >
                                    <option value="">{cargandoProfesionales ? "Cargando..." : "Selecciona un profesional..."}</option>
                                    {profesionales.map((persona) => (
                                        <option key={persona.id} value={persona.id}>{persona.nombre}</option>
                                    ))}
                                </select>
                                {errors.profesionalId && <div className="invalid-feedback">{errors.profesionalId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fechaCita" className="form-label fw-bold small">Fecha de la Cita</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.fechaCita ? "is-invalid" : ""}`}
                                    id="fechaCita"
                                    min={hoyLocal()}
                                    required
                                    value={formData.fechaCita}
                                    onChange={handleChange}
                                />
                                {errors.fechaCita && <div className="invalid-feedback">{errors.fechaCita}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small d-block">Horarios Disponibles</label>
                                {cargandoHuecos && <p className="text-muted small">Buscando horarios...</p>}
                                {errorHuecos && <p className="text-danger small">No se pudo consultar la disponibilidad.</p>}
                                {!cargandoHuecos && formData.servicioId && formData.profesionalId && formData.fechaCita && huecos.length === 0 && (
                                    <p className="text-muted small">No hay horarios libres para esa combinación.</p>
                                )}
                                <div className={`row g-2 ${errors.hora ? "is-invalid" : ""}`}>
                                    {huecos.map((hueco) => (
                                        <div className="col-6" key={hueco.horaInicio}>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="hora"
                                                id={`h-${hueco.horaInicio}`}
                                                checked={formData.hora === hueco.horaInicio}
                                                onChange={() => handleHoraChange(hueco.horaInicio)}
                                            />
                                            <label className="btn btn-outline-secondary w-100 btn-sm" htmlFor={`h-${hueco.horaInicio}`}>
                                                {horaCorta(hueco.horaInicio)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.hora && (
                                    <div className="invalid-feedback d-block">{errors.hora}</div>
                                )}
                            </div>

                            <div className="summary-box mb-4 p-3 border rounded bg-light">
                                <h6 className="fw-bold mb-3" style={{ color: "var(--color-primary)" }}>
                                    <i className="bi bi-stars"></i> Resumen de tu cita
                                </h6>
                                <div className="row small text-muted">
                                    <div className="col-sm-6">
                                        <p className="mb-1"><strong>Servicio:</strong> {servicioActual?.nombre || "No seleccionado"}</p>
                                        <p className="mb-1"><strong>Profesional:</strong> {profesionalNombre || "No seleccionado"}</p>
                                        <p className="mb-1"><strong>Fecha y Hora:</strong> {formData.fechaCita && formData.hora ? `${formData.fechaCita} a las ${horaCorta(formData.hora)}` : "Por definir"}</p>
                                    </div>
                                    <div className="col-sm-6 border-start-sm ps-sm-3 mt-2 mt-sm-0">
                                        <p className="mb-1 text-uppercase text-secondary" style={{ fontSize: "0.75rem" }}>Valor del servicio</p>
                                        <h4 className="fw-bold text-dark mb-2">$ {precio.toLocaleString("es-CL")}</h4>
                                        <div className="p-2 rounded bg-white border">
                                            El abono se calcula al confirmar. El salón registra el pago después.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {errorEnvio && <p className="text-danger small text-center">{errorEnvio}</p>}

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-custom-primary w-100 py-2" disabled={enviando}>
                                    {enviando ? "Agendando..." : "Confirmar cita"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
