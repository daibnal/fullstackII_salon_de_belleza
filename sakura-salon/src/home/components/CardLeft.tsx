import type { servicioProps } from "./CardRight";

export function CardLeft({titulo, descripcion, imagen, alt}: servicioProps) {
    return (
        <div className="sketch-card">
            <div className="row g-2 align-items-center flex-column-reverse flex-sm-row">
                <div className="col-12 col-sm-6 text-center">
                    <img
                        src={imagen}
                        alt={alt}
                        className="img-thumbnail service-img-thumb"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = 'https://placehold.co/300x180/F4F2F0/590D1F?text=.img-thumbnail';
                        }}
                    />
				</div>
                <div className="col-12 col-sm-6">
                    <h2
                        className="h5 fw-bold mb-1"
                        style={{color: 'var(--color-primary)'}}>
                        {titulo}
                    </h2>
                    <p className="text-muted small mb-2">
                        {descripcion}
                    </p>
                    <a
                        className="btn btn-custom-primary"
                        href="servicios/hair.html"
                        >Ver opciones
                    </a>
                </div>
            </div>
        </div>
    );
};