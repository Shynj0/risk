// src/hooks/useMapData.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface MapDataPoint {
    latitude: number;
    longitude: number;
    timestamp: string;
    risk?: number;
    intensity?: number;
}

interface UseMapDataResult {
    data: MapDataPoint[];
    loading: boolean;
    error: string | null;
}

type DataType = 'focos' | 'risco';

export const useMapData = (
    startDate: string, // Volta para startDate
    endDate: string,   // Volta para endDate
    dataType: DataType
): UseMapDataResult => {
    const [data, setData] = useState<MapDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (dataType === 'focos') {
                response = await axios.get<MapDataPoint[]>(`http://localhost:3000/api/focos`, {
                    params: { startDate, endDate } // Passa startDate e endDate
                });
            } else if (dataType === 'risco') {
                response = await axios.get<MapDataPoint[]>(`http://localhost:3000/api/risco`, {
                    params: { startDate, endDate } // Passa startDate e endDate
                });
            } else {
                setError("Tipo de dado inválido.");
                setLoading(false);
                return;
            }
            setData(response.data);

        } catch (err) {
            console.error(`Erro ao buscar dados de ${dataType} para o mapa:`, err);
            setError(`Não foi possível carregar os dados de ${dataType}. Tente novamente.`);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, dataType]); // Dependências atualizadas

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error };
};