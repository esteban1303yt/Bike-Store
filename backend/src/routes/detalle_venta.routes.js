const express = require('express');
const router = express.Router();
const crudController = require('../controllers/detalle_venta.controller');

const crud = new crudController;

const tabla = 'usuarios';
const idCampo = 'id_usuario';

module.exports = router;