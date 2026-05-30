const { Client } = require('pg');
require('dotenv').config();

const dbClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '2026',
  database: process.env.DB_NAME || 'integrator_db',
});

// Error: olvidé conectar a la base de datos
// dbClient.connect()
//   .then(() => {
//     console.log('✅ Conectado a PostgreSQL exitosamente');
//   })
//   .catch(err => {
//     console.error('❌ Error conectando a PostgreSQL:', err.message);
//     process.exit(1);
//   });

module.exports = dbClient;
