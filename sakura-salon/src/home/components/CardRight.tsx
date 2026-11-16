import { Link } from "react-router";
import type { Catalogo } from "../../interfaces/Catalogo";

export function CardRight({nombre, id, descripcion}: Catalogo) {
    return (
        <div className="sketch-card">
            <div className="row g-3 align-items-center">
                <div className="col-12 col-sm-6">
                    <h2
                        className="h5 fw-bold mb-1"
                        style={{ color: 'var(--color-primary)' }}>
                        {nombre}
                    </h2>
                    <p className="text-muted small mb-2">
                        {descripcion}
                    </p>
                    <Link
                        className="btn btn-custom-primary"
                        to={`catalogo/${id}`}>
                        Ver opciones
                    </Link>
                </div>
                <div className="col-12 col-sm-6 text-center">
                    <img
                        src={undefined}
                        alt={undefined}
                        className="img-thumbnail service-img-thumb"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = 'https://placehold.co/300x180/F4F2F0/590D1F?text=.img-thumbnail';
                        }}
                    />
                </div>
            </div>
        </div>
    );
}