const db = require("../config/db.js");

class pagosController {

    // Obtener todos los pagos
    async obtenerTodos() {
        const [resultado] = await db.query(`SELECT * FROM venta`);
        return resultado;
    }

    // Obtener por ID
    async obtenerPorId(id) {
        const [resultado] = await db.query(
            `SELECT * FROM venta WHERE id_venta = ?`,
            [id]
        );

        if (resultado.length === 0) {
            return { message: "Pago no encontrado" };
        }

        return resultado[0];
    }

    // Crear venta
    async crearVenta(data) {
        const { id_usuario, monto_total } = data;

        const [resultado] = await db.query(
            `INSERT INTO venta (id_usuario, monto_total) VALUES (?, ?)`,
            [id_usuario, monto_total]
        );

        return {
            message: "Venta creada exitosamente",
            id_venta: resultado.insertId
        };
    }

    // Eliminar venta
    async eliminarVenta(id) {
        const [resultado] = await db.query(
            `DELETE FROM venta WHERE id_venta = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            throw new Error("Venta no encontrada");
        }

        return { message: "Se eliminó correctamente" };
    }
}

module.exports = new pagosController();