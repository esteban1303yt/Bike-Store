const db = require("../config/db.js");

class ProductosController {

    async obtenerProductos(req, res) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    p.id_producto,
                    p.nombre_producto,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria`
            );
            res.json(rows);

        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }
}

module.exports = new ProductosController();