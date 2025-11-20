const db = require("../config/db.js");
const bcrypt = require("bcrypt");

class crudController {

  // Obtener todos los usuarios
  async obtenerUsuarios(tabla) {
    const [resultado] = await db.query(`SELECT id_usuario, nombre, apellido, correo, telefono, rol FROM ${tabla}`);
    return resultado;
  }

  // Obtener un registro por ID
  async obtenerUno(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(
        `SELECT id_usuario, nombre, apellido, correo, telefono, rol FROM ?? WHERE ?? = ?`,
        [tabla, idCampo, id]
      );
      return resultado[0];
    } catch (error) {
      throw error;
    }
  }

  // Registrar usuario (cliente por defecto)
  async registrarCliente(data) {
    const { nombre, apellido, correo, clave } = data;
    const rol = "cliente";

    const hashed = await bcrypt.hash(clave, 10);

    const [resultado] = await db.query(
      "INSERT INTO usuarios (nombre, apellido, correo, clave, rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, correo, hashed, rol]
    );

    return { id_usuario: resultado.insertId, nombre, apellido, correo, rol };
  }

  // Registrar administrador
  async registrarAdmin(data) {
    const { nombre, apellido, correo, clave } = data;
    const rol = "administrador";

    const hashed = await bcrypt.hash(clave, 10);

    const [resultado] = await db.query(
      "INSERT INTO usuarios (nombre, apellido, correo, clave, rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, correo, hashed, rol]
    );

    return { id_usuario: resultado.insertId, nombre, apellido, correo, rol };
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

module.exports = crudController;