const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');

// Ruta para procesar el carrito y generar la venta
router.post('/', (req, res) => ventasController.crearVenta(req, res));

module.exports = router;