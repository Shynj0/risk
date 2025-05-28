// my-fire-monitor-frontend/src/components/FocosMap.tsx

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FocoMapData } from '../types'; // CORRIGIDO: import type
import './Map.css';

interface FocosMapProps {
    focosData: FocoMapData[];
}

const FocosMap: React.FC<FocosMapProps> = ({ focosData }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            // Inicializa o mapa apenas uma vez
            leafletMapRef.current = L.map(mapRef.current).setView([-14.235, -51.925], 4); // Centrado no Brasil
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(leafletMapRef.current);

            markersLayerRef.current.addTo(leafletMapRef.current);
        }
    }, []);

    useEffect(() => {
        if (leafletMapRef.current) {
            // Limpa os marcadores existentes
            markersLayerRef.current.clearLayers();

            // Adiciona novos marcadores para cada foco
            focosData.forEach(foco => {
                L.marker([foco.lat, foco.lon])
                 .bindPopup(`Foco de Calor<br>Lat: ${foco.lat}, Lon: ${foco.lon}<br>Data: ${foco.data}`)
                 .addTo(markersLayerRef.current);
            });
        }
    }, [focosData]); // Re-renderiza quando focosData muda

    return (
        <div className="map-wrapper">
            <h3>Mapa de Focos de Calor</h3>
            <div id="focosMap" ref={mapRef} className="map-container"></div>
        </div>
    );
};

export default FocosMap;