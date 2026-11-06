import { Carusel } from "../components/carrusel/Carusel";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";


const slides = [
    {
        imagen: "src/assets/carrusel-eyes/lifting1_L.png",
		alt: "Primer plano detallado del proceso de lifting de pestañas. Una especialista con guantes rosados utiliza un microcepillo rosa para aplicar una loción en las pestañas de una clienta, que están fijadas sobre un molde de silicona. Se aprecia un parche protector blanco debajo del ojo."
    },
    {
        imagen: "src/assets/carrusel-eyes/lifting2.png",
		alt: "Un collage de imágenes que muestran una moderna sala de estética en tonos rosados y primer plano de los materiales necesarios para un lifting de pestañas: botellas numeradas de lociones, moldes de silicona en tonos rosa, pinzas quirúrgicas y algunos suministros desechables."
    },
    {
     	imagen: "src/assets/carrusel-eyes/lifting3_R.png",
		alt: "Primer plano detallado del proceso de lifting de pestañas. Una especialista con guantes rosados utiliza un microcepillo rosa para aplicar una loción en las pestañas de una clienta, que están fijadas sobre un molde de silicona. Se aprecia un parche protector blanco debajo del ojo."
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

export function Eyes() {
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Lifting y Cejas</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={slides}/>

            {/* Listado de servicios */}
            <ListadoCards servicios={test} />
        </>
    );
};