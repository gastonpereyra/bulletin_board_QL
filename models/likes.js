// Likes
const Sequelize = require('sequelize');
// Modelo para Los Likes
const model = {
  like: { type: Sequelize.STRING, allowNull: false, validate:{is: /[ld]/i}, len:[1] },
};

// Exportar
module.exports = (db) => {
  return db.define('likes', model);
};