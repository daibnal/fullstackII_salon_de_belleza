import { useCallback, useEffect, useState } from 'react';
import type { Servicio } from '../interfaces/Servicios';
import { Catalogo } from '../client/catalogo/services/catalogo.service';

export type ServicioPayload = Omit<Servicio, 'categoria'>;

export function useServicios(idCategoria: number) {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarServicios = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Llama a la funcion asyncronica para obtener los servicios de la api
            const data = await Catalogo.listarServicios(idCategoria);
            setServicios(data);

        } catch (err) {
            const parsedError = err instanceof Error ? err : new Error('No se pudo conectar con el servidor');
            setError(parsedError);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        void cargarServicios();
    }, [cargarServicios]);

    return {
        servicios,
        loading,
        error,
        recargar: cargarServicios
    };
}