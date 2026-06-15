// src/routes/posts.js
import express from 'express';
import postsService from '../services/postsService.js';

const router = express.Router();

// GET /posts - Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await postsService.getAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id - Obtener un post por ID
router.get('/:id', async (req, res) => {
  try {
    const post = await postsService.getById(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/author/:authorId - Obtener posts por autor
router.get('/author/:authorId', async (req, res) => {
  try {
    const posts = await postsService.getByAuthor(parseInt(req.params.authorId));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /posts - Crear un nuevo post
router.post('/', async (req, res) => {
  try {
    const newPost = await postsService.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    if (error.message.includes('author_id no existe')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /posts/:id - Actualizar un post
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await postsService.update(parseInt(req.params.id), req.body);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /posts/:id - Eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await postsService.delete(parseInt(req.params.id));
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;