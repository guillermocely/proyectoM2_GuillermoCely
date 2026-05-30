const dbClient = require('../db/config');

const authorsService = {
  // Obtener todos los authors
  getAll: async () => {
    const result = await dbClient.query('SELECT * FROM authors ORDER BY id');
    return result.rows;
  },

  // Obtener un author por ID
  getById: async (id) => {
    const result = await dbClient.query('SELECT * FROM authors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  },

  // Crear un nuevo author
  create: async (author) => {
    const { name, email, bio } = author;
    
    if (!name || !email) {
      throw new Error('name y email son obligatorios');
    }

    const result = await dbClient.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bio || null]
    );
    return result.rows[0];
  },

  // Actualizar un author
  update: async (id, author) => {
    const { name, email, bio } = author;
    
    // Verificar que el author existe
    const existing = await authorsService.getById(id);
    if (!existing) {
      return null;
    }

    const result = await dbClient.query(
      'UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
      [name, email, bio, id]
    );
    return result.rows[0];
  },

  // Eliminar un author
  delete: async (id) => {
    // Verificar que el author existe
    const existing = await authorsService.getById(id);
    if (!existing) {
      return null;
    }

    const result = await dbClient.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = authorsService;
