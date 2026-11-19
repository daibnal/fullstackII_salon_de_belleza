import { useCallback, useEffect, useState } from "react";
import { Insumos, type Insumo } from "../services/insumos.service";

export function useInsumos() {
	const [insumos, setInsumos] = useState<Insumo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const recargar = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setInsumos(await Insumos.listar());
		} catch (err) {
			setError(err instanceof Error ? err : new Error("No se pudo conectar con el servidor"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void recargar();
	}, [recargar]);

	return { insumos, loading, error, recargar };
}
