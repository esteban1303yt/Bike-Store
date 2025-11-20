const db = require("../config/db");

class Categorias {
    async obtenerCategorias(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM categorias");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener categorías", error });
        }
    }
}

module.exports = new Categorias();