-- Script de seed para MiniBlog
-- Inserta datos de ejemplo para authors y posts
-- Ejecutar después de setup.sql

INSERT INTO authors (name, email, bio) VALUES
('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published) VALUES
('Introducción a Node.js', 'Node.js es un runtime de JavaScript que permite ejecutar código JavaScript en el servidor. Es ideal para aplicaciones en tiempo real y APIs.', 1, true),
('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas. PostgreSQL destaca por su cumplimiento de estándares SQL y características avanzadas, mientras que MySQL es conocido por su simplicidad y rendimiento.', 2, true),
('APIs RESTful', 'REST es un estilo arquitectónico para sistemas distribuidos. Utiliza métodos HTTP estándar (GET, POST, PUT, DELETE) para realizar operaciones sobre recursos.', 1, true),
('Manejo de errores en Express', 'El manejo apropiado de errores es crucial en Express. Usa middleware de error para capturar y procesar errores de manera centralizada.', 3, false),
('Async/Await explicado', 'Las promesas simplifican el código asíncrono. Async/await es azúcar sintáctico sobre promesas que hace el código más legible y fácil de mantener.', 1, false)
ON CONFLICT DO NOTHING;
