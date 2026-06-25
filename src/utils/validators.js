// Validation utilities for the MiniBlog API

/**
 * Validates author data
 * @param {Object} data - Author data to validate
 * @returns {string|null} - Error message or null if valid
 */
function validateAuthor(data) {
  if (!data) {
    return 'Los datos del author son requeridos';
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'El nombre es requerido';
  }

  if (data.name.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }

  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    return 'El email es requerido';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return 'El email debe ser válido';
  }

  if (data.bio && typeof data.bio !== 'string') {
    return 'La bio debe ser texto';
  }

  return null;
}

/**
 * Validates post data
 * @param {Object} data - Post data to validate
 * @returns {string|null} - Error message or null if valid
 */
function validatePost(data) {
  if (!data) {
    return 'Los datos del post son requeridos';
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    return 'El título es requerido';
  }

  if (data.title.length < 3) {
    return 'El título debe tener al menos 3 caracteres';
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    return 'El contenido es requerido';
  }

  if (data.content.length < 10) {
    return 'El contenido debe tener al menos 10 caracteres';
  }

  if (!data.author_id || typeof data.author_id !== 'number') {
    return 'El author_id es requerido y debe ser un número';
  }

  if (data.published !== undefined && typeof data.published !== 'boolean') {
    return 'El campo published debe ser un booleano';
  }

  return null;
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is not empty and meets minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidString(value, minLength = 1) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return value.trim().length >= minLength;
}

export {
  validateAuthor,
  validatePost,
  isValidEmail,
  isValidString
};
