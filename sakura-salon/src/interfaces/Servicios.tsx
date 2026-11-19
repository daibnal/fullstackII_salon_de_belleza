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

export const sinConexion: Servicio = {
    id: -1,
    nombre: "▆▆▆ ▆ ▆▆▆▆▆▆",
    descripcion: "▆▆▆▆▆ ▆▆▆ ▆▆▆▆▆▆▆ ▆ ▆▆▆▆▆▆▆▆▆▆ ▆▆▆▆ ▆▆ ▆▆▆ ▆ ▆▆▆▆▆ ▆▆▆▆▆▆▆ ▆▆▆▆▆▆▆▆▆▆▆ ▆▆ ▆▆▆",
    duracionMinutos: 0,
    precio: 0,
    categoria: {
        id: -1,
        nombre: ""
    },
    activo: false,
};