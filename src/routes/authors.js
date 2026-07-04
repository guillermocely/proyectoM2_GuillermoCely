// src/routes/authors.js
import express from 'express';
import authorsService from '../services/authorsService.js';

const router = express.Router();

// Función auxiliar para validar ID
const validateId = (id) => {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error('ID inválido');
  }
  return numId;
};

// GET /authors - Obtener todos los autores
router.get('/', async (req, res, next) => {
  try {
    const authors = await authorsService.getAll();
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

// GET /authors/:id - Obtener un autor por ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const author = await authorsService.getById(id);
    if (!author) {
      throw new Error('Autor no encontrado');
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
});

// POST /authors - Crear un nuevo autor
router.post('/', async (req, res, next) => {
  try {
    const newAuthor = await authorsService.create(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
});

// PUT /authors/:id - Actualizar un autor
router.put('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const updatedAuthor = await authorsService.update(id, req.body);
    if (!updatedAuthor) {
      throw new Error('Autor no encontrado');
    }
    res.json(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

// DELETE /authors/:id - Eliminar un autor
router.delete('/:id', async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const deletedAuthor = await authorsService.delete(id);
    if (!deletedAuthor) {
      throw new Error('Autor no encontrado');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;