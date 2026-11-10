import { CardLeft } from "./CardLeft";
import { CardRight, type servicioProps } from "./CardRight";

interface serviciosProps {
    servicios: servicioProps[];
}

export function HorizontalCards({servicios}: serviciosProps) {
    return (
        <div className="d-flex flex-column gap-5">
                {
                    servicios.map((item, index) => (
                        (index % 2 === 0 ? (
                            <CardRight key={index} {...item}/>
                        ) : (
                            <CardLeft key={index} {...item}/>
                        ))
                    ))
                }
        </div>
    );
};