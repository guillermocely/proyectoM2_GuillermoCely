const dbClient = require('../db/config');

const postsService = {
  // Obtener todos los posts
  getAll: async () => {
    const result = await dbClient.query(`
      SELECT p.*, a.name as author_name, a.email as author_email 
      FROM posts p 
      JOIN authors a ON p.author_id = a.id 
      ORDER BY p.id
    `);
    return result.rows;
  },

  // Obtener un post por ID
  getById: async (id) => {
    const result = await dbClient.query(`
      SELECT p.*, a.name as author_name, a.email as author_email 
      FROM posts p 
      JOIN authors a ON p.author_id = a.id 
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  },

  // Obtener posts por author
  getByAuthor: async (authorId) => {
    const result = await dbClient.query(`
      SELECT p.*, a.name as author_name, a.email as author_email 
      FROM posts p 
      JOIN authors a ON p.author_id = a.id 
      WHERE p.author_id = $1 
      ORDER BY p.id
    `, [authorId]);
    return result.rows;
  },

  // Crear un nuevo post
  create: async (post) => {
    const { title, content, author_id, published } = post;
    
    if (!title || !content || !author_id) {
      throw new Error('title, content y author_id son obligatorios');
    }

    // Verificar que el author existe
    const authorResult = await dbClient.query('SELECT id FROM authors WHERE id = $1', [author_id]);
    if (authorResult.rows.length === 0) {
      throw new Error('El author_id no existe');
    }

    const result = await dbClient.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published || false]
    );
    
    // Obtener el post con información del author
    return await postsService.getById(result.rows[0].id);
  },

  // Actualizar un post
  update: async (id, post) => {
    const { title, content, author_id, published } = post;
    
    // Verificar que el post existe
    const existing = await postsService.getById(id);
    if (!existing) {
      return null;
    }

    // Si se proporciona author_id, verificar que existe
    if (author_id) {
      const authorResult = await dbClient.query('SELECT id FROM authors WHERE id = $1', [author_id]);
      if (authorResult.rows.length === 0) {
        throw new Error('El author_id no existe');
      }
    }

    const result = await dbClient.query(
      'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), author_id = COALESCE($3, author_id), published = COALESCE($4, published) WHERE id = $5 RETURNING *',
      [title, content, author_id, published, id]
    );
    
    // Obtener el post actualizado con información del author
    return await postsService.getById(result.rows[0].id);
  },

  // Eliminar un post
  delete: async (id) => {
    // Verificar que el post existe
    const existing = await postsService.getById(id);
    if (!existing) {
      return null;
    }

    const result = await dbClient.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = postsService;
