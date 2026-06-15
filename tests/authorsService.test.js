import authorsService from '../src/services/authorsService.js';
import { resetMocks } from './setup.js';

describe('Authors Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('getAll', () => {
    test('debería retornar un array de authors', async () => {
      const authors = await authorsService.getAll();
      expect(Array.isArray(authors)).toBe(true);
    });
  });

  describe('getById', () => {
    test('debería retornar un author por ID válido', async () => {
      // Primero creamos un author para asegurar que existe
      const newAuthor = await authorsService.create({
        name: 'Test Author',
        email: 'testservice@example.com',
        bio: 'Test bio'
      });
      
      const author = await authorsService.getById(newAuthor.id);
      expect(author).toHaveProperty('id');
      expect(author).toHaveProperty('name');
      expect(author.name).toBe('Test Author');
    });

    test('debería retornar null para ID inexistente', async () => {
      const author = await authorsService.getById(99999);
      expect(author).toBeNull();
    });
  });

  describe('create', () => {
    test('debería crear un author válido', async () => {
      const newAuthor = await authorsService.create({
        name: 'New Author',
        email: 'newauthor@example.com',
        bio: 'New bio'
      });
      
      expect(newAuthor).toHaveProperty('id');
      expect(newAuthor.name).toBe('New Author');
      expect(newAuthor.email).toBe('newauthor@example.com');
    });

    test('debería lanzar error si faltan campos obligatorios', async () => {
      await expect(authorsService.create({ name: 'Test' }))
        .rejects.toThrow('name y email son obligatorios');
    });
  });

  describe('update', () => {
    test('debería actualizar un author existente', async () => {
      // Primero creamos un author
      const newAuthor = await authorsService.create({
        name: 'Author to Update',
        email: 'updateme@example.com',
        bio: 'Original bio'
      });
      
      // Lo actualizamos
      const updated = await authorsService.update(newAuthor.id, {
        name: 'Updated Author',
        bio: 'Updated bio'
      });
      
      expect(updated.name).toBe('Updated Author');
      expect(updated.bio).toBe('Updated bio');
      expect(updated.email).toBe('updateme@example.com'); // No cambió
    });

    test('debería retornar null para author inexistente', async () => {
      const updated = await authorsService.update(99999, { name: 'Test' });
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    test('debería eliminar un author existente', async () => {
      // Primero creamos un author
      const newAuthor = await authorsService.create({
        name: 'Author to Delete',
        email: 'deleteme@example.com',
        bio: 'Will be deleted'
      });
      
      // Lo eliminamos
      const deleted = await authorsService.delete(newAuthor.id);
      expect(deleted).toHaveProperty('id');
      expect(deleted.name).toBe('Author to Delete');
      
      // Verificamos que ya no existe
      const found = await authorsService.getById(newAuthor.id);
      expect(found).toBeNull();
    });

    test('debería retornar null para author inexistente', async () => {
      const deleted = await authorsService.delete(99999);
      expect(deleted).toBeNull();
    });
  });
});
