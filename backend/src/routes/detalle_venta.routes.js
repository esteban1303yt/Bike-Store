const express = require('express');
const router = express.Router();
const crudController = require('../controllers/detalle_venta.controller');

const crud = new crudController;

const tabla = 'usuarios';
const idCampo = 'id_usuario';


// Obtener carrito por ID 
router.get('/:id', async (req, res) => {
  try {
    const dato = await crud.obtenerCarrito(tabla, idCampo, req.params.id);
    res.json(dato);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario', error });
  }
});

// 2 agregar producto al carrito
router.post('/', async (req, res) => {
  try {
    const nuevoDato = await crud.crear(tabla, res.body);
    res.status(201).json(nuevoDato)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//3 actualizar cantidad de productos del carrito
router.put('/:id', async (req, res) => {
  try {
    const dataActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
    res.json(dataActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4 Eliminar productos del carrito
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await crud.eliminar(tabla, idCampo, id);
    res.json(resultado);
  } catch (error) {
    if (error.message.includes('Registro no encontrado')) {
      res.status(404).json({ error: 'dato no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el dato' + error.message });
    }
  }
});

// 5 vaciar carrito 
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await crud.eliminar(tabla, idCampo, id);
    res.json(resultado);
  } catch (error) {
    if (error.message.includes('Registro no encontrado')) {
      res.status(404).json({ error: 'dato no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el dato' + error.message });
    }
  }
});

module.exports = router;