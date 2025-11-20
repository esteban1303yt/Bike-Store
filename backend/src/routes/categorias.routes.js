const express = require('express');
const router = express.Router();
const categorias = require('../controllers/categorias.controller');

router.get('/', async (req, res) => {
    try {
        await categorias.obtenerCategorias(req, res);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;