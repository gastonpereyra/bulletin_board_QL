// Comentarios
const Sequelize = require('sequelize');
// Modelo para Los Comentarios
const model = {
  message: { type: Sequelize.TEXT, allowNull: false, validate: { len:[1,500]} },
};
// Exportar
module.exports = (db) => {
  return db.define('comments', model);
};