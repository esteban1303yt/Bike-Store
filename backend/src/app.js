require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const marcasRoutes = require('./routes/marcas.routes');
/* const ventasController = require('./routes/ventas.routes')
const Historial_pedidosRoutes = require('./routes/Historial_pedidos.routes'); */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/categorias', categoriasRoutes);
/* app.use('/api/ventas',ventasController)
app.use('/api/Historial_pedidos', Historial_pedidosRoutes); */

module.exports = app;