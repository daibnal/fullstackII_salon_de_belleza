import { Slide } from "./Slide";

interface Imagen {
	imagen: string;
	alt: string;
}

export function Carusel(imagenes: Imagen[]) {
    
    return (
        <>
            {/*   Carrusel  */}
			<div
				id="demo"
				className="carousel slide container"
				data-bs-ride="carousel">
				{/*   Indicadores a los pies de las imagenes  */}
				<div className="carousel-indicators">
					{
						imagenes.map((img, index) => (
							<button
								key={index}
								type="button"
								data-bs-target="#demo"
								data-bs-slide-to={index}
								className={index === 0 ? "active" : ""}
							></button>
					))}
				</div>

				{/*   El slideshow/carrusel  */}
				<div className="carousel-inner">
					{
						imagenes.map((img, index) => (
							{/* TO DO: Fix  */}
							<Slide key={index} {...img} className={index === 0 ? "active" : ""} />
						))
					}
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