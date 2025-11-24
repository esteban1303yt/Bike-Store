const express = require('express');
const router = express.Router();
const historial= require('../controllers/Historial_pedidos.controller'); 




router.get('/', async (req, res) => {
  try {
    const datos = await historial.obtenerTodos();
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener los datos de los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener datos de los usuarios', error });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const dato = await historial.obtenerporid( req.params.id);
    res.json(dato);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener historial del usuario', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await historial.eliminarHistorial(id);
    res.json(resultado);
  } catch (error) {
    if (error.message.includes('historia no encontrada')) {
      res.status(404).json({ error: 'dato no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar la informacion + error.message '});
    }
}


});




module.exports = router;