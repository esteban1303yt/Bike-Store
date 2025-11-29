require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const marcasRoutes = require('./routes/marcas.routes');
const pagosRoutes  = require('./routes/pagos.routes');
/* const ventasController = require('./routes/ventas.routes')
const Historial_pedidosRoutes = require('./routes/Historial_pedidos.routes'); */
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/pagos', pagosRoutes)
/* app.use('/api/ventas',ventasController)
app.use('/api/Historial_pedidos', Historial_pedidosRoutes); */


// Servir toda la carpeta frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Ruta específica para adminproductos
app.get('/adminproductos', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/admin/adminproductos.html'));
});


module.exports = app;