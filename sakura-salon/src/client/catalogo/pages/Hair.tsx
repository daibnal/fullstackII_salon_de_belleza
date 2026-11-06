import { Carusel } from "../components/carrusel/Carusel";
import { assets } from "../../../assets/AssetsInterface";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";

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

const test = [
    {
        id: 1,
        nombre: "Retiro esmalte",
        descripcion: "Retiro cuidadoso del producto sin dañar la uña natural",
        duracion: 45,
        precio: 10000
    },
    {
        id: 2,
        nombre: "Polygel",
        descripcion: "Extensión resistente y ligera con acabado natural y personalizado.",
        duracion: 60,
        precio: 35000
    },
    {
        id: 3,
        nombre: "Manicure rusa",
        descripcion: "Manicure de precisión para un contorno limpio y acabado impecable.",
        duracion: 60,
        precio: 50000
    },
    {
        id: 4,
        nombre: "Esmaltado Permanente",
        descripcion: "Color duradero con acabado brillante y prolijo.",
        duracion: 50,
        precio: 20000
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
            <ListadoCards servicios={test} />
        </>
    );
};