// my-fire-monitor-frontend/src/types.ts

export interface FocoMapData {
    lat: number;
    lon: number;
    data: string; // Ou Date, se você for parsear no frontend
}

export interface RiskMapData {
    lat: number;
    lon: number;
    risk: number;
}