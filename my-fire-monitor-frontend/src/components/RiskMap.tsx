// my-fire-monitor-frontend/src/components/RiskMap.tsx

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RiskMapData } from '../types'; // CORRIGIDO: import type
import './Map.css';

interface RiskMapProps {
    riskData: RiskMapData[];
}

const RiskMap: React.FC<RiskMapProps> = ({ riskData }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const circlesLayerRef = useRef<L.LayerGroup>(L.layerGroup());

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            // Inicializa o mapa apenas uma vez
            leafletMapRef.current = L.map(mapRef.current).setView([-14.235, -51.925], 4); // Centrado no Brasil
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(leafletMapRef.current);

            circlesLayerRef.current.addTo(leafletMapRef.current);
        }
    }, []);

    useEffect(() => {
        if (leafletMapRef.current) {
            // Limpa os círculos existentes
            circlesLayerRef.current.clearLayers();

            // Adiciona novos círculos para cada ponto de risco
            riskData.forEach(riskPoint => {
                const color = getColorForRisk(riskPoint.risk);
                const radius = getRadiusForRisk(riskPoint.risk);

                L.circleMarker([riskPoint.lat, riskPoint.lon], {
                    radius: radius,
                    fillColor: color,
                    color: color,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                })
                .bindPopup(`Risco de Fogo: ${riskPoint.risk}<br>Lat: ${riskPoint.lat}, Lon: ${riskPoint.lon}`)
                .addTo(circlesLayerRef.current);
            });
        }
    }, [riskData]); // Re-renderiza quando riskData muda

    // Função auxiliar para determinar a cor com base no risco
    const getColorForRisk = (risk: number) => {
        if (risk >= 0.8) return '#8B0000'; // Vermelho Escuro (Risco Muito Alto)
        if (risk >= 0.6) return '#FF4500'; // Laranja Avermelhado (Risco Alto)
        if (risk >= 0.4) return '#FFA500'; // Laranja (Risco Médio)
        if (risk >= 0.2) return '#FFD700'; // Amarelo Dourado (Risco Baixo)
        return '#32CD32'; // Verde Limão (Risco Muito Baixo)
    };

    // Função auxiliar para determinar o raio do marcador com base no risco
    const getRadiusForRisk = (risk: number) => {
        if (risk >= 0.8) return 10;
        if (risk >= 0.6) return 8;
        if (risk >= 0.4) return 6;
        if (risk >= 0.2) return 4;
        return 2;
    };

    return (
        <div className="map-wrapper">
            <h3>Mapa de Risco de Incêndio</h3>
            <div id="riskMap" ref={mapRef} className="map-container"></div>
        </div>
    );
};

export default RiskMap;