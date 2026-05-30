const express = require('express');
const router = express.Router();
const postsService = require('../services/postsService');

// GET /posts - listar todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await postsService.getAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id - obtener un post por ID
router.get('/:id', async (req, res) => {
  try {
    const post = await postsService.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/author/:authorId - obtener posts por author
router.get('/author/:authorId', async (req, res) => {
  try {
    const posts = await postsService.getByAuthor(req.params.authorId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /posts - crear un nuevo post
router.post('/', async (req, res) => {
  try {
    const post = await postsService.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    if (error.message.includes('obligatorios') || error.message.includes('no existe')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('foreign key')) {
      return res.status(400).json({ error: 'El author_id no existe' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id - actualizar un post
router.put('/:id', async (req, res) => {
  try {
    const post = await postsService.update(req.params.id, req.body);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    if (error.message.includes('no existe')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /posts/:id - eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const post = await postsService.delete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado correctamente', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
