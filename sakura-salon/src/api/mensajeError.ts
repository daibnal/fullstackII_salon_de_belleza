import axios from "axios";

export function mensajeError(error: unknown, fallback: string) {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data;
		if (data && typeof data === "object" && "mensaje" in data && typeof data.mensaje === "string") {
			return data.mensaje;
		}
	}
	return fallback;
}
