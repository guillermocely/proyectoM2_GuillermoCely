// src/db/config.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env según entorno
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, `../../${envFile}`);
dotenv.config({ path: envPath });

const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '2026',
  database: process.env.DB_NAME || 'integrator_db',
  max: 20, // Máximo de clientes en el pool
  idleTimeoutMillis: 30000, // Tiempo antes de cerrar clientes inactivos
  connectionTimeoutMillis: 2000, // Tiempo de espera para conexión
});

// Verificar conexión
dbPool.connect()
  .then(client => {
    console.log('✅ Conectado a PostgreSQL exitosamente (Pool)');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    if (process.env.NODE_ENV !== 'test') process.exit(1);
  });

export default dbPool;