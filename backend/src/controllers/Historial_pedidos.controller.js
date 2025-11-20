const db = require("../config/db");

class historialPedidos {
    //Obtener todo el historial de pedidos realizados en la pagina
    async historial(req, res) {
        try {
            const query = `
            SELECT v.id_venta, v.fecha, u.nombre cliente,
        p.nombre_producto, dv.cantidad, dv.monto_total
        FROM detalle_venta dv
        JOIN venta v USING (id_venta)
        JOIN usuarios u USING (id_usuario)
        JOIN productos p USING (id_producto)
        ORDER BY v.fecha DESC;
        `
            const [resultado] = await db.query(query);
            res.json(resultado);
        } catch (error) {
            throw error;
        }
    }

    // obtener el historial por medio del id
    async obtenerhotorialporid(req, res) {
        const [id] = req.params;
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
            const [resultado] = await db.query(db.query, [id]);
            res.json(resultado);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = historialPedidos();