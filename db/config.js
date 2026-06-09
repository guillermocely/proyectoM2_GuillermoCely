const { loadEnvFile } = require('node:process');
const { Client } = require('pg');
loadEnvFile('.env');

const dbClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbClient.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL exitosamente');
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });

module.exports = dbClient;
