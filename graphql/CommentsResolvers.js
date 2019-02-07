// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

module.exports = {
  // ----- POST
  // ***** Agregar el User a Post
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  authorComment: (comment) => comment.getUser(),
  // ***** Para Agregar los Posts del usuario **** 
  postComment: (comment) => comment.getPost(),
}
