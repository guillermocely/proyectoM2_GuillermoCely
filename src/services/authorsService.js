// src/services/authorsService.js
import dbClient from '../db/config.js';

const authorsService = {
  getAll: async () => {
    const result = await dbClient.query('SELECT * FROM authors ORDER BY id');
    return result.rows;
  },

  getById: async (id) => {
    const result = await dbClient.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows.length === 0 ? null : result.rows[0];
  },

  create: async (authorData) => {
    const { name, email, bio } = authorData;
    if (!name || !email) {
      throw new Error('name y email son obligatorios');
    }
    const result = await dbClient.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bio || null]
    );
    return result.rows[0];
  },

  update: async (id, authorData) => {
    const { name, email, bio } = authorData;
    const result = await dbClient.query(
      'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
      [name, email, bio, id]
    );
    return result.rows.length === 0 ? null : result.rows[0];
  },

  delete: async (id) => {
    const result = await dbClient.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    return result.rows.length === 0 ? null : result.rows[0];
  }
};

export default authorsService;