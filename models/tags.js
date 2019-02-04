// Tags
const Sequelize = require('sequelize');
// Modelo para Los Tags
const model = {
  name: { type: Sequelize.STRING, unique: true, allowNull: false },
};

// Exportar
module.exports = (db) => {
  return db.define('tags', model);
};