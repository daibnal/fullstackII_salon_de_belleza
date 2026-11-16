import { useCatalogoById } from "../../../hooks/useServicios";
import { Carusel } from "../components/carrusel/Carusel";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";

const sliedes = [
    {
        imagen: "src/assets/carrusel-nails/mani-rusa.png",
        alt: "Mano mostrando uñas cortas con esmaltado semipermanente color rojo vino brillante, con recuadros que detallan la manicura rusa y el acabado."
    },
    {
        imagen: "src/assets/carrusel-nails/retiro.png",
        alt: "Especialista con guantes negros retirando esmalte de uñas con un torno eléctrico, junto a productos de acetona y algodón."
    },
    {
        imagen: "src/assets/carrusel-nails/semipermanente.png",
        alt: "Manos apoyadas sobre un cojín de manicura exhibiendo uñas cortas con esmaltado semipermanente color rosa con efecto ojo de gato."
    }
];

const categoria = 2;

export function Nails() {
    const { servicios, error } = useCatalogoById(categoria);
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Manicure</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={sliedes} />

            {/* Listado de servicios */}
            <ListadoCards servicios={servicios}/>

            <p>{error?.message}</p>
        </>
    );
};