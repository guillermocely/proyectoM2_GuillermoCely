// src/middlewares/errorHandler.js
// Middleware global de manejo de errores

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Errores de validación de datos (campos obligatorios)
  if (err.message.includes('obligatorios')) {
    return res.status(400).json({ error: err.message });
  }

  // Errores de validación de ID
  if (err.message.includes('ID inválido')) {
    return res.status(400).json({ error: err.message });
  }

  // Errores de recurso no encontrado
  if (err.message.includes('no encontrado')) {
    return res.status(404).json({ error: err.message });
  }

  // Errores de duplicado (email único) - específico para duplicados
  if (err.message.includes('duplicada')) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  // Errores de validación de datos genéricos
  if (err.message.includes('inválido')) {
    return res.status(400).json({ error: err.message });
  }

  // Error interno del servidor por defecto
  res.status(500).json({ error: 'Error interno del servidor' });
};

export default errorHandler;
