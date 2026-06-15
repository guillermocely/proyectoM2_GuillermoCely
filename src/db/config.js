// src/db/config.js
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env según entorno
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, `../../${envFile}`);
dotenv.config({ path: envPath });

const dbClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '2026',
  database: process.env.DB_NAME || 'integrator_db',
});

dbClient.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL exitosamente'))
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    if (process.env.NODE_ENV !== 'test') process.exit(1);
  });

export default dbClient;