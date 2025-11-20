const db = require("../config/db");

class Marcas {
    async obtenerMarcas(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM marcas");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener marcas", error });
        }
    }
}

module.exports = new Marcas();