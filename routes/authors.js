const express = require('express');
const router = express.Router();
const authorsService = require('../services/authorsService');

// GET /authors - listar todos los authors
router.get('/', async (req, res) => {
  try {
    const authors = await authorsService.getAll();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /authors/:id - obtener un author por ID
router.get('/:id', async (req, res) => {
  try {
    const author = await authorsService.getById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /authors - crear un nuevo author
router.post('/', async (req, res) => {
  try {
    const author = await authorsService.create(req.body);
    res.status(201).json(author);
  } catch (error) {
    // Error: no manejo errores de validación ni duplicados
    res.status(500).json({ error: error.message });
  }
});

// PUT /authors/:id - actualizar un author
router.put('/:id', async (req, res) => {
  try {
    const author = await authorsService.update(req.params.id, req.body);
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /authors/:id - eliminar un author
router.delete('/:id', async (req, res) => {
  try {
    const author = await authorsService.delete(req.params.id);
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
