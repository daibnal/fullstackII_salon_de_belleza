import { useCallback, useEffect, useState } from "react";
import { Reservas, type Hueco } from "../services/reservas.service";

export function useDisponibilidad(profesionalId: number, servicioId: number, fecha: string) {
	const [huecos, setHuecos] = useState<Hueco[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const recargar = useCallback(async () => {
		if (!profesionalId || !servicioId || !fecha) {
			setHuecos([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			setHuecos(await Reservas.disponibilidad(profesionalId, servicioId, fecha));
		} catch (err) {
			setHuecos([]);
			setError(err instanceof Error ? err : new Error("No se pudo consultar la disponibilidad"));
		} finally {
			setLoading(false);
		}
	}, [profesionalId, servicioId, fecha]);

	useEffect(() => {
		void recargar();
	}, [recargar]);

	return { huecos, loading, error, recargar };
}
