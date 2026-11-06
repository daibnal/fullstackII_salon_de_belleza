import { Carusel } from "../components/carrusel/Carusel";
import { assets } from "../../../assets/AssetsInterface";

const sliedes = [
    {
        imagen: assets.carruselHair.alisado.src,
        alt: assets.carruselHair.alisado.alt
    },
    {
        imagen: assets.carruselHair.bob.src,
        alt: assets.carruselHair.bob.alt
    },
    {
        imagen: assets.carruselHair.capas.src,
        alt: assets.carruselHair.capas.alt
    },
    {
        imagen: assets.carruselHair.rulos.src,
        alt: assets.carruselHair.rulos.alt
    }
];

export function Hair() {
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Cabello</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={sliedes} />

            {/* Listado de servicios */}
            {/* TO DO */}
        </>
    );
};