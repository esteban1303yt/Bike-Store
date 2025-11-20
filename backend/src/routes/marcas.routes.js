const express = require('express');
const router = express.Router();
const marcas = require('../controllers/marcas.controller');

router.get('/', async (req, res) => {
    try {
        await marcas.obtenerMarcas(req, res);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;