// src/config.ts
import dotenv from 'dotenv';
dotenv.config(); 

export const DB_CONFIG = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'postgres',
    password: process.env.DB_PASSWORD || 'admin', // MUITO IMPORTANTE: Ajuste isso no seu .env
    port: parseInt(process.env.DB_PORT || '5432', 10),
};