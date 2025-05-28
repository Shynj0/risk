// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Supondo que App.css tem alguns estilos globais

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Bem-vindo ao Monitor de Incêndios</h1>
            <p>Selecione o tipo de mapa que você deseja visualizar:</p>
            <nav className="home-nav">
                <Link to="/focos" className="nav-button">Ver Mapa de Focos de Calor</Link>
                <Link to="/risco" className="nav-button">Ver Mapa de Risco de Fogo</Link>
            </nav>
        </div>
    );
};

export default Home;