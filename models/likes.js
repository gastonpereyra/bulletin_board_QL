// Likes
const Sequelize = require('sequelize');
// Modelo para Los Likes
const model = {
  like: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
};

// Exportar
module.exports = (db) => {
  return db.define('likes', model);
};
