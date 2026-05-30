const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const dbClient = require('./db/config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error: olvidé agregar las rutas y el endpoint de prueba
// const authorsRoutes = require('./routes/authors');
// const postsRoutes = require('./routes/posts');
// app.use('/authors', authorsRoutes);
// app.use('/posts', postsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
