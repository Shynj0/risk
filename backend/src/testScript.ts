// src/testScript.ts
import pool, { closePool } from './db'; // Importa pool como default e closePool nomeado

async function testDbConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log('Conexão bem-sucedida ao banco de dados!');
        const res = await client.query('SELECT NOW()');
        console.log('Resultado da query de teste:', res.rows[0]);
    } catch (err) {
        console.error('Erro na conexão ou query de teste:', err);
    } finally {
        if (client) {
            client.release();
        }
        // Chama closePool para fechar o pool após o teste
        await closePool();
    }
}

testDbConnection();