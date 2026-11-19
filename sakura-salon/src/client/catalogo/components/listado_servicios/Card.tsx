import { Link } from "react-router";
import type { Servicio } from "../../../../interfaces/Servicios";
import { imagenDeServicio } from "../../../../assets/AssetsInterface";

export function Card({ id, nombre, descripcion, duracionMinutos, precio }: Servicio) {
    const imagen = imagenDeServicio(nombre);
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center gap-5 pt-5">
                <div className="card service-card" key={id}>
                    <img
                        src={imagen}
                        alt={nombre}
                        className="img-thumbnail service-img-thumb" />
                    <div className="card-body d-flex flex-column text-center">
                        <h3 className="card-title-underlined h5 mb-2">
                            {nombre}
                        </h3>
                        <p className="card-text small text-muted mb-2">
                            {descripcion}
                        </p>
                        <p className="small fw-semibold text-secondary mb-3">
                            <i className="bi bi-clock me-1"></i>
                            Duración: {duracionMinutos} min
                        </p>
                        <div
                            className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                            {(id === -1 ? 
                                <a
                                    className="btn bg-light disabled"
                                    >Sin conexión 
                                </a>
                                :
                                <Link
                                    to={`/agendar?servicioId=${id}`}
                                    className="btn btn-custom-primary btn-sm w-auto px-3"
                                    >Ir</Link>
                            )}
                            <span className="fw-bold text-dark">
                                ${precio.toLocaleString('es-CO')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};