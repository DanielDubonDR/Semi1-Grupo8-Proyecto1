import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
}

export const bucketConfig = {
    name: process.env.NAME_BUCKET,
    region: process.env.REGION_BUCKET,
    id: process.env.ID_BUCKET,
    key: process.env.KEY_BUCKET
}