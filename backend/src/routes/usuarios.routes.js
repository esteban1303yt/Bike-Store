const express = require('express');
const router = express.Router();
const crudController = require('../controllers/usuarios.controller');
const { autenticarToken, autorizarRoles } = require('../middlewares/auth.middleware');

const crud = new crudController();
const tabla = 'usuarios';
const idCampo = 'id_usuario';

// Obtener todos los usuarios (solo admin)
router.get('/', autenticarToken, autorizarRoles('administrador'), async (req, res) => {
    try {
        const datos = await crud.obtenerUsuarios(tabla);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos de usuarios', error });
    }
});

// Obtener usuario por id (propietario o admin)
router.get('/:id', autenticarToken, async (req, res) => {
    if (req.usuario.id_usuario != req.params.id && req.usuario.rol !== 'administrador') {
        return res.status(403).json({ success: false, message: 'No tienes permisos' });
    }
    try {
        const dato = await crud.obtenerUno(tabla, idCampo, req.params.id);
        res.json(dato);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del usuario', error });
    }
});

// Actualizar usuario (propietario o admin)
router.put('/:id', autenticarToken, async (req, res) => {
    if (req.usuario.id_usuario != req.params.id && req.usuario.rol !== 'administrador') {
        return res.status(403).json({ success: false, message: 'No tienes permisos' });
    }
    try {
        const dataActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(dataActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario (solo admin)
router.delete('/:id', autenticarToken, autorizarRoles('administrador'), async (req, res) => {
    try {
        const resultado = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;