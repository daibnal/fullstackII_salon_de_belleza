import { useCallback, useEffect, useState } from "react";
import { Profesionales, type Profesional } from "../services/profesionales.service";

export function useProfesionales(gestion = false) {
	const [profesionales, setProfesionales] = useState<Profesional[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const recargar = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setProfesionales(gestion ? await Profesionales.gestion() : await Profesionales.listar());
		} catch (err) {
			setError(err instanceof Error ? err : new Error("No se pudo conectar con el servidor"));
		} finally {
			setLoading(false);
		}
	}, [gestion]);

	useEffect(() => {
		void recargar();
	}, [recargar]);

	return { profesionales, loading, error, recargar };
}
