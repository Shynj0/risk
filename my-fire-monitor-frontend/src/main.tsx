// my-fire-monitor-frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Estilos padrão do Vite, pode ser removido/modificado

// Importações e configurações do Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Garante que o CSS do Leaflet seja importado globalmente

// ---
// CORREÇÃO: Isso resolve o problema de o Leaflet não encontrar os ícones padrão
// em ambientes como Webpack/Vite, onde os caminhos podem não ser diretos.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
});
// ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);