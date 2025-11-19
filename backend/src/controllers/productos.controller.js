const db = require("../config/db");

class Productos {

    
    // OBTENER TODOS LOS PRODUCTOS
   
    async obtenerProductos(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM productos");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener productos", error });
        }
    }

    
    // OBTENER PRODUCTO POR ID
   
    async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;

            const [rows] = await db.query(
                "SELECT * FROM productos WHERE id_producto = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al obtener producto", error });
        }
    }

    
    // CREAR  UN PRODUCTO
  
    async crearProducto(req, res) {
    try {
        const { nombre_producto, id_categoria, precio, descripcion, stock } = req.body;

        const [result] = await db.query(
            "INSERT INTO productos (nombre_producto, id_categoria, precio, descripcion, stock) VALUES (?, ?, ?, ?, ?)",
            [nombre_producto, id_categoria, precio, descripcion, stock]
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

   
    // ACTUALIZAR PRODUCTO
   
    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const { nombre_producto, id_categoria, precio,  descripcion, stock} = req.body;

            await db.query(
                `UPDATE productos 
                 SET nombre_producto= ?, id_categoria= ?, precio= ?,  descripcion= ?, stock= ?
                 WHERE id_producto = ?`,
                [nombre_producto, id_categoria, precio,  descripcion, stock, id]
            );

            res.json({ mensaje: "Producto actualizado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al actualizar producto", error });
        }
    }

    
    // ELIMINAR PRODUCTO
    
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