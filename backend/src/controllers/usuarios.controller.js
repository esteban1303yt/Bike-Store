const db = require("../config/db.js");
const bcrypt = require("bcrypt");

class crudController {

  // Obtener todos los usuarios
  async obtenerUsuarios(tabla) {
    const [resultado] = await db.query(
      `SELECT id_usuario, nombre, apellido, correo, telefono, rol FROM ${tabla}`
    );
    return resultado;
  }

  // Obtener un registro por ID
  async obtenerUno(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(
        `SELECT id_usuario, nombre, apellido, correo, telefono, rol FROM ?? WHERE ?? = ?`,
        [tabla, idCampo, id]
      );

      if (resultado.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return resultado[0];
    } catch (error) {
      throw error;
    }
  }

  // Registrar usuario (cliente por defecto)
  async registrarCliente(data) {
    const { nombre, apellido, correo, clave, telefono } = data;
    const rol = "cliente";

    const hashed = await bcrypt.hash(clave, 10);

    const [resultado] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, correo, clave, telefono, rol)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hashed, telefono, rol]
    );

    return { id_usuario: resultado.insertId, nombre, apellido, correo, telefono, rol };
  }

  // Registrar administrador
  async registrarAdmin(data) {
    const { nombre, apellido, correo, clave, telefono } = data;
    const rol = "administrador";

    const hashed = await bcrypt.hash(clave, 10);

    const [resultado] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, correo, clave, telefono, rol)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hashed, telefono, rol]
    );

    return { id_usuario: resultado.insertId, nombre, apellido, correo, telefono, rol };
  }

  // Actualizar un registro por ID
  async actualizar(tabla, idCampo, id, data) {

    // Si viene clave → encriptarla antes de actualizar
    if (data.clave) {
      data.clave = await bcrypt.hash(data.clave, 10);
    }

    try {
      const [resultado] = await db.query(
        `UPDATE ?? SET ? WHERE ?? = ?`,
        [tabla, data, idCampo, id]
      );

      if (resultado.affectedRows === 0) {
        throw new Error('Registro no encontrado');
      }

      return await this.obtenerUno(tabla, idCampo, id);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un registro por ID
  async eliminar(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(
        `DELETE FROM ?? WHERE ?? = ?`,
        [tabla, idCampo, id]
      );

      if (resultado.affectedRows === 0) {
        throw new Error('Registro no encontrado');
      }

      return { message: 'Registro eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}


/* SECCIÓN DE AJUSTES */

// ==========================
// ACTUALIZAR CORREO
// ==========================
exports.actualizarCorreo = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        const { nuevoCorreo } = req.body;

        const sql = "UPDATE usuarios SET correo = ? WHERE id_usuario = ?";
        await db.query(sql, [nuevoCorreo, id_usuario]);

        res.json({ mensaje: "Correo actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


// ==========================
// ACTUALIZAR CONTRASEÑA
// ==========================
exports.actualizarPassword = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        const { claveActual, nuevaClave } = req.body;

        // 1. Obtener contraseña actual
        const [rows] = await db.query(
            "SELECT clave FROM usuarios WHERE id_usuario = ?",
            [id_usuario]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const claveBD = rows[0].clave;

        // 2. Comparar contraseña actual con hash
        const esValida = await bcrypt.compare(claveActual, claveBD);

        if (!esValida) {
            return res.status(400).json({ error: "La contraseña actual no es correcta" });
        }

        // 3. Hashear nueva contraseña
        const hash = await bcrypt.hash(nuevaClave, 10);

        await db.query(
            "UPDATE usuarios SET clave = ? WHERE id_usuario = ?",
            [hash, id_usuario]
        );

        res.json({ mensaje: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


// ============================================
// EXPORTACIÓN (ÚNICO CAMBIO REALIZADO)
// ============================================
module.exports = {
  crudController,
  ...exports
};
