import { clienteHttp } from "../api/clienteHttp";
import type { Servicio as ServicioTipo } from "../interfaces/Servicios";
import type { Catalogo as CatalogoTipo } from "../interfaces/Catalogo";

export type ServicioPayload = Omit<ServicioTipo, 'id'>;

export const Catalogo = {
    async filtrarByCatalogo(idCatalogo: number): Promise<ServicioTipo[]> {
        const { data } = await clienteHttp.get<ServicioTipo[]>(`servicios?categoriaId=${idCatalogo}`);
        return Array.isArray(data) ? data : [];
    },

    async getServicios(): Promise<ServicioTipo[]> {
        const { data } = await clienteHttp.get<ServicioTipo[]>(`servicios`);
        return Array.isArray(data) ? data : [];
    },

    async getCatalogos(): Promise<CatalogoTipo[]> {
        const { data } = await clienteHttp.get<CatalogoTipo[]>(`categorias`);
        return Array.isArray(data) ? data : [];
    },

    async crearServicio(nuevo: ServicioPayload): Promise<ServicioTipo> {
        const { data } = await clienteHttp.post<ServicioTipo>(`servicios`, nuevo);
        return data;
    },

    async getGestion(): Promise<ServicioTipo[]> {
        const { data } = await clienteHttp.get<ServicioTipo[]>(`servicios/gestion`);
        return Array.isArray(data) ? data : [];
    },

    async updateServicio(idServicio: number, newData: ServicioPayload): Promise<ServicioTipo> {
        const { data } = await clienteHttp.put<ServicioTipo>(`servicios/${idServicio}`, newData);
        return data;
    },

    async disableServicio(idServicio: number): Promise<ServicioTipo> {
        const { data } = await clienteHttp.post<ServicioTipo>(`servicios/${idServicio}/desactivar`);
        return data;
    }
};


