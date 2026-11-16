import { assets } from "../../../assets/AssetsInterface";
import { useCatalogoById } from "../../../hooks/useServicios";
import { Carusel } from "../components/carrusel/Carusel";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";

const sliedes = [
    {
        imagen: assets.carruselNails.maniRusa.src,
        alt: assets.carruselNails.maniRusa.alt
    },
    {
        imagen: assets.carruselNails.polygel.src,
        alt: assets.carruselNails.polygel.alt
    },
    {
        imagen: assets.carruselNails.semipermanente.src,
        alt: assets.carruselNails.semipermanente.alt
    }
];

const categoria = 2;

export function Nails() {
    const { servicios } = useCatalogoById(categoria);
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Manicure</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={sliedes} />

            {/* Listado de servicios */}
            <ListadoCards servicios={servicios}/>
        </>
    );
};