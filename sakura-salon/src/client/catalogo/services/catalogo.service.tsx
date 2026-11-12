import axios from "axios";
import type { Servicio } from "../../../interfaces/Servicios";

const API_BASE_URL = import.meta.env.BASE_URL ?? 'http://localhost:8089/api/v1/servicios?categoriaId=';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
});

export const Catalogo = {
    async listarServicios(idCatalogo: number): Promise<Servicio[]> {
        const { data } = await apiClient.get<Servicio[]>(`${idCatalogo}`);
        return Array.isArray(data) ? data : [];
    }
}


