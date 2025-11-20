const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

    // =====================================================
    // REGISTRO
    // =====================================================
    async registrar(req, res) {
        try {
            const { nombre, apellido, correo, clave } = req.body;

            if (!nombre || !apellido || !correo || !clave) {
                return res.status(400).json({ success: false, message: "Faltan datos" });
            }

            // Verificar si ya existe
            const [existe] = await db.query(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );

            if (existe.length > 0) {
                return res.json({ success: false, message: "El correo ya está registrado" });
            }

            // Encriptar contraseña
            const hashed = await bcrypt.hash(clave, 10);

            // Insertar usuario
            const [resultado] = await db.query(
                `INSERT INTO usuarios (nombre, apellido, correo, clave, rol)
                VALUES (?, ?, ?, ?, 'cliente')`,
                [nombre, apellido, correo, hashed]
            );

            return res.json({
                success: true,
                message: "Usuario registrado correctamente",
                usuario: {
                    id_usuario: resultado.insertId,
                    nombre,
                    apellido,
                    correo,
                    rol: "cliente"
                }
            });

        } catch (error) {
            console.log("Error en registrar:", error);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }
    }

    // =====================================================
    // LOGIN
    // =====================================================
    async iniciarSesion(req, res) {
        try {
            const { correo, clave } = req.body;

            if (!correo || !clave) {
                return res.status(400).json({ success: false, message: "Faltan datos" });
            }

            const [resultado] = await db.query(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );

            if (resultado.length === 0) {
                return res.status(401).json({ success: false, message: "Credenciales inválidas" });
            }

            const usuario = resultado[0];

            // Verificar contraseña encriptada
            const coincide = await bcrypt.compare(clave, usuario.clave);

            if (!coincide) {
                return res.status(401).json({ success: false, message: "Credenciales inválidas" });
            }

            // Crear token
            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    rol: usuario.rol,
                },
                process.env.JWT_SECRET || "clave_super_secreta",
                { expiresIn: "6h" }
            );

            return res.json({
                success: true,
                message: "Inicio de sesión correcto",
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });

        } catch (error) {
            console.log("Error en iniciarSesion:", error);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }
    }

    // =====================================================
    // VERIFICAR USUARIO AUTENTICADO
    // =====================================================
    async verificarUsuario(req, res) {
        try {
            const id = req.params.id;

            const [resultado] = await db.query(
                "SELECT id_usuario, nombre, apellido, correo, rol FROM usuarios WHERE id_usuario = ?",
                [id]
            );

            if (resultado.length === 0) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado" });
            }

            return res.json({ success: true, usuario: resultado[0] });

        } catch (error) {
            console.log("Error en verificarUsuario:", error);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }
    }
}

module.exports = AuthController;