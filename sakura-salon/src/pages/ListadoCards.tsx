const lista = [
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


import { Card } from "./Card";

export function ListadoCards() {
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center gap-5 pt-5">
            {
                lista.map((item) => (
                    <Card key={item.id} {...item} />
                ))
            }
            </div>
        </>
    );
}