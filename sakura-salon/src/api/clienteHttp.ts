import axios from "axios";
import { tokenSesion } from "../services/sesion";

const configurada = import.meta.env.VITE_API_URL || "http://localhost:8090/api/v1";

export const clienteHttp = axios.create({
	baseURL: configurada.endsWith("/") ? configurada : `${configurada}/`,
});

clienteHttp.interceptors.request.use((config) => {
	const token = tokenSesion();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
