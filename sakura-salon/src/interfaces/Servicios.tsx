export interface Servicio {
    id: number;
    activo: boolean;
    descripcion: string;
    duracion_minutos: number;
    nombre: string;
    precio: number;
    categoria: number;
}

export interface Servicios {
    servicios: Servicio[];
}