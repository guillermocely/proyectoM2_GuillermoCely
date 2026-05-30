const request = require('supertest');
const app = require('../server');

describe('Authors API', () => {
  // Test para crear author
  describe('POST /authors', () => {
    it('debería crear un nuevo author', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: 'test@example.com',
        bio: 'Test bio'
      };
      
      const response = await request(app)
        .post('/authors')
        .send(newAuthor)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newAuthor.name);
      expect(response.body.email).toBe(newAuthor.email);
    });

    it('debería retornar 400 si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/authors')
        .send({ name: 'Test' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test para obtener authors
  describe('GET /authors', () => {
    it('debería obtener todos los authors', async () => {
      const response = await request(app)
        .get('/authors')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test para obtener author por ID
  describe('GET /authors/:id', () => {
    it('debería obtener un author por ID', async () => {
      const response = await request(app)
        .get('/authors/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('debería retornar 404 si el author no existe', async () => {
      const response = await request(app)
        .get('/authors/99999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test para eliminar author
  describe('DELETE /authors/:id', () => {
    it('debería retornar 404 al eliminar un author inexistente', async () => {
      const response = await request(app)
        .delete('/authors/99999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
