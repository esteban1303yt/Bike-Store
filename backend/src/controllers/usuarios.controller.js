const db = require( "../config/db.js");

class crudController  {

// Obtener todos los usuarios
    async obtenerUsuarios(tabla){
            const [resultado] = await db.query(`SELECT * FROM ${tabla}`);
            return resultado;
        }
        
  // Obtener un registro por ID
  async obtenerUno(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, idCampo, id]);
      return resultado[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo registro
  async crear(tabla, data) {
    try {
      const [resultado] = await db.query(`INSERT INTO ?? SET ?`, [tabla, data]);
      return { ...data, id: resultado.insertId };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un registro por ID
  async actualizar(tabla, idCampo, id, data) {
    try {
      const [resultado] = await db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [tabla, data, idCampo, id]);
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
      const [resultado] = await db.query(`DELETE FROM ?? WHERE ?? = ?`, [tabla, idCampo, id]);
      if (resultado.affectedRows === 0) {
        throw new Error('Registro no encontrado');
      }
      return { message: 'Registro eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
};  
module.exports = crudController;