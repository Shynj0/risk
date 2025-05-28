// src/app.ts
import express from 'express';
import cors from 'cors';
import { getFocosDataForMap } from './dataFetcher';
import { getRiskDataForMap } from './riskDataFetcher';

const app = express();
app.use(cors()); // Habilita o CORS para permitir requisições do frontend

// Rota para dados de focos de calor
app.get('/api/focos', async (req, res) => {
    const startDate = req.query.startDate as string | undefined; // Volta para startDate
    const endDate = req.query.endDate as string | undefined;     // Volta para endDate

    try {
        const data = await getFocosDataForMap(startDate, endDate); // Passa startDate e endDate
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados de focos para o mapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar focos.' });
    }
});

// Rota para dados de risco
app.get('/api/risco', async (req, res) => {
    const startDate = req.query.startDate as string | undefined; // Volta para startDate
    const endDate = req.query.endDate as string | undefined;     // Volta para endDate

    try {
        const data = await getRiskDataForMap(startDate, endDate); // Passa startDate e endDate
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados de risco para o mapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar risco.' });
    }
});

export default app;