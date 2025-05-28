// src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajuste se seu backend estiver em outra porta/URL

export interface MapPoint {
    latitude: number;
    longitude: number;
    timestamp: string;
}

export interface RiskPoint extends MapPoint {
    risk: number;
}

export interface FocosPoint extends MapPoint {
    intensity: number;
}

export const fetchRiskData = async (startDate?: string, endDate?: string): Promise<RiskPoint[]> => {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await axios.get<RiskPoint[]>(`${API_BASE_URL}/risco`, { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de risco:', error);
        return [];
    }
};

export const fetchFocosData = async (startDate?: string, endDate?: string): Promise<FocosPoint[]> => {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await axios.get<FocosPoint[]>(`${API_BASE_URL}/focos`, { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de focos:', error);
        return [];
    }
};