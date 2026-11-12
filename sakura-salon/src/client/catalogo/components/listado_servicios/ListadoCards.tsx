import { Card } from "./Card";
import type { Servicios } from "../../../../interfaces/Servicios";


export function ListadoCards({servicios}: Servicios) {
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