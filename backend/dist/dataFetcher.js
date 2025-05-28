"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFocosDataForMap = void 0;
// src/dataFetcher.ts
const db_1 = __importDefault(require("./db"));
const getFocosDataForMap = async (date) => {
    let client;
    try {
        client = await db_1.default.connect();
        const params = [];
        let paramIndex = 1;
        // Construindo a cláusula WHERE para cada tabela
        const buildWhereClause = (dateColumn) => {
            const conditions = [];
            if (date) { // Apenas 'date'
                conditions.push(`${dateColumn}::date = $${paramIndex++}::date`); // Comparação de datas
                params.push(date);
            }
            return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        };
        const queryParts = [];
        // Query para dados_satelite_2023
        const where2023 = buildWhereClause('data_pas');
        queryParts.push(`
            SELECT
                latitude,
                longitude,
                frp AS intensity,
                data_pas AS timestamp
            FROM dados_satelite_2023
            ${where2023}
        `);
        // Query para dados_satelite_2024
        const where2024 = buildWhereClause('data_pas');
        queryParts.push(`
            SELECT
                latitude,
                longitude,
                frp AS intensity,
                data_pas AS timestamp
            FROM dados_satelite_2024
            ${where2024}
        `);
        // Query para dados_satelite_2025
        const where2025 = buildWhereClause('data_hora_gmt');
        queryParts.push(`
            SELECT
                lat AS latitude,
                lon AS longitude,
                frp AS intensity,
                data_hora_gmt AS timestamp
            FROM dados_satelite_2025
            ${where2025}
        `);
        const fullQuery = queryParts.join(' UNION ALL ') + ' ORDER BY timestamp DESC';
        const result = await client.query(fullQuery, params);
        return result.rows;
    }
    catch (error) {
        console.error('Erro ao buscar dados de focos para o mapa do banco de dados (UNION):', error);
        return [];
    }
    finally {
        if (client) {
            client.release();
        }
    }
};
exports.getFocosDataForMap = getFocosDataForMap;
