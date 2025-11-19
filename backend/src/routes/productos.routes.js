const express = require('express');
const router = express.Router();
const productos = require('../controllers/productos.controller');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        await productos.obtenerProductos(req, res);
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        await productos.obtenerProductoPorId(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear producto
router.post('/', async (req, res) => {
    try {
        await productos.crearProducto(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
    try {
        await productos.actualizarProducto(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
    try {
        await productos.eliminarProducto(req, res);
    } catch (error) {
        if (error.message.includes('Registro no encontrado')) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.status(500).json({ error: 'Error al eliminar el producto: ' + error.message });
        }
    }
});

module.exports = router;