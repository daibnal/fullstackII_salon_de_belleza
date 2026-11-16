export interface Catalogo {
    id: number;
    nombre: string;
    descripcion: string | null;
};

export interface Catalogos {
    catalogos: Catalogo[];
};