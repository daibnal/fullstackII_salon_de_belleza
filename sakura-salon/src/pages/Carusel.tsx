
export function Carusel() {
    
    return (
        <>
            {/*   Carrusel  */}
			<div
				id="demo"
				className="carousel slide container"
				data-bs-ride="carousel">
				{/*   Indicadores a los pies de las imagenes  */}
				<div className="carousel-indicators">
					<button
						type="button"
						data-bs-target="#demo"
						data-bs-slide-to="0"
						className="active"></button>
					<button
						type="button"
						data-bs-target="#demo"
						data-bs-slide-to="1"></button>
					<button
						type="button"
						data-bs-target="#demo"
						data-bs-slide-to="2"></button>
					<button
						type="button"
						data-bs-target="#demo"
						data-bs-slide-to="3"></button>
				</div>

				{/*   El slideshow/carrusel  */}
				<div className="carousel-inner">
					<div className="carousel-item active ratio ratio-1x1">
						<img
							src="../assets/carrusel-nails/mani-rusa.png"
							alt="Mano mostrando uñas cortas con esmaltado semipermanente color rojo vino brillante,
                                 con recuadros que detallan la manicura rusa y el acabado."
							className="d-block w-100" />
					</div>
					<div className="carousel-item ratio ratio-1x1">
						<img
							src="../assets/carrusel-nails/polygel.png"
							alt="Mano con uñas esculpidas en polygel con diseño de manicura francesa y acabado natural,
                                 con tubos de polygel y pinceles de fondo."
							className="d-block w-100" />
					</div>
					<div className="carousel-item ratio ratio-1x1">
						<img
							src="../assets/carrusel-nails/retiro.png"
							alt="Especialista con guantes negros retirando esmalte de uñas con un torno eléctrico,
                                 junto a productos de acetona y algodón."
							className="d-block w-100" />
					</div>
					<div className="carousel-item ratio ratio-1x1">
						<img
							src="../assets/carrusel-nails/semipermanente.png"
							alt="Manos apoyadas sobre un cojín de manicura exhibiendo uñas cortas con esmaltado
                                 semipermanente color rosa con efecto ojo de gato."
							className="d-block w-100" />
					</div>
				</div>

				{/*   Controles izq y der (iconos)  */}
				<button
					className="carousel-control-prev"
					type="button"
					data-bs-target="#demo"
					data-bs-slide="prev">
					<span className="carousel-control-prev-icon"></span>
				</button>
				<button
					className="carousel-control-next"
					type="button"
					data-bs-target="#demo"
					data-bs-slide="next">
					<span className="carousel-control-next-icon"></span>
				</button>
			</div>
        </>
    )
}