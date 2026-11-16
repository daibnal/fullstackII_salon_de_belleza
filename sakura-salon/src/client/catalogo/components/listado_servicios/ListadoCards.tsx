import { Card } from "./Card";
import { sinConexion, type Servicios } from "../../../../interfaces/Servicios";


export function ListadoCards({servicios}: Servicios) {
    const errorPlaceholder = sinConexion;
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center gap-5 pt-5">
            {(servicios.length === 0 ? 
                <Card {...errorPlaceholder} />
                :
                servicios.map((item) => (
                    <Card key={item.id} {...item} />
                )) 
            )}
            </div>
        </>
    );
}