import { useCallback, useEffect, useState } from "react";
import { Reservas, type Reserva } from "../services/reservas.service";

export function useAgenda(fecha: string) {
	const [citas, setCitas] = useState<Reserva[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const recargar = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setCitas(await Reservas.agenda(fecha, "dia"));
		} catch (err) {
			setError(err instanceof Error ? err : new Error("No se pudo conectar con el servidor"));
		} finally {
			setLoading(false);
		}
	}, [fecha]);

	useEffect(() => {
		void recargar();
	}, [recargar]);

	return { citas, loading, error, recargar };
}
