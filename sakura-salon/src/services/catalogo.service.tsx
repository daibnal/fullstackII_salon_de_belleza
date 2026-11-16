import axios from "axios";
import type { Servicio as ServicioTipo } from "../interfaces/Servicios";
import type { Catalogo as CatalogoTipo } from "../interfaces/Catalogo";

/* const API_BASE_URL = import.meta.env.BASE_URL ?? 'http://localhost:8089/api/v1/servicios?categoriaId=';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
}); */

const baseUrl = `http://localhost:8089/api/v1/`;

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
    }
}


