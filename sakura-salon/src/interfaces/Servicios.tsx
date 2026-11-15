export interface Servicio {
    id: number;
    activo: boolean;
    descripcion: string;
    duracionMinutos: number;
    nombre: string;
    precio: number;
    categoria: {
        id: number;
        nombre: string;
    }
}

export interface Servicios {
    servicios: Servicio[];
}