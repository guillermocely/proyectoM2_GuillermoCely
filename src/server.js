// src/server.js
import app from './app.js';  // ← Cambia de './utils/app.js' a './app.js'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Endpoints disponibles:`);
  console.log(`   GET    /api/authors`);
  console.log(`   GET    /api/authors/:id`);
  console.log(`   POST   /api/authors`);
  console.log(`   PUT    /api/authors/:id`);
  console.log(`   DELETE /api/authors/:id`);
  console.log(`   GET    /api/posts`);
  console.log(`   GET    /api/posts/:id`);
  console.log(`   GET    /api/posts/author/:authorId`);
  console.log(`   POST   /api/posts`);
  console.log(`   PUT    /api/posts/:id`);
  console.log(`   DELETE /api/posts/:id`);
  console.log(`   GET    /api/test-db`);
});