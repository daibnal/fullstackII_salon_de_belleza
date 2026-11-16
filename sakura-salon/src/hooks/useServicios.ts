import { useCallback, useEffect, useState } from 'react';
import type { Servicio } from '../interfaces/Servicios';
import { Catalogo } from '../services/catalogo.service';
import type { Catalogo as CatalogoTipo } from '../interfaces/Catalogo';

//export type ServicioPayload = Omit<Servicio, 'categoria'>;

export function useCatalogoById(idCategoria: number) {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarServicios = useCallback(async () => {
        // Finaliza antes si el id es invalido (para evita errores estupidos)
        // o si el id es 0 (Tab "Todos")
        if (!idCategoria || idCategoria <= 0) {
            setServicios([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Llama a la funcion asyncronica para obtener los servicios de la api
            const data = await Catalogo.filtrarByCatalogo(idCategoria);
            setServicios(data);

        } catch (err) {
            const parsedError = err instanceof Error ? err : new Error('No se pudo conectar con el servidor');
            setError(parsedError);
        } finally {
            setLoading(false);
        }
    }, [idCategoria]); // Si este valor cambia, re-carga cargarServicios()


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

export function useServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarServicios = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Llama a la funcion asyncronica para obtener los servicios de la api
            const data = await Catalogo.getServicios();
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

export function useCatalogo() {
    const [catalogos, setCatalogos] = useState<CatalogoTipo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarCatalogos = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Llama a la funcion asyncronica para obtener los servicios de la api
            const data = await Catalogo.getCatalogos();
            setCatalogos(data);

        } catch (err) {
            const parsedError = err instanceof Error ? err : new Error('No se pudo conectar con el servidor');
            setError(parsedError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void cargarCatalogos();
    }, [cargarCatalogos]);

    return {
        catalogos,
        loading,
        error,
        recargar: cargarCatalogos
    };
}