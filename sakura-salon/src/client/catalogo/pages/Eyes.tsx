import { Carusel } from "../components/carrusel/Carusel";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";
import { useCatalogoById } from "../../../hooks/useServicios";
import { assets } from "../../../assets/AssetsInterface";

const slides = [
    {
        imagen: assets.carruselEyes.lifting1.src,
		alt: assets.carruselEyes.lifting1.alt
    },
    {
        imagen: assets.carruselEyes.lifting2.src,
		alt: assets.carruselEyes.lifting2.alt
    },
    {
     	imagen: assets.carruselEyes.lifting3.src,
		alt: assets.carruselEyes.lifting3.alt
    }
];

const categoria = 3

export function Eyes() {
    const { servicios, loading, error } = useCatalogoById(categoria);
    return (
        <>
            <h1 className="section-title">Lifting y Cejas</h1>
            <Carusel imagenes={slides}/>
            {loading && <p className="text-center text-muted pt-4">Cargando servicios...</p>}
            {error && <p className="text-center text-danger pt-4">No se pudo conectar con el servidor.</p>}
            {!loading && !error && <ListadoCards servicios={servicios} />}
        </>
    );
};