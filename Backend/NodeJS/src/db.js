import { createPool } from 'mysql2/promise';
import { dbConfig } from './config/credentials.js';

export const pool = createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
});