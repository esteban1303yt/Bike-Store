const db = require("../config/db");

class Productos {

    // Obtener todos los productos
    async obtenerProductos(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    p.*, 
                    m.nombre_marca
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.id_marca
            `);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener productos", error });
        }
    }

    // Obtener producto por ID
    async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`
                SELECT 
                    p.*,
                    m.nombre_marca
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.id_marca
                WHERE p.id_producto = ?
            `, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener producto", error });
        }
    }

    // Buscar productos por texto (nombre, descripción o marca)
    async buscarProducto(req, res) {
        try {
            const { texto } = req.params;

            const [rows] = await db.query(`
                SELECT p.*, m.nombre_marca
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.id_marca
                WHERE 
                    p.nombre_producto LIKE ? 
                    OR p.descripcion LIKE ?
                    OR m.nombre_marca LIKE ?
            `, [`%${texto}%`, `%${texto}%`, `%${texto}%`]);

            res.json(rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al buscar productos", error });
        }
    }

    // Crear producto
    async crearProducto(req, res) {
        try {
            let { nombre_producto, id_categoria, id_marca, precio, descripcion, stock, imagen } = req.body;

            // Convertir nombre de imagen a minúsculas
            imagen = imagen ? imagen.toLowerCase() : null;

            const [result] = await db.query(
                `INSERT INTO productos 
                (nombre_producto, id_categoria, id_marca, precio, descripcion, stock, imagen)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nombre_producto, id_categoria, id_marca, precio, descripcion, stock, imagen]
            );

            res.json({
                mensaje: "Producto creado",
                id_producto: result.insertId
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al crear producto", error });
        }
    }

    // Actualizar producto
    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const { nombre_producto, precio, descripcion, stock } = req.body;

            await db.query(
                `UPDATE productos 
             SET nombre_producto = ?, precio = ?, descripcion = ?, stock = ?
             WHERE id_producto = ?`,
                [nombre_producto, precio, descripcion, stock, id]
            );

            res.json({ success: true, mensaje: "Producto actualizado correctamente" });

        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ success: false, mensaje: "Error al actualizar producto", error });
        }
    }



    // Eliminar producto
    async eliminarProducto(req, res) {
        try {
            const { id } = req.params;
            await db.query(
                "DELETE FROM productos WHERE id_producto = ?",
                [id]
            );
            res.json({ mensaje: "Producto eliminado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al eliminar producto", error });
        }
    }
}

module.exports = new Productos();