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
        imagen: assets.carruselNails.retiro.src,
        alt: assets.carruselNails.retiro.alt
    },
    {
        imagen: assets.carruselNails.semipermanente.src,
        alt: assets.carruselNails.semipermanente.alt
    }
];

const categoria = 2;

export function Nails() {
    const { servicios, loading, error } = useCatalogoById(categoria);
    return (
        <>
            <h1 className="section-title">Manicure</h1>
            <Carusel imagenes={sliedes} />
            {loading && <p className="text-center text-muted pt-4">Cargando servicios...</p>}
            {error && <p className="text-center text-danger pt-4">No se pudo conectar con el servidor.</p>}
            {!loading && !error && <ListadoCards servicios={servicios}/>}
        </>
    );
};