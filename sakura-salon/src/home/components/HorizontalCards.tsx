import type { Catalogos } from "../../interfaces/Catalogo";
import { sinConexion } from "../../interfaces/Servicios";
import { CardLeft } from "./CardLeft";
import { CardRight } from "./CardRight";


export function HorizontalCards({catalogos}: Catalogos) {
    const errorPlaceholder = sinConexion;
    return (
        <div className="d-flex flex-column gap-5">
                {(catalogos.length === 0 ? <>
                        <CardLeft {...errorPlaceholder}/>
                        <CardRight {...errorPlaceholder}/>
                        <CardLeft {...errorPlaceholder}/>
                    </>
                    :
                    catalogos.map((item, index) => (
                        (index % 2 === 0 ? (
                            <CardRight key={index} {...item}/>
                        ) : (
                            <CardLeft key={index} {...item}/>
                        ))
                    ))
                )}
        </div>
    );
};