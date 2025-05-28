// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import FocosMapPage from './components/FocosMapPage'; // Certifique-se que está importando os novos
import RiskMapPage from './components/RiskMapPage';   // Certifique-se que está importando os novos
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-layout">
        {/* Barra de Navegação Superior */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/focos" className="nav-link">Mapa de Focos</Link>
          <Link to="/risco" className="nav-link">Mapa de Risco</Link>
        </nav>

        {/* Conteúdo das Páginas (Rotas) */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/focos" element={<FocosMapPage />} />
            <Route path="/risco" element={<RiskMapPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;