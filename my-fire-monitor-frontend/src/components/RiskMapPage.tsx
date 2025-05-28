// src/components/RiskMapPage.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapData } from '../hooks/useMapData';

// Fix para o ícone padrão do Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getColorForRisk = (risk: number): string => {
    if (risk > 0.8) return 'red';
    if (risk > 0.6) return 'orange';
    if (risk > 0.4) return 'yellow';
    return 'green';
};

interface CenterMapProps {
    center: L.LatLngExpression;
    zoom: number;
}
const CenterMap: React.FC<CenterMapProps> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.setView(center, zoom);
        }, 100);
        return () => clearTimeout(timer);
    }, [center, zoom, map]);
    return null;
};

const RiskMapPage: React.FC = () => {
    // Calcula a data de hoje e 7 dias atrás para o filtro padrão
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo)); // Volta para startDate
    const [endDate, setEndDate] = useState<string>(formatDate(today));           // Volta para endDate
    const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([-14.235, -51.925]);
    const [mapZoom, setMapZoom] = useState<number>(5);

    // Usa o hook customizado para buscar APENAS risco de fogo com intervalo de datas
    const { data: riskData, loading, error } = useMapData(startDate, endDate, 'risco');

    useEffect(() => {
        if (!loading && riskData.length > 0) {
            const latLngs = riskData.map(p => L.latLng(p.latitude, p.longitude));
            const bounds = L.latLngBounds(latLngs);
            setMapCenter(bounds.getCenter());
            const newZoom = Math.min(10, Math.max(3, Math.floor(500 / Math.max(bounds.getEast() - bounds.getWest(), bounds.getNorth() - bounds.getSouth()))));
            setMapZoom(newZoom);
        } else if (!loading && riskData.length === 0) {
            setMapCenter([-14.235, -51.925]);
            setMapZoom(5);
        }
    }, [loading, riskData]);

    const handleApplyFilter = () => {
        // O `useMapData` já é reativado automaticamente quando `startDate` ou `endDate` mudam.
    };

    return (
        <div className="fire-monitor-container">
            <h1>Mapa de Risco de Fogo</h1>

            <div className="controls">
                <label htmlFor="startDate">Data Início:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label htmlFor="endDate">Data Fim:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button onClick={handleApplyFilter} disabled={loading}>
                    {loading ? 'Aplicando...' : 'Aplicar Filtro'}
                </button>
            </div>

            {loading && <p>Carregando dados de Risco de Fogo...</p>}
            {error && <p className="error-message">Erro: {error}</p>}
            {!loading && <p>Total de Pontos de Risco: {riskData.length}</p>}

            <div id="map-container">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <CenterMap center={mapCenter} zoom={mapZoom} />

                    {riskData.map((point, index) => (
                        <CircleMarker
                            key={`risk-${point.latitude}-${point.longitude}-${point.timestamp}-${index}`}
                            center={[point.latitude, point.longitude]}
                            radius={5}
                            pathOptions={{ fillColor: getColorForRisk(point.risk || 0), color: 'black', weight: 1 }}
                        >
                            <Popup>
                                <b>Risco:</b> {point.risk}<br />
                                <b>Data:</b> {new Date(point.timestamp).toLocaleString()}
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default RiskMapPage;