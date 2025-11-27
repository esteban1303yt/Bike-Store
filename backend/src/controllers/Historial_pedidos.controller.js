const db = require("../config/db");

class HistorialPedidos {

    //Obtener todo el historial de pedidos realizados en la pagina
    async obtenerTodos() {
        try {
            const query = `
            SELECT 
                v.id_venta, 
                v.fecha, 
                u.nombre AS cliente,
                p.nombre_producto, 
                dv.cantidad, 
                dv.monto_total
            FROM detalle_venta dv
            JOIN venta v USING (id_venta)
            JOIN usuarios u USING (id_usuario)
            JOIN productos p USING (id_producto)
            ORDER BY v.fecha DESC;
        `;
            const [resultado] = await db.query(query);
            return resultado;
        } catch (error) {
            throw error
        }
    }


    // obtener el historial por medio del id


    async obtenerporid(id) {

        try {
            const query = `
       SELECT 
          v.id_venta, v.fecha, u.nombre AS cliente,
          p.nombre_producto, dv.cantidad, dv.monto_total
        FROM detalle_venta dv
        JOIN venta v USING (id_venta)
        JOIN usuarios u USING (id_usuario)
        JOIN productos p USING (id_producto)
        WHERE v.id_venta = ?
        ORDER BY v.fecha DESC;
      `;
            const [resultado] = await db.query(query, [id]);
            return resultado;
        } catch (error) {
            throw error;
        }

    }

    // Eliminar una historia

    async eliminarHistorial(id) {
        try {
            const [resultado] = await db.query(
                "DELETE FROM detalle_venta WHERE id_venta = ?",
                [id]

            );

            if (resultado.affectedRows === 0) {
                return {
                    message: "No hay registro para eliminar"

                };

            }
            return {
                message: "Historial elimiando exitosamente"
            };

        } catch (error) {
            throw error;
        }
    }


}



module.exports = new HistorialPedidos();