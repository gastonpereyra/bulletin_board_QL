// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
const {commentOption} = require('./options');

module.exports = {
  // ----- COMMENT
  // ***** Agregar el User a Comment
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  authorComment: (comment) => comment.getUser(),
  // ***** Para Agregar el Post al Commentario
  postComment: (comment) => comment.getPost(),
  // ----- QUERIES
  getComments: (root,{userName='', count=-1, offset=0, order='ID_ASC'}, {comments, users, posts}) => {
      return comments.findAll(commentOption(userName, count,offset,order,posts,users))
        .then( commentsList => commentsList)
        .catch(err => new Error(errors.SEARCH_00)); 
    },
  // ----- MUTATIONS
  // ***** Para crear los Comentarios
  createComment: (root,{postId, message},{auth, comments}) => {
    // Si no esta Loggeado no puede
    if (!auth) throw new Error(errors.LOG_01);
    // Creo el comentario
    return comments.create({message, userId: auth.id, postId})
      .then( comment => comment )
      // Si hay error
      .catch( err => new Error(errors.CREATE_00));
  },
  // ***** Editar los Comentarios
  editComment: (root, {id, message}, { auth, comments })=> {
    // Si no esta Loggeado no puede
    if (!auth) throw new Error(errors.LOG_01);
    // Busco el comentario
    return comments.findOne({where: {id: id} })
      .then( comment => {
        // Para actualizar debe ser: MOD, ADMIN, o el Autor
        if (auth.role > 1 || comment.userId === auth.id) {
          return comment.update({message})
            .then( updatedComment => updatedComment);
        }  
        // Sino error
        throw new Error(errors.UPDATE_01);
        
        }).catch(err => new Error(errors.UPDATE_00+" "+err));
  },
  // ***** Borrar los Comentarios
  deleteComment: (root, {id}, { auth, users,comments })=> {
    // Si no esta Loggeado no puede
    if (!auth) throw new Error(errors.LOG_01);
    // Busco el Comentario
    return comments.findOne({where: {id: id} })
      .then( comment => {
        // Para Borrar debe ser: MOD, ADMIN, o el Autor
        if (auth.role > 1 || comment.userId === auth.id) {
          comment.destroy();
          return comment;
        }
        // Sino Error
        throw new Error(errors.UPDATE_01);
      }).catch(err => new Error(errors.DELETE_00+" "+err));
  }
}
