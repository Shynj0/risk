// src/components/FocosMapPage.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const getColorForIntensity = (intensity: number): string => {
    if (intensity > 1000) return 'darkred';
    if (intensity > 500) return 'red';
    if (intensity > 100) return 'orange';
    return 'yellow';
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

const FocosMapPage: React.FC = () => {
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

    // Usa o hook customizado para buscar APENAS focos de calor com intervalo de datas
    const { data: focosData, loading, error } = useMapData(startDate, endDate, 'focos');

    useEffect(() => {
        if (!loading && focosData.length > 0) {
            const latLngs = focosData.map(p => L.latLng(p.latitude, p.longitude));
            const bounds = L.latLngBounds(latLngs);
            setMapCenter(bounds.getCenter());
            const newZoom = Math.min(10, Math.max(3, Math.floor(500 / Math.max(bounds.getEast() - bounds.getWest(), bounds.getNorth() - bounds.getSouth()))));
            setMapZoom(newZoom);
        } else if (!loading && focosData.length === 0) {
            setMapCenter([-14.235, -51.925]);
            setMapZoom(5);
        }
    }, [loading, focosData]);

    const handleApplyFilter = () => {
        // O `useMapData` já é reativado automaticamente quando `startDate` ou `endDate` mudam.
    };

    return (
        <div className="fire-monitor-container">
            <h1>Mapa de Focos de Calor</h1>

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

            {loading && <p>Carregando dados de Focos de Calor...</p>}
            {error && <p className="error-message">Erro: {error}</p>}
            {!loading && <p>Total de Focos de Calor: {focosData.length}</p>}

            <div id="map-container">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <CenterMap center={mapCenter} zoom={mapZoom} />

                    {focosData.map((point, index) => (
                        <Marker
                            key={`focos-${point.latitude}-${point.longitude}-${point.timestamp}-${index}`}
                            position={[point.latitude, point.longitude]}
                            icon={L.divIcon({
                                className: 'focos-marker',
                                html: `<div style="background-color:${getColorForIntensity(point.intensity || 0)}; width: 10px; height: 10px; border-radius: 50%; border: 1px solid black;"></div>`
                            })}
                        >
                            <Popup>
                                <b>Intensidade:</b> {point.intensity}<br />
                                <b>Data:</b> {new Date(point.timestamp).toLocaleString()}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default FocosMapPage;