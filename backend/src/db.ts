import { Pool } from 'pg';
import { DB_CONFIG } from './config'; // Ou suas credenciais diretas

const pool = new Pool(DB_CONFIG);

pool.on('error', (err) => {
    console.error('Erro inesperado no cliente ocioso do banco de dados', err);
    process.exit(-1);
});

// Função para fechar o pool de conexão, útil para scripts de teste ou desligamento gracioso
export const closePool = async () => {
    try {
        await pool.end();
        console.log('Pool de conexão do banco de dados fechado.');
    } catch (err) {
        console.error('Erro ao fechar o pool de conexão:', err);
    }
};

export default pool;