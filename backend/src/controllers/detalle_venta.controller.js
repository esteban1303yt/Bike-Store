const db = require('../config/db.js')

class crudController {
  // Obtener un registro por ID
  async obtenerCarrito(req, res) {
    const { id_usuario } = req.params;

    try {
      const [rows] = await db.query(
        `SELECT 
            c.id_carrito,
            c.cantidad,
            p.nombre,
            p.precio,
            p.id_producto
        FROM carrito c
        INNER JOIN productos p ON c.id_producto = p.id_producto
        WHERE c.id_usuario = ?`,
        [id_usuario]
      );

      res.json(rows);

    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  }
};

module.exports = crudController;