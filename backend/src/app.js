const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const usuariosRoutes = require('./routes/usuarios.routes');

// Middlewares

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/usuarios', usuariosRoutes);

module.exports = app;