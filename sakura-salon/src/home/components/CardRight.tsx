import { Link } from "react-router";
import type { Catalogo } from "../../interfaces/Catalogo";
import { imagenDeCategoria } from "../../assets/AssetsInterface";

export function CardRight({nombre, id, descripcion}: Catalogo) {
    return (
        <div className="sketch-card">
            <div className="row g-3 align-items-center">
                <div className="col-12 col-sm-6">
                    <h2
                        className="h3 fw-bold mb-1"
                        style={{ color: 'var(--color-primary)' }}>
                        {nombre}
                    </h2>
                    <p className="text-muted small mb-2">
                        {descripcion}
                    </p>
                    {
                        id === -1 ?
                        <a
                            className="btn btn-on-error"
                            >Sin conexión 
                        </a>
                        :
                        <Link
                            className="btn btn-custom-primary"
                            to={`catalogo/${id}`}
                            >Ver opciones
                        </Link>
                    }
                </div>
                <div className="col-12 col-sm-6 text-center">
                    <img
                        src={imagenDeCategoria(nombre)}
                        alt={nombre}
                        className="img-thumbnail service-img-thumb"
                    />
                </div>
            </div>
        </div>
    );
}