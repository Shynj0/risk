// src/dataFetcher.ts
import pool from './db';

interface FocosData {
    latitude: number;
    longitude: number;
    intensity: number;
    timestamp: string;
}

export const getFocosDataForMap = async (
    startDate?: string, // Volta para startDate
    endDate?: string    // Volta para endDate
): Promise<FocosData[]> => {
    let client;
    try {
        client = await pool.connect();

        const params: (string | Date)[] = [];
        let paramIndex = 1;

        const buildWhereClause = (dateColumn: string) => {
            const conditions: string[] = [];
            if (startDate) {
                conditions.push(`${dateColumn} >= $${paramIndex++}`);
                params.push(startDate);
            }
            if (endDate) {
                conditions.push(`${dateColumn} <= $${paramIndex++}`);
                params.push(endDate);
            }
            return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        };

        const queryParts: string[] = [];

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

        const result = await client.query<FocosData>(fullQuery, params);
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar dados de focos para o mapa do banco de dados (UNION):', error);
        return [];
    } finally {
        if (client) {
            client.release();
        }
    }
};