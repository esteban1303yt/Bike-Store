const express = require('express');
const router = express.Router();
const productos = require('../controllers/productos.controller');
const upload = require("../middlewares/uploads");

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        await productos.obtenerProductos(req, res);
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Buscar productos por texto
router.get('/buscar/:texto', async (req, res) => {
    try {
        await productos.buscarProducto(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Obtener stock de un producto
router.get("/:id/stock", async (req, res) => {
    await productos.obtenerStock(req, res);
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
router.post('/', upload.single("imagen"), async (req, res) => {
    try {
        await productos.crearProducto(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Actualizar producto Y IMAGEN
router.put('/:id', upload.single('imagen'), async (req, res) => {
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
        console.error("Error al eliminar producto", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;