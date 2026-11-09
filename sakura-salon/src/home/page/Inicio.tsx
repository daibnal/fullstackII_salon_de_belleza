import { Carusel } from "../../client/catalogo/components/carrusel/Carusel";
import { assets } from "../../assets/AssetsInterface";

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


export function Inicio() {
    return (
        <>
            <Carusel imagenes={fotos}/>

            <section
				id="services"
				className="mb-5 pt-5">
				<h1 className="section-title">Nuestros servicios</h1>
            
            
            </section>
        </>
    );
};