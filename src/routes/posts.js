// src/routes/posts.js
import express from 'express';
import postsService from '../services/postsService.js';

const router = express.Router();

// Función auxiliar para validar ID
const validateId = (id) => {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error('ID inválido');
  }
  return numId;
};

// GET /posts - Obtener todos los posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await postsService.getAll();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Obtener un post por ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const post = await postsService.getById(id);
    if (!post) {
      throw new Error('Post no encontrado');
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// GET /posts/author/:authorId - Obtener posts por autor
router.get('/author/:authorId', async (req, res, next) => {
  try {
    const authorId = validateId(req.params.authorId);
    const posts = await postsService.getByAuthor(authorId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// POST /posts - Crear un nuevo post
router.post('/', async (req, res, next) => {
  try {
    const newPost = await postsService.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// PUT /posts/:id - Actualizar un post
router.put('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const updatedPost = await postsService.update(id, req.body);
    if (!updatedPost) {
      throw new Error('Post no encontrado');
    }
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id - Eliminar un post
router.delete('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const deletedPost = await postsService.delete(id);
    if (!deletedPost) {
      throw new Error('Post no encontrado');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;