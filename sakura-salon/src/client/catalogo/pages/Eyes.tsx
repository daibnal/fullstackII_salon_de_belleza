import { Carusel } from "../components/carrusel/Carusel";
import { ListadoCards } from "../components/listado_servicios/ListadoCards";
import { useServicios } from "../../../hooks/useServicios";

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

const categoria = 3

export function Eyes() {
    const { servicios, error } = useServicios(categoria);
    return (
        <>
            {/* Titulo de la seccion */}
            <h1 className="section-title">Lifting y Cejas</h1>

            {/* Carrusel de imagenes */}
            <Carusel imagenes={slides}/>

            {/* Listado de servicios */}
            <ListadoCards servicios={servicios} />

            <p>{error?.message}</p>
        </>
    );
};