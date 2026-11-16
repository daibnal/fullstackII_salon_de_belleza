import axios from "axios";
import type { Servicio as ServicioTipo } from "../interfaces/Servicios";
import type { Catalogo as CatalogoTipo } from "../interfaces/Catalogo";

const baseUrl = `http://localhost:8089/api/v1/`;

export type ServicioPayload = Omit<ServicioTipo, 'id'>;

export const Catalogo = {
    async filtrarByCatalogo(idCatalogo: number): Promise<ServicioTipo[]> {
        const { data } = await axios.get<ServicioTipo[]>(`${baseUrl}servicios?categoriaId=${idCatalogo}`);
        return Array.isArray(data) ? data : [];
    },

    async getServicios(): Promise<ServicioTipo[]> {
        const { data } = await axios.get<ServicioTipo[]>(`${baseUrl}servicios`);
        return Array.isArray(data) ? data : [];
    },

    async getCatalogos(): Promise<CatalogoTipo[]> {
        const { data } = await axios.get<CatalogoTipo[]>(`${baseUrl}categorias`);
        return Array.isArray(data) ? data : [];
    },

    async updateServicio(idServicio: number, newData: ServicioPayload): Promise<ServicioTipo> {
        const { data } = await axios.put<ServicioTipo>(`${baseUrl}servicios/${idServicio}`, newData);
        return data;
    },

    async disableServicio(idServicio: number): Promise<ServicioTipo> {
        const { data } = await axios.put<ServicioTipo>(`${baseUrl}servicios/${idServicio}/desactivar`);
        return data;
    }
};


