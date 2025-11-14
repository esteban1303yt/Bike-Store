const express = require('express');
const router = express.Router();
const crudController = require('../controllers/usuarios.controller');

const crud = new crudController;

const tabla = 'usuarios';
const idCampo = 'id_usuario';

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const datos = await crud.obtenerUsuarios(tabla);
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener los datos de los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener datos de los usuarios', error });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const dato = await crud.obtenerUno(tabla, idCampo, req.params.id);
    res.json(dato);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario', error });
  }
});

//crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoDato = await crud.crear(tabla, req.body);
    res.status(201).json(nuevoDato)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const dataActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
    res.json(dataActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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