import { Carusel } from "../components/carrusel/Carusel";
import { assets } from "../../../assets/AssetsInterface";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";
import { useCatalogoById } from "../../../hooks/useServicios";

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

const categoria = 1;
export function Hair() {
    const { servicios, loading, error } = useCatalogoById(categoria);
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Cabello</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={sliedes} />

            {loading && <p className="text-center text-muted pt-4">Cargando servicios...</p>}
            {error && <p className="text-center text-danger pt-4">No se pudo conectar con el servidor.</p>}
            {!loading && !error && <ListadoCards servicios={servicios} />}
        </>
    );
};