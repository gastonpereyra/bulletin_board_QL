// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

module.exports = {
  // ----- POST
  // ***** Agregar el User a Post
  authorPost: (post) => post.getUser(),
  // ***** Agregar los Tag a Post
  tagsPost: (post) => post.getTags(),
  // ***** Agregar los Comentarios a Post
  commentsPost: (post) => post.getComments(),
  // ***** Agregar los Like/Dislikes a Post
  likesPost: (post) => post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 )),
  dislikesPost: (post) => post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0)),
  
}
