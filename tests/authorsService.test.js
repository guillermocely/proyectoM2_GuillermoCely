// tests/unit/authorsValidators.test.js
import { describe, test, expect } from 'vitest';
import { validateAuthor } from '../src/utils/validators.js';

describe('validateAuthor', () => {
  test('acepta datos de author válidos', () => {
    const result = validateAuthor({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      bio: 'Bio del autor'
    });
    expect(result).toBe(null);
  });

  test('rechaza nombre vacío', () => {
    const result = validateAuthor({
      name: '',
      email: 'juan@example.com'
    });
    expect(result).toContain('requerido');
  });

  test('rechaza nombre muy corto', () => {
    const result = validateAuthor({
      name: 'Jo',
      email: 'juan@example.com'
    });
    expect(result).toContain('al menos 3');
  });

  test('rechaza email vacío', () => {
    const result = validateAuthor({
      name: 'Juan Pérez',
      email: ''
    });
    expect(result).toContain('requerido');
  });

  test('rechaza email inválido', () => {
    const result = validateAuthor({
      name: 'Juan Pérez',
      email: 'email-invalido'
    });
    expect(result).toContain('válido');
  });

  test('acepta bio opcional vacía', () => {
    const result = validateAuthor({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      bio: ''
    });
    expect(result).toBe(null);
  });
});
