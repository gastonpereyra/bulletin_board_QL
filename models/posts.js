// Posts
const Sequelize = require('sequelize');
// Modelo para Los Posts
const model = {
  title: { type: Sequelize.TEXT, allowNull: false, validate: { len:[1,50]} },
  message: { type: Sequelize.TEXT, allowNull: false, validate: { len:[1,1500]} },
  views: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
};
// Exportar
module.exports = (db) => {
  return db.define('posts', model);
};
