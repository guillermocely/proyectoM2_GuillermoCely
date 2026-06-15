// tests/postsService.test.js
import postsService from '../src/services/postsService.js';
import authorsService from '../src/services/authorsService.js';
import { resetMocks } from './setup.js';

describe('Posts Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('getAll', () => {
    test('debería retornar un array de posts', async () => {
      const posts = await postsService.getAll();
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe('getById', () => {
    test('debería retornar un post por ID válido', async () => {
      const author = await authorsService.create({
        name: 'Test Author',
        email: 'test@example.com',
        bio: 'Test bio'
      });
      
      const newPost = await postsService.create({
        title: 'Test Post',
        content: 'Test content',
        author_id: author.id,
        published: true
      });
      
      const post = await postsService.getById(newPost.id);
      expect(post).toHaveProperty('id');
      expect(post.title).toBe('Test Post');
    });

    test('debería retornar null para ID inexistente', async () => {
      const post = await postsService.getById(99999);
      expect(post).toBeNull();
    });
  });

  // Agrega más pruebas similares a las de authorsService...
});