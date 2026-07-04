// tests/setup.js - VERSIÓN CON MOCKS (QUE FUNCIONA)
import { vi, beforeEach } from 'vitest';

// Datos mock en memoria
let mockAuthors = [
  { id: 1, name: 'Author 1', email: 'author1@example.com', bio: 'Bio 1', created_at: new Date() },
  { id: 2, name: 'Author 2', email: 'author2@example.com', bio: 'Bio 2', created_at: new Date() }
];

let mockPosts = [
  { id: 1, title: 'Post 1', content: 'Content 1', author_id: 1, published: true, created_at: new Date() },
  { id: 2, title: 'Post 2', content: 'Content 2', author_id: 2, published: false, created_at: new Date() }
];

let nextAuthorId = 3;
let nextPostId = 3;

const mockQuery = vi.fn(async (query, params) => {
  // SELECT all authors
  if (query === 'SELECT * FROM authors ORDER BY id') {
    return { rows: [...mockAuthors] };
  }
  
  // SELECT author by ID
  if (query === 'SELECT * FROM authors WHERE id = $1') {
    const author = mockAuthors.find(a => a.id === params[0]);
    return { rows: author ? [author] : [] };
  }
  
  // INSERT author
  if (query.includes('INSERT INTO authors')) {
    const emailExists = mockAuthors.some(a => a.email === params[1]);
    if (emailExists) {
      throw new Error('El email ya está duplicada');
    }
    const newAuthor = {
      id: nextAuthorId++,
      name: params[0],
      email: params[1],
      bio: params[2] || null,
      created_at: new Date()
    };
    mockAuthors.push(newAuthor);
    return { rows: [newAuthor] };
  }
  
  // UPDATE author
  if (query.includes('UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4')) {
    const id = params[3];
    const index = mockAuthors.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAuthors[index] = {
        ...mockAuthors[index],
        name: params[0] !== undefined ? params[0] : mockAuthors[index].name,
        email: params[1] !== undefined ? params[1] : mockAuthors[index].email,
        bio: params[2] !== undefined ? params[2] : mockAuthors[index].bio
      };
      return { rows: [mockAuthors[index]] };
    }
    return { rows: [] };
  }
  
  // DELETE author
  if (query.includes('DELETE FROM authors')) {
    const id = params[0];
    const index = mockAuthors.findIndex(a => a.id === id);
    if (index !== -1) {
      const deleted = mockAuthors.splice(index, 1)[0];
      return { rows: [deleted] };
    }
    return { rows: [] };
  }
  
  // SELECT all posts with JOIN
  if (query.includes('SELECT p.*, a.name as author_name') && !query.includes('WHERE')) {
    const allPostsWithAuthor = mockPosts.map(post => {
      const author = mockAuthors.find(a => a.id === post.author_id);
      return {
        ...post,
        author_name: author?.name,
        author_email: author?.email
      };
    });
    return { rows: allPostsWithAuthor };
  }
  
  // SELECT post by ID
  if (query.includes('SELECT p.*, a.name as author_name') && query.includes('WHERE p.id = $1')) {
    const post = mockPosts.find(p => p.id === params[0]);
    if (post) {
      const author = mockAuthors.find(a => a.id === post.author_id);
      return { 
        rows: [{
          ...post,
          author_name: author?.name,
          author_email: author?.email
        }] 
      };
    }
    return { rows: [] };
  }
  
  // SELECT posts by author
  if (query.includes('SELECT p.*, a.name as author_name') && query.includes('WHERE p.author_id = $1')) {
    const posts = mockPosts.filter(p => p.author_id === params[0]);
    const postsWithAuthor = posts.map(post => {
      const author = mockAuthors.find(a => a.id === post.author_id);
      return {
        ...post,
        author_name: author?.name,
        author_email: author?.email
      };
    });
    return { rows: postsWithAuthor };
  }
  
  // INSERT post
  if (query.includes('INSERT INTO posts')) {
    const authorExists = mockAuthors.some(a => a.id === params[2]);
    if (!authorExists) {
      throw new Error('Autor no encontrado');
    }

    const newPost = {
      id: nextPostId++,
      title: params[0],
      content: params[1],
      author_id: params[2],
      published: params[3] || false,
      created_at: new Date()
    };
    mockPosts.push(newPost);
    const author = mockAuthors.find(a => a.id === newPost.author_id);
    return {
      rows: [{
        ...newPost,
        author_name: author?.name,
        author_email: author?.email
      }]
    };
  }
  
  // UPDATE post
  if (query.includes('UPDATE posts SET title = $1, content = $2, author_id = $3, published = $4 WHERE id = $5')) {
    const id = params[4];
    const index = mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPosts[index] = {
        ...mockPosts[index],
        title: params[0] !== undefined ? params[0] : mockPosts[index].title,
        content: params[1] !== undefined ? params[1] : mockPosts[index].content,
        author_id: params[2] !== undefined ? params[2] : mockPosts[index].author_id,
        published: params[3] !== undefined ? params[3] : mockPosts[index].published
      };
      const author = mockAuthors.find(a => a.id === mockPosts[index].author_id);
      return { 
        rows: [{
          ...mockPosts[index],
          author_name: author?.name,
          author_email: author?.email
        }] 
      };
    }
    return { rows: [] };
  }
  
  // DELETE post
  if (query.includes('DELETE FROM posts')) {
    const id = params[0];
    const index = mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = mockPosts.splice(index, 1)[0];
      return { rows: [deleted] };
    }
    return { rows: [] };
  }
  
  // Check if author exists
  if (query === 'SELECT id FROM authors WHERE id = $1') {
    const exists = mockAuthors.some(a => a.id === params[0]);
    return { rows: exists ? [{ id: params[0] }] : [] };
  }
  
  return { rows: [] };
});

const mockDbClient = {
  query: mockQuery,
  connect: vi.fn(() => Promise.resolve({ release: vi.fn() })),
  end: vi.fn(() => Promise.resolve())
};

// Mock del módulo db/config
vi.mock('../src/db/config.js', () => ({
  default: mockDbClient
}));

export function resetMocks() {
  mockAuthors = [
    { id: 1, name: 'Author 1', email: 'author1@example.com', bio: 'Bio 1', created_at: new Date() },
    { id: 2, name: 'Author 2', email: 'author2@example.com', bio: 'Bio 2', created_at: new Date() }
  ];
  mockPosts = [
    { id: 1, title: 'Post 1', content: 'Content 1', author_id: 1, published: true, created_at: new Date() },
    { id: 2, title: 'Post 2', content: 'Content 2', author_id: 2, published: false, created_at: new Date() }
  ];
  nextAuthorId = 3;
  nextPostId = 3;
  mockQuery.mockClear();
}

beforeEach(() => {
  resetMocks();
});