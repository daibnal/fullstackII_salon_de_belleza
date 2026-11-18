
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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

export function CitaConfirmada() {
    const navigate = useNavigate();

    const [cita, setCita] = useState<DetallesCita | null>(null);

    useEffect(() => {
        const datosGuardados = sessionStorage.getItem("detallesCita");

        if (datosGuardados) {
            try {
                setCita(JSON.parse(datosGuardados));
            } catch {
                setCita(null);
            }
        }
    }, []);

    if (!cita) {
        return (
            <main className="container my-5 pt-5">
                <div className="card sketch-card p-4 text-center">
                    <h2 className="h4 fw-bold">
                        No se encontraron los datos de la reserva
                    </h2>

                    <p className="text-muted">
                        Vuelve a realizar el proceso de agendamiento.
                    </p>

                    <button className="btn btn-custom-primary" onClick={() => navigate("/")}>
                        Volver al inicio
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container my-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">

                    <div className="card sketch-card p-4 shadow-sm text-center">
                        <div className="mb-3">
                            <i
                                className="bi bi-check-circle-fill"
                                style={{
                                    fontSize: "4rem",
                                    color: "var(--color-primary)"
                                }}
                            ></i>
                        </div>

                        <h1 className="h3 fw-bold mb-3" style={{ color: "var(--color-primary)" }}> 
                            ¡Cita Confirmada!
                        </h1>

                        <p className="text-muted">
                            Tu reserva ha sido registrada exitosamente.
                        </p>

                        <hr />

                        <div className="text-start">

                            <h5 className="fw-bold mb-3">
                                Detalles de tu reserva
                            </h5>

                            <p>
                                <strong>Cliente:</strong>{" "}
                                {cita.nombre} {cita.apellido}
                            </p>

                            <p>
                                <strong>Servicio:</strong>{" "}
                                {cita.servicio}
                            </p>

                            <p>
                                <strong>Profesional:</strong>{" "}
                                {cita.profesional}
                            </p>

                            <p>
                                <strong>Fecha:</strong>{" "}
                                {cita.fecha}
                            </p>

                            <p>
                                <strong>Hora:</strong>{" "}
                                {cita.hora}
                            </p>

                            <p>
                                <strong>Correo:</strong>{" "}
                                {cita.correo}
                            </p>

                            <p>
                                <strong>Método de pago:</strong>{" "}
                                {cita.tipoPago === "abono"
                                    ? "Abono del 50%"
                                    : "Pago total"}
                            </p>

                            <p>
                                <strong>Monto seleccionado:</strong>{" "}
                                ${cita.montoPagado.toLocaleString("es-CL")}
                            </p>

                        </div>

                        <hr />

                        <p className="small text-muted">
                            Gracias por reservar con Sakura Salón.
                            ¡Te esperamos!
                        </p>

                        <button className="btn btn-custom-primary w-100 mt-3" onClick={() => navigate("/")}>
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
