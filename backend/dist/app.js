"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dataFetcher_1 = require("./dataFetcher");
const riskDataFetcher_1 = require("./riskDataFetcher");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Rota para dados de focos de calor
app.get('/api/focos', async (req, res) => {
    const date = req.query.date; // Apenas 'date'
    try {
        const data = await (0, dataFetcher_1.getFocosDataForMap)(date); // Passa apenas 'date'
        res.json(data);
    }
    catch (error) {
        console.error('Erro ao buscar dados de focos para o mapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar focos.' });
    }
});
// Rota para dados de risco
app.get('/api/risco', async (req, res) => {
    const date = req.query.date; // Apenas 'date'
    try {
        const data = await (0, riskDataFetcher_1.getRiskDataForMap)(date); // Passa apenas 'date'
        res.json(data);
    }
    catch (error) {
        console.error('Erro ao buscar dados de risco para o mapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar risco.' });
    }
});
exports.default = app;
