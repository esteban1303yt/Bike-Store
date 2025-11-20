const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Acceso denegado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ success: false, message: 'Token inválido' });
        req.usuario = usuario; // contiene id_usuario y rol
        next();
    });
}

function autorizarRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
}

module.exports = { autenticarToken, autorizarRoles };