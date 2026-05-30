# MiniBlog API - Proyecto Integrador M2

API REST para gestionar autores y publicaciones (posts) en una plataforma de blogging simple.

## 📋 Descripción

Este proyecto es una API REST construida con Node.js, Express y PostgreSQL que permite realizar operaciones CRUD sobre las entidades `authors` y `posts`. La API está diseñada para ser simple, escalable y fácil de integrar con frontends.

## 🚀 Tecnologías

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente de PostgreSQL para Node.js
- **Jest** - Framework de testing
- **Supertest** - Testing de endpoints HTTP

## 📁 Estructura del Proyecto

```
integrator-backend/
├── db/
│   ├── config.js          # Configuración de conexión a PostgreSQL
│   ├── setup.sql          # Script de creación de tablas
│   └── seed.sql           # Datos de ejemplo
├── routes/
│   ├── authors.js         # Rutas para authors
│   └── posts.js           # Rutas para posts
├── services/
│   ├── authorsService.js  # Lógica de negocio para authors
│   └── postsService.js    # Lógica de negocio para posts
├── tests/
│   └── authors.test.js    # Tests unitarios
├── server.js              # Archivo principal del servidor
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno (no subido a Git)
└── .env.example           # Ejemplo de variables de entorno
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd integrator-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales de PostgreSQL:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=integrator_db
   ```

4. **Crear la base de datos**
   ```bash
   createdb integrator_db
   ```

5. **Ejecutar script de setup**
   ```bash
   psql -U postgres -d integrator_db -f db/setup.sql
   ```

6. **(Opcional) Cargar datos de ejemplo**
   ```bash
   psql -U postgres -d integrator_db -f db/seed.sql
   ```

## 🏃 Ejecutar la Aplicación

### Modo desarrollo
```bash
npm start
```

### Ejecutar tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

El servidor se iniciará en `http://localhost:3000`

## 📚 Endpoints de la API

### Authors

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/authors` | Listar todos los authors |
| GET | `/authors/:id` | Obtener un author por ID |
| POST | `/authors` | Crear un nuevo author |
| PUT | `/authors/:id` | Actualizar un author |
| DELETE | `/authors/:id` | Eliminar un author |

### Posts

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/posts` | Listar todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener posts por author |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

### Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/test-db` | Probar conexión a la base de datos |

## 📊 Modelo de Datos

### Authors
```javascript
{
  id: Integer (auto-increment),
  name: String (required, max 100),
  email: String (required, unique, max 150),
  bio: String (optional),
  created_at: Timestamp (auto-generated)
}
```

### Posts
```javascript
{
  id: Integer (auto-increment),
  title: String (required, max 200),
  content: String (required),
  author_id: Integer (required, FK → authors.id),
  published: Boolean (default: false),
  created_at: Timestamp (auto-generated)
}
```

## ✅ Validaciones

### Authors
- `name` es obligatorio
- `email` es obligatorio y único

### Posts
- `title` es obligatorio
- `content` es obligatorio
- `author_id` es obligatorio y debe existir en authors

## 🧪 Testing

El proyecto incluye tests unitarios para verificar el funcionamiento de los endpoints críticos:

- Creación de authors
- Obtención de authors
- Validación de campos obligatorios
- Manejo de recursos inexistentes (404)

Para ejecutar los tests:
```bash
npm test
```

## 🚀 Deployment en Railway

### Pasos para desplegar

1. **Crear cuenta en Railway** [railway.app](https://railway.app)

2. **Crear nuevo proyecto desde GitHub**
   - Conectar tu repositorio de GitHub
   - Seleccionar el repositorio del proyecto

3. **Configurar variables de entorno en Railway**
   - Agregar las variables del archivo `.env.example`
   - Railway proporcionará las credenciales de PostgreSQL automáticamente

4. **Ejecutar script de setup**
   - Railway puede ejecutar comandos automáticamente al deploy
   - Agregar comando en package.json o ejecutar manualmente desde el dashboard

5. **Obtener la URL del servicio**
   - Railway generará una URL pública para tu API
   - La URL estará disponible en el dashboard del proyecto

### Variables de Entorno en Railway

Railway proporciona automáticamente:
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

Configura tu `.env` para usar estas variables:
```env
PORT=3000
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_NAME=${PGDATABASE}
```

## 📝 Ejemplos de Uso

### Crear un Author
```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "bio": "Desarrollador web"
  }'
```

### Crear un Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primer post",
    "content": "Contenido del post...",
    "author_id": 1,
    "published": true
  }'
```

### Listar Posts
```bash
curl http://localhost:3000/posts
```

## 🤝 Contribuciones

Este es un proyecto educativo. Para contribuir:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

Proyecto desarrollado como parte del Módulo 2 - Proyecto Integrador

## 🐛 Issues

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en el repositorio.
