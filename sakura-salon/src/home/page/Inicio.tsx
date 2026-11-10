import { Carusel } from "../../client/catalogo/components/carrusel/Carusel";
import { assets } from "../../assets/AssetsInterface";
import { HorizontalCards } from "../components/HorizontalCards";

const fotos = [
    {
        imagen: assets.carruselInicio.c1_1.src,
        alt: assets.carruselInicio.c1_1.alt
    },
    {
        imagen: assets.carruselInicio.c1_2.src,
        alt: assets.carruselInicio.c1_2.alt
    },
    {
        imagen: assets.carruselInicio.c1_3.src,
        alt: assets.carruselInicio.c1_3.alt
    },
    {
        imagen: assets.carruselInicio.c1_4.src,
        alt: assets.carruselInicio.c1_4.alt
    }
];

const catalogo = [
    {
        titulo: "Lifting y Cejas",
        descripcion: "Realza tu mirada con un lifting de pestañas y diseño de cejas, logrando una apariencia natural, definida y armoniosa.",
        imagen: "",
        alt: ""
    },
    {
        titulo: "Cabello",
        descripcion: "Transforma tu cabello con cortes, color y tratamientos personalizados, diseñados para resaltar tu estilo y mantenerlo saludable y radiante.",
        imagen: "",
        alt: ""
    },
    {
        titulo: "Manicure",
        descripcion: "Cuida y embellece tus manos con manicures personalizados, desde esmaltados y diseños hasta extensiones, siempre con un acabado prolijo y elegante.",
        imagen: "",
        alt: ""
    }
];

export function Inicio() {
    return (
        <>
            <Carusel imagenes={fotos}/>

            <section
				id="services"
				className="mb-5 pt-5">
				<h1 className="section-title">Nuestros servicios</h1>
            
                <HorizontalCards servicios={catalogo}/>
            </section>

            {/* ACERCA DE NOSOTROS */}
			<section
				id="about"
				className="mb-5 pt-5">
				<h1 className="section-title">Acerca de Nosotros</h1>
				<p className="text-center text-muted small mb-3 px-1">
					Un espacio dedicado a realzar tu belleza. Creamos experiencias personalizadas en cabello,
					manicure y lifting, cuidando cada detalle para que te sientas y luzcas increíble.
				</p>

				{/* 2 Imagenes del interior del salon lado a lado */}
				<div className="row g-4">
					<div className="col-6">
						<div className="sketch-card p-1 ratio ratio-1x1">
							<img
								src="assets/inicio-acerca-de/fachada_salon.png"
								alt=""
								className="img-fluid rounded w-100"
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = 'https://placehold.co/300x220/F0A6A8/590D1F?text=%3Cimg%2F%3E';
                                }}
                            />
						</div>
					</div>
					<div className="col-6">
						<div className="sketch-card p-1 ratio ratio-1x1">
							<img
								src="assets/inicio-acerca-de/interior_salon.png"
								alt=""
								className="img-fluid rounded w-100"
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = 'https://placehold.co/300x220/F0A6A8/590D1F?text=%3Cimg%2F%3E';
                                }}
						    />
						</div>
					</div>
				</div>
			</section>

            {/* UBICACIÓN */}
			<section
				id="location"
				className="mb-4">
				<h1 className="section-title">Dónde encontrarnos</h1>

				{/* Vertical layout optimized for phone screens */}
				<div className="d-flex flex-column gap-3">
					{/* Top: Map Picture Overview */}
					<div className="map-container">
						<img
							src="assets/inicio-acerca-de/mapa_salon.png"
							alt="map picture overview"
							className="w-100 ratio ratio-1x1"
                            onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = 'https://placehold.co/400x250/A52647/ffffff?text=map+picture+overview';
                                }}
                        />
					</div>

					{/* Schedule and aperture times */}
					<div className="sketch-card p-2">
						<div className="d-flex align-items-start gap-2">
							<i
								className="bi bi-clock fs-4"
								style={{color: 'var(--color-secondary)'}}></i>
							<div>
								<p
									className="fw-bold mb-0 small"
									style={{color: 'var(--color-primary)'}}>
									Horario de Atención
								</p>
								<p className="mb-0 text-muted small">Lunes - Viernes: 9:00 AM - 19:00 PM</p>
								<p className="mb-0 text-muted small">Sabado: 10:00 AM - 19:00 PM</p>
								<p className="mb-0 text-muted small">Domingo: Cerrado</p>
							</div>
						</div>
					</div>

					{/* 1 Address */}
					<div className="sketch-card p-2">
						<div className="d-flex align-items-start gap-2">
							<i
								className="bi bi-geo-alt fs-4"
								style={{color: 'var(--color-secondary)'}}></i>
							<div>
								<p
									className="fw-bold mb-0 small"
									style={{color: 'var(--color-primary)'}}>
									Dirección
								</p>
								<p className="mb-0 text-muted small">Av. Chacabuco 1234, Concepción, Chile.</p>
							</div>
						</div>
					</div>

					{/* 2 Address */}
					<div className="sketch-card p-2">
						<div className="d-flex align-items-start gap-2">
							<i
								className="bi bi-geo-alt fs-4"
								style={{color: 'var(--color-secondary)'}}></i>
							<div>
								<p
									className="fw-bold mb-0 small"
									style={{color: 'var(--color-primary)'}}>
									Coordenadas
								</p>
								<p className="mb-0 text-muted small">-36.8269, -73.0498</p>
							</div>
						</div>
					</div>
				</div>
			</section>
        </>
    );
};