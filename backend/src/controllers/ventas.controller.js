const db = require("../config/db");

class VentasController {

    async crearVenta(req, res) {
        const { id_usuario, carrito } = req.body;

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        try {
            // 1. Crear venta
            const [venta] = await db.query(
                "INSERT INTO venta (id_usuario, monto_total) VALUES (?, 0)",
                [id_usuario]
            );

            const id_venta = venta.insertId;
            let monto_total = 0;

            // 2. Procesar cada producto del carrito
            for (const item of carrito) {
                const [producto] = await db.query(
                    "SELECT stock, precio FROM productos WHERE id_producto = ?",
                    [item.id_producto]
                );

                if (producto[0].stock < item.cantidad) {
                    return res.status(400).json({
                        error: `No hay suficiente stock para ${item.nombre}`
                    });
                }

                const subtotal = producto[0].precio * item.cantidad;
                monto_total += subtotal;

                // Insertar detalle venta
                await db.query(`
                    INSERT INTO detalle_venta (id_venta, id_producto, cantidad, monto_total)
                    VALUES (?, ?, ?, ?)
                `, [id_venta, item.id_producto, item.cantidad, subtotal]);

                // 3. Restar stock
                await db.query(`
                    UPDATE productos SET stock = stock - ?
                    WHERE id_producto = ?
                `, [item.cantidad, item.id_producto]);

                // 4. Registrar salida en tabla entradas
                await db.query(`
                    INSERT INTO entradas (id_producto, tipo, cantidad)
                    VALUES (?, 'salida', ?)
                `, [item.id_producto, item.cantidad]);
            }

            // 5. Actualizar monto total venta
            await db.query(
                "UPDATE venta SET monto_total = ? WHERE id_venta = ?",
                [monto_total, id_venta]
            );

            res.json({
                mensaje: "Venta realizada con éxito",
                id_venta,
                monto_total
            });

        } catch (error) {
            console.log("Error creando venta:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    // NUEVO MÉTODO PARA LISTAR VENTAS
    async listarVentas(req, res) {
        try {
            const [ventas] = await db.query(`
                SELECT v.id_venta, u.nombre AS cliente, v.monto_total, v.fecha
                FROM venta v
                JOIN usuarios u ON v.id_usuario = u.id_usuario
                ORDER BY v.fecha DESC
            `);
            res.json(ventas);
        } catch (error) {
            console.log("Error obteniendo ventas:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
}

module.exports = new VentasController();
