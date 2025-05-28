"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config"); // Ou suas credenciais diretas
const pool = new pg_1.Pool(config_1.DB_CONFIG);
pool.on('error', (err) => {
    console.error('Erro inesperado no cliente ocioso do banco de dados', err);
    process.exit(-1);
});
// Função para fechar o pool de conexão, útil para scripts de teste ou desligamento gracioso
const closePool = async () => {
    try {
        await pool.end();
        console.log('Pool de conexão do banco de dados fechado.');
    }
    catch (err) {
        console.error('Erro ao fechar o pool de conexão:', err);
    }
};
exports.closePool = closePool;
exports.default = pool;
