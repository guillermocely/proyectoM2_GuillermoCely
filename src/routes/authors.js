// src/routes/authors.js
import express from 'express';
import authorsService from '../services/authorsService.js';

const router = express.Router();

// GET /authors - Obtener todos los autores
router.get('/', async (req, res) => {
  try {
    const authors = await authorsService.getAll();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /authors/:id - Obtener un autor por ID
router.get('/:id', async (req, res) => {
  try {
    const author = await authorsService.getById(parseInt(req.params.id));
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /authors - Crear un nuevo autor
router.post('/', async (req, res) => {
  try {
    const newAuthor = await authorsService.create(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    if (error.message.includes('duplicada') || error.message.includes('email')) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /authors/:id - Actualizar un autor
router.put('/:id', async (req, res) => {
  try {
    const updatedAuthor = await authorsService.update(parseInt(req.params.id), req.body);
    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /authors/:id - Eliminar un autor
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuthor = await authorsService.delete(parseInt(req.params.id));
    if (!deletedAuthor) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json({ message: 'Autor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;