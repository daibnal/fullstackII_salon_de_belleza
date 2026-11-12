import { useState } from "react";

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

export function AgendarCita() {
    // Estado del formulario
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

    // Simulación de servicio cargado
    const servicioActual = {
        nombre: "Lifting y Cejas",
        precio: 25000
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleHoraChange = (hora: string) => {
        setFormData((prev) => ({ ...prev, hora }));
    };

    const handlePagoChange = (tipoPago: "abono" | "total") => {
        setFormData((prev) => ({ ...prev, tipoPago }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos de la cita a enviar:", { ...formData, servicio: servicioActual.nombre, total: servicioActual.precio });
        alert("¡Cita agendada con éxito! Redirigiendo a pasarela de pago...");
    };

    const montoAbono = servicioActual.precio * 0.5;

    return (
        <main className="container my-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card sketch-card p-4 shadow-sm">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold" style={{ color: "var(--color-primary)" }}>
                                Reserva tu Cita
                            </h1>
                            <p className="text-muted small">Por favor, completa los datos requeridos para agendar</p>
                        </div>

                        <form id="formAgendar" onSubmit={handleSubmit} noValidate>
                            {/* Nombre y Apellido */}
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold small">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        required
                                        placeholder="Tu nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="apellido" className="form-label fw-bold small">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        required
                                        placeholder="Tu apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* RUT y Teléfono */}
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="rut" className="form-label fw-bold small">RUT</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="rut"
                                        required
                                        placeholder="12345678-9"
                                        value={formData.rut}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="telefono" className="form-label fw-bold small">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="telefono"
                                        required
                                        placeholder="+56912345678"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Correo Electrónico */}
                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label fw-bold small">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="correo"
                                    required
                                    placeholder="correo@ejemplo.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Servicio */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Servicio Seleccionado</label>
                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    readOnly
                                    value={servicioActual.nombre}
                                />
                            </div>

                            {/* Profesional */}
                            <div className="mb-3">
                                <label htmlFor="profesional" className="form-label fw-bold small">Profesional</label>
                                <select
                                    className="form-select"
                                    id="profesional"
                                    required
                                    value={formData.profesional}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Selecciona un profesional...</option>
                                    <option value="Carlos Pérez">Carlos Pérez</option>
                                    <option value="María Gómez">María Gómez</option>
                                    <option value="Valentina Soto">Valentina Soto</option>
                                    <option value="Alicia Varela">Alicia Varela</option>
                                    <option value="Sebastián Vasquez">Sebastián Vasquez</option>
                                    <option value="Lucia Garrido">Lucia Garrido</option>
                                </select>
                            </div>

                            {/* Fecha de la Cita */}
                            <div className="mb-3">
                                <label htmlFor="fechaCita" className="form-label fw-bold small">Fecha de la Cita</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaCita"
                                    required
                                    value={formData.fechaCita}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Selección de Horarios */}
                            <div className="mb-4">
                                <label className="form-label fw-bold small d-block">Horarios Disponibles</label>
                                <div className="row g-2">
                                    {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "12:30 PM", "14:00 PM", "15:00 PM", "16:00 PM", "17:00 PM", "18:00 PM", "19:00 PM"].map((hora, idx) => (
                                        <div className="col-6" key={idx}>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="hora"
                                                id={`h${idx}`}
                                                checked={formData.hora === hora}
                                                onChange={() => handleHoraChange(hora)}
                                            />
                                            <label className="btn btn-outline-secondary w-100 btn-sm" htmlFor={`h${idx}`}>
                                                {hora}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen de la Cita */}
                            <div className="summary-box mb-4 p-3 border rounded bg-light">
                                <h6 className="fw-bold mb-3" style={{ color: "var(--color-primary)" }}>
                                    <i className="bi bi-stars"></i> Resumen de tu cita
                                </h6>
                                <div className="row small text-muted">
                                    <div className="col-sm-6">
                                        <p className="mb-1"><strong>Servicio:</strong> {servicioActual.nombre}</p>
                                        <p className="mb-1"><strong>Profesional:</strong> {formData.profesional || "No seleccionado"}</p>
                                        <p className="mb-1"><strong>Fecha y Hora:</strong> {formData.fechaCita && formData.hora ? `${formData.fechaCita} a las ${formData.hora}` : "Por definir"}</p>
                                    </div>
                                    <div className="col-sm-6 border-start-sm ps-sm-3 mt-2 mt-sm-0">
                                        <p className="mb-1 text-uppercase text-secondary" style={{ fontSize: "0.75rem" }}>Valor final</p>
                                        <h4 className="fw-bold text-dark mb-2">$ {servicioActual.precio.toLocaleString("es-CL")}</h4>
                                        <div className="p-2 rounded bg-white border">
                                            Abono (50%): <strong>$ {montoAbono.toLocaleString("es-CL")}</strong>
                                        </div>
                                    </div>
                                </div>
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
                                        <label className="payment-card h-100 d-block p-3 border rounded" htmlFor="abono" style={{ cursor: "pointer" }}>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-cash-stack fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Abonar (50%)</span>
                                            </div>
                                            <p className="text-muted small mb-0">Paga solo el 50% ahora y el resto el día de tu cita.</p>
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
                                        <label className="payment-card h-100 d-block p-3 border rounded" htmlFor="total" style={{ cursor: "pointer" }}>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-credit-card-2-front fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Pagar el total</span>
                                            </div>
                                            <p className="text-muted small mb-0">Cancela el valor completo de tu cita ahora.</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-custom-primary w-100 py-2">
                                    Pagar y Confirmar Cita
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}