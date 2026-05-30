const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const dbClient = require('./db/config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear tablas automáticamente al iniciar (después de que db/config.js ya conectó)
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

// Importar routes
const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');

// Usar routes
app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Endpoint de prueba de conexión a BD
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT NOW() as current_time');
    res.json({ success: true, time: result.rows[0].current_time });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   GET  /api/test-db          - Probar conexión a BD`);
  console.log(`   GET  /authors              - Listar authors`);
  console.log(`   GET  /authors/:id          - Obtener author por ID`);
  console.log(`   POST /authors              - Crear author`);
  console.log(`   PUT  /authors/:id          - Actualizar author`);
  console.log(`   DELETE /authors/:id        - Eliminar author`);
  console.log(`   GET  /posts                - Listar posts`);
  console.log(`   GET  /posts/:id            - Obtener post por ID`);
  console.log(`   GET  /posts/author/:id     - Obtener posts por author`);
  console.log(`   POST /posts                - Crear post`);
  console.log(`   PUT  /posts/:id            - Actualizar post`);
  console.log(`   DELETE /posts/:id          - Eliminar post`);
});
