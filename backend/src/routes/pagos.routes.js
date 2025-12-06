const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');

// Obtener todos los pagos
router.get('/', async (req, res) => {
    try {
        const pago = await pagosController.obtenerTodos();
        res.json(pago);
    } catch (error) {
        console.error('Error al obtener ventas', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener pago por ID
router.get('/:id', async (req, res) => {
    try {
        const venta = await pagosController.obtenerPorId(req.params.id);
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear pago
router.post('/', async (req, res) => {
    try {
        const nuevaVenta = await pagosController.crearVenta(req.body);
        res.json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar pago
router.delete('/:id', async (req, res) => {
    try {
        const eliminar = await pagosController.eliminarVenta(req.params.id);
        res.json(eliminar);
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            res.status(404).json({ error: "Venta no encontrada" });
        } else {
            res.status(500).json({ error: "Error al eliminar: " + error.message });
        }
    }
});

module.exports = router;