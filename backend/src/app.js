const express = require('express');
const cors = require('cors');
const app = express();

const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

module.exports = app;