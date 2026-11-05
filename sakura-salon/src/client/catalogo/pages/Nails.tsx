import { Carusel } from "../components/carrusel/Carusel";

const sliedes = [
    {
        imagen: "../assets/carrusel-nails/mani-rusa.png",
        alt: "Mano mostrando uñas cortas con esmaltado semipermanente color rojo vino brillante, con recuadros que detallan la manicura rusa y el acabado."
    },
    {
        imagen: "../assets/carrusel-nails/retiro.png",
        alt: "Especialista con guantes negros retirando esmalte de uñas con un torno eléctrico, junto a productos de acetona y algodón."
    },
    {
        imagen: "../assets/carrusel-nails/semipermanente.png",
        alt: "Manos apoyadas sobre un cojín de manicura exhibiendo uñas cortas con esmaltado semipermanente color rosa con efecto ojo de gato."
    }
];

export function Nails() {
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Manicure</h1>

            {/* Carrusel de imagenes */}
            <Carusel {...sliedes} />

            {/* Listado de servicios */}
            {/* TO DO */}
        </>
    );
};