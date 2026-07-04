// tests/authors.integration.test.js
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import './setup.js'; // Importar setup para los mocks

describe('Authors API - Integration Tests', () => {
  test('GET /api/authors - Debería obtener todos los autores', async () => {
    const response = await request(app).get('/api/authors');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/authors - Debería crear un nuevo autor', async () => {
    const newAuthor = {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      bio: 'Desarrollador full-stack'
    };

    const response = await request(app)
      .post('/api/authors')
      .send(newAuthor);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newAuthor.name);
    expect(response.body.email).toBe(newAuthor.email);
  });

  test('POST /api/authors - Debería rechazar autor sin nombre', async () => {
    const invalidAuthor = {
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/authors')
      .send(invalidAuthor);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('name y email son obligatorios');
  });

  test('POST /api/authors - Debería rechazar autor sin email', async () => {
    const invalidAuthor = {
      name: 'Test Author'
    };

    const response = await request(app)
      .post('/api/authors')
      .send(invalidAuthor);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('name y email son obligatorios');
  });

  test('POST /api/authors - Debería rechazar email duplicado', async () => {
    const duplicateAuthor = {
      name: 'Otro Autor',
      email: 'author1@example.com' // Email que ya existe en mock
    };

    const response = await request(app)
      .post('/api/authors')
      .send(duplicateAuthor);

    expect(response.status).toBe(409);
  });

  test('GET /api/authors/:id - Debería obtener un autor por ID existente', async () => {
    const response = await request(app).get('/api/authors/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  test('GET /api/authors/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app).get('/api/authors/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('GET /api/authors/:id - Debería responder 404 para autor no encontrado', async () => {
    const response = await request(app).get('/api/authors/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Autor no encontrado');
  });

  test('PUT /api/authors/:id - Debería actualizar un autor existente', async () => {
    const updatedData = {
      name: 'Author 1 Actualizado',
      email: 'author1@example.com',
      bio: 'Bio actualizada'
    };

    const response = await request(app)
      .put('/api/authors/1')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  test('PUT /api/authors/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app)
      .put('/api/authors/invalid')
      .send({ name: 'Test' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('PUT /api/authors/:id - Debería responder 404 para autor no encontrado', async () => {
    const response = await request(app)
      .put('/api/authors/99999')
      .send({ name: 'Test' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Autor no encontrado');
  });

  test('DELETE /api/authors/:id - Debería eliminar un autor existente', async () => {
    const response = await request(app).delete('/api/authors/1');
    expect(response.status).toBe(204);
  });

  test('DELETE /api/authors/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app).delete('/api/authors/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('DELETE /api/authors/:id - Debería responder 404 para autor no encontrado', async () => {
    const response = await request(app).delete('/api/authors/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Autor no encontrado');
  });
});
