const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const { autenticarToken } = require("../middlewares/auth.middleware");

// Instancia del controlador
const authController = new AuthController();

// Registro
router.post("/registro", (req, res) => authController.registrar(req, res));

// Login
router.post("/login", (req, res) => authController.iniciarSesion(req, res));

// Verificar usuario autenticado
router.get("/verificar/:id", autenticarToken, (req, res) => {
    authController.verificarUsuario(req, res);
});

module.exports = router;