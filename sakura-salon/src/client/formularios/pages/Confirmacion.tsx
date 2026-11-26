import { useEffect, useState } from "react";
import { assets } from "../../../assets/AssetsInterface";

interface CitaAgendada {
    servicio: string;
    profesional: string;
    fecha: string;
    hora: string;
}

interface DetalleCita {
    nombre: string;
    apellido: string;
    servicio: string;
    profesional: string;
    fecha: string;
    hora: string;
    correo: string;
    montoTotal?: number;
    montoAbono?: number;
    montoSeleccionado?: number;
    estado?: string;
    tipoPago?: "abono" | "total";
    citas?: CitaAgendada[];
}

export function CitaConfirmada() {
    const [cita, setCita] = useState<DetalleCita | null>(null);
    const citas = cita?.citas ?? [];
    const varias = citas.length > 1;

    useEffect(() => {
        // Recuperamos los datos guardados temporalmente en sessionStorage
        const datosGuardados = sessionStorage.getItem("detallesCita");
        if (datosGuardados) {
            try {
                setCita(JSON.parse(datosGuardados));
            } catch (error) {
                console.error("Error al parsear los detalles de la cita:", error);
            }
        }
    }, []);

    return (
        <div className="bg-light d-flex flex-column min-vh-100 m-0">
            {/* Navbar */}
            <nav className="navbar fixed-top bg-white shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="../index.html">
                        <img
                            src={assets.logo.src}
                            className="rounded-circle"
                            alt="Logo"
                            width="40"
                            height="40"
                        />
                        <span className="brand-title ms-2 fw-bold" style={{ color: "var(--color-primary)" }}>
                            Sakura Salón
                        </span>
                    </a>
                </div>
            </nav>

            {/* Contenido principal de Confirmación */}
            <main className="container my-auto py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card sketch-card p-4 p-md-5 text-center shadow-sm bg-white border-0">
                            {/* Icono de éxito grande */}
                            <div className="mb-4">
                                <i
                                    className="bi bi-check-circle-fill text-success"
                                    style={{ fontSize: "4rem" }}
                                ></i>
                            </div>

                            <h1
                                className="h3 fw-bold mb-2"
                                style={{ color: "var(--color-primary)" }}
                            >
                                {varias ? "¡Citas confirmadas!" : "¡Cita Confirmada!"}
                            </h1>
                            <p className="text-muted mb-4">
                                {varias
                                    ? "Tus citas quedaron registradas y están pendientes de pago. El salón cobra el abono o el total cuando corresponda."
                                    : "Tu cita quedó registrada y está pendiente de pago. El salón cobra el abono o el total cuando corresponda."}
                            </p>

                            {/* Detalles de la reserva */}
                            <div className="card bg-light border p-3 text-start mb-4 small">
                                <p className="mb-2">
                                    <strong>Cliente:</strong>{" "}
                                    <span id="confNombre">
                                        {cita ? `${cita.nombre} ${cita.apellido}` : "---"}
                                    </span>
                                </p>
                                {varias ? (
                                    <div className="mb-2">
                                        <strong>Citas:</strong>
                                        <ul className="mb-0 mt-1 ps-3">
                                            {citas.map((item, index) => (
                                                <li key={`${item.servicio}-${item.fecha}-${item.hora}-${index}`} className="mb-1">
                                                    {item.servicio} con {item.profesional} — {item.fecha} a las {item.hora}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mb-2">
                                            <strong>Servicio:</strong>{" "}
                                            <span id="confServicio">{cita ? cita.servicio : "---"}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Profesional:</strong>{" "}
                                            <span id="confProfesional">{cita ? cita.profesional : "---"}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Fecha y Hora:</strong>{" "}
                                            <span id="confFechaHora">
                                                {cita ? `${cita.fecha} a las ${cita.hora}` : "---"}
                                            </span>
                                        </p>
                                    </>
                                )}
                                <p className="mb-2">
                                    <strong>Forma de pago:</strong>{" "}
                                    <span id="confPago">
                                        {cita
                                            ? cita.tipoPago === "total"
                                                ? `Pago total ($${(cita.montoSeleccionado ?? cita.montoTotal ?? 0).toLocaleString("es-CL")})`
                                                : `Abono ($${(cita.montoSeleccionado ?? cita.montoAbono ?? 0).toLocaleString("es-CL")} de $${(cita.montoTotal ?? 0).toLocaleString("es-CL")})`
                                            : "---"}
                                    </span>
                                </p>
                                <p className="mb-0 text-success fw-bold">
                                    <strong>Comprobante enviado a:</strong>{" "}
                                    <span id="confCorreo">{cita ? cita.correo : "---"}</span>
                                </p>
                            </div>

                            {/* Botones de acción */}
                            <div className="d-grid gap-2 btn-action">
                                <a
                                    href="/"
                                    className="btn btn-custom-primary py-2 text-white text-decoration-none"
                                >
                                    Volver al Inicio
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}