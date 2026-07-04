// tests/posts.integration.test.js
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import './setup.js'; // Importar setup para los mocks

describe('Posts API - Integration Tests', () => {
  const authorId = 1; // ID que existe en mock

  test('GET /api/posts - Debería obtener todos los posts', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/posts - Debería crear un nuevo post', async () => {
    const newPost = {
      title: 'Nuevo Post de Prueba',
      content: 'Contenido del post de prueba',
      author_id: authorId,
      published: true
    };

    const response = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newPost.title);
  });

  test('POST /api/posts - Debería rechazar post sin título', async () => {
    const invalidPost = {
      content: 'Contenido',
      author_id: authorId
    };

    const response = await request(app)
      .post('/api/posts')
      .send(invalidPost);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('title, content y author_id son obligatorios');
  });

  test('POST /api/posts - Debería rechazar post sin contenido', async () => {
    const invalidPost = {
      title: 'Título',
      author_id: authorId
    };

    const response = await request(app)
      .post('/api/posts')
      .send(invalidPost);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('title, content y author_id son obligatorios');
  });

  test('POST /api/posts - Debería rechazar post sin author_id', async () => {
    const invalidPost = {
      title: 'Título',
      content: 'Contenido'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(invalidPost);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('title, content y author_id son obligatorios');
  });

  test('POST /api/posts - Debería responder 404 para author_id inexistente', async () => {
    const invalidPost = {
      title: 'Título',
      content: 'Contenido',
      author_id: 99999
    };

    const response = await request(app)
      .post('/api/posts')
      .send(invalidPost);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Autor no encontrado');
  });

  test('GET /api/posts/:id - Debería obtener un post por ID existente', async () => {
    const response = await request(app).get('/api/posts/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  test('GET /api/posts/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app).get('/api/posts/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('GET /api/posts/:id - Debería responder 404 para post no encontrado', async () => {
    const response = await request(app).get('/api/posts/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post no encontrado');
  });

  test('GET /api/posts/author/:authorId - Debería obtener posts por autor', async () => {
    const response = await request(app).get(`/api/posts/author/${authorId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/posts/author/:authorId - Debería responder 400 para ID inválido', async () => {
    const response = await request(app).get('/api/posts/author/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('PUT /api/posts/:id - Debería actualizar un post existente', async () => {
    const updatedData = {
      title: 'Post 1 Actualizado',
      content: 'Contenido actualizado',
      author_id: authorId,
      published: false
    };

    const response = await request(app)
      .put('/api/posts/1')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
  });

  test('PUT /api/posts/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app)
      .put('/api/posts/invalid')
      .send({ title: 'Test' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('PUT /api/posts/:id - Debería responder 404 para post no encontrado', async () => {
    const response = await request(app)
      .put('/api/posts/99999')
      .send({ title: 'Test' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post no encontrado');
  });

  test('DELETE /api/posts/:id - Debería eliminar un post existente', async () => {
    const response = await request(app).delete('/api/posts/1');
    expect(response.status).toBe(204);
  });

  test('DELETE /api/posts/:id - Debería responder 400 para ID inválido', async () => {
    const response = await request(app).delete('/api/posts/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  test('DELETE /api/posts/:id - Debería responder 404 para post no encontrado', async () => {
    const response = await request(app).delete('/api/posts/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post no encontrado');
  });
});
