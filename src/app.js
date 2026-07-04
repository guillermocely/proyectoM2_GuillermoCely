// src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dbClient from './db/config.js';        // ✅ Cambiado: ../db → ./db
import authorsRoutes from './routes/authors.js';   // ✅ Cambiado: ../routes → ./routes
import postsRoutes from './routes/posts.js';       // ✅ Cambiado: ../routes → ./routes
import errorHandler from './middlewares/errorHandler.js'; // Middleware de errores

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SÓLO creamos las tablas automáticamente si NO estamos ejecutando los tests
if (process.env.NODE_ENV !== 'test') {
  dbClient.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      bio TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
    .then(() => {
      console.log('✅ Tabla "authors" verificada/creada');
      return dbClient.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          author_id INTEGER NOT NULL,
          published BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
        )
      `);
    })
    .then(() => {
      console.log('✅ Tabla "posts" verificada/creada');
    })
    .catch(err => {
      console.error('❌ Error creando tablas:', err.message);
    });
}

// Usar routes
app.use('/api/authors', authorsRoutes);
app.use('/api/posts', postsRoutes);

// Middleware de manejo de errores global
app.use(errorHandler);

// Endpoint de prueba de conexión a BD
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT NOW() as current_time');
    res.json({ success: true, time: result.rows[0].current_time });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;