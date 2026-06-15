// src/services/postsService.js
import dbClient from '../db/config.js';

const postsService = {
  getAll: async () => {
    const result = await dbClient.query(`
      SELECT p.*, a.name as author_name, a.email as author_email
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      ORDER BY p.id
    `);
    return result.rows;
  },

  getById: async (id) => {
    const result = await dbClient.query(`
      SELECT p.*, a.name as author_name, a.email as author_email
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      WHERE p.id = $1
    `, [id]);
    return result.rows.length === 0 ? null : result.rows[0];
  },

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

  create: async (postData) => {
    const { title, content, author_id, published = false } = postData;
    if (!title || !content || !author_id) {
      throw new Error('title, content y author_id son obligatorios');
    }
    const authorExists = await dbClient.query('SELECT id FROM authors WHERE id = $1', [author_id]);
    if (authorExists.rows.length === 0) {
      throw new Error('El author_id no existe');
    }
    const result = await dbClient.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published]
    );
    return result.rows[0];
  },

  update: async (id, postData) => {
    const { title, content, author_id, published } = postData;
    if (author_id) {
      const authorExists = await dbClient.query('SELECT id FROM authors WHERE id = $1', [author_id]);
      if (authorExists.rows.length === 0) {
        throw new Error('El author_id no existe');
      }
    }
    const result = await dbClient.query(
      'UPDATE posts SET title = $1, content = $2, author_id = $3, published = $4 WHERE id = $5 RETURNING *',
      [title, content, author_id, published, id]
    );
    return result.rows.length === 0 ? null : result.rows[0];
  },

  delete: async (id) => {
    const result = await dbClient.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows.length === 0 ? null : result.rows[0];
  }
};

export default postsService;