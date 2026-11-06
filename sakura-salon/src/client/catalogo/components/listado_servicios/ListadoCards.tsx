import { Card } from "./Card";

interface servicio {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: number;
    precio: number;
}

interface serviciosProps {
    servicios: servicio[];
}

export function ListadoCards({servicios}: serviciosProps) {
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center gap-5 pt-5">
            {
                servicios.map((item) => (
                    <Card key={item.id} {...item} />
                ))
            }
            </div>
        </>
    );
}