const db = require("../config/db");

class Productos {
    // ===============================
    // OBTENER TODOS LOS PRODUCTOS
    // ===============================
    async obtenerProductos(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    p.*, 
                    m.nombre_marca
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.id_marca
            `);

            // ✔ Asegurar imagen por defecto si es null
            rows.forEach(p => {
                if (!p.imagen) p.imagen = "default.svg";
            });

            res.json(rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener productos", error });
        }
    }

    // ===============================
    // OBTENER PRODUCTO POR ID
    // ===============================
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

            // ✔ Imagen por defecto
            if (!rows[0].imagen) rows[0].imagen = "default.svg";

            res.json(rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener producto", error });
        }
    }

    // ===============================
    // BUSCAR PRODUCTOS
    // ===============================
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

            // ✔ Imagen por defecto
            rows.forEach(p => {
                if (!p.imagen) p.imagen = "default.svg";
            });

            res.json(rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al buscar productos", error });
        }
    }

    // ===============================
    // CREAR PRODUCTO
    // ===============================
    async crearProducto(req, res) {
        try {
            let { nombre_producto, id_categoria, id_marca, ano, precio, descripcion, stock } = req.body;

            // Validación básica
            if (!ano) {
                return res.status(400).json({ mensaje: "El campo 'ano' es obligatorio" });
            }

            // ✔ Si NO subieron archivo → imagen por defecto
            let imagen = req.file ? req.file.filename : "default.svg";

            const [result] = await db.query(
                `INSERT INTO productos 
                (nombre_producto, id_categoria, id_marca, ano, precio, descripcion, stock, imagen)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre_producto, id_categoria, id_marca, ano, precio, descripcion, stock, imagen]
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

    // ===============================
    // ACTUALIZAR PRODUCTO
    // ===============================
    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;

            const {
                nombre_producto,
                id_categoria,
                id_marca,
                ano,
                precio,
                descripcion,
                stock
            } = req.body;

            // Validación básica
            if (!ano) {
                return res.status(400).json({ mensaje: "El campo 'ano' es obligatorio" });
            }

            // Obtener datos actuales del producto
            const [actual] = await db.query(
                "SELECT imagen FROM productos WHERE id_producto = ?",
                [id]
            );

            if (!actual.length) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            // ✔ Mantener imagen actual si no se sube nueva
            let nuevaImagen = actual[0].imagen || "default.svg";

            // ✔ Si suben nueva imagen → reemplazar
            if (req.file) {
                nuevaImagen = req.file.filename;
            }

            await db.query(
                `UPDATE productos 
                SET nombre_producto = ?, 
                    id_categoria = ?,
                    id_marca = ?,
                    ano = ?,
                    precio = ?, 
                    descripcion = ?, 
                    stock = ?, 
                    imagen = ?
                WHERE id_producto = ?`,
                [
                    nombre_producto,
                    id_categoria,
                    id_marca,
                    ano,
                    precio,
                    descripcion,
                    stock,
                    nuevaImagen,
                    id
                ]
            );

            res.json({ success: true, mensaje: "Producto actualizado correctamente" });

        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ success: false, mensaje: "Error al actualizar producto", error });
        }
    }

    // ===============================
    // ELIMINAR PRODUCTO
    // ===============================
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

    // ===============================
    // OBTENER STOCK DEL PRODUCTO  ✅ NUEVO
    // ===============================
    async obtenerStock(req, res) {
        try {
            const { id } = req.params;

            const [rows] = await db.query(
                "SELECT stock FROM productos WHERE id_producto = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            res.json({ stock: rows[0].stock });

        } catch (error) {
            console.error("Error al obtener stock:", error);
            res.status(500).json({ mensaje: "Error al obtener stock" });
        }
    }
}

module.exports = new Productos();
