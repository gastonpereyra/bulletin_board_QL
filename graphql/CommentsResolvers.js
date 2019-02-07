// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
const {commentOption} = require('./options');

module.exports = {
  // ----- COMMENT
  // ***** Agregar el User a Comment
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  authorComment: (comment) => comment.getUser(),
  // ***** Para Agregar el Post al Commentario* 
  postComment: (comment) => comment.getPost(),
  // ----- QUERIES
  getComments: (root,{userName='', count=-1, offset=0, order='ID_ASC'}, {comments, users, posts}) => {
      return comments.findAll(commentOption(userName, count,offset,order,posts,users))
        .then( commentsList => commentsList); 
    },
  // ----- MUTATIONS
  createComment: (root,{postId, message},{auth, comments}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return comments.create({message, userId: auth, postId}).then( comment => comment );
  },
  editComment: (root, {id,message}, { auth, posts, comments })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return comments.findOne({where: {id: id}}).then( comment => {
        if (comment.userId !== auth) 
          throw new Error("Usuario Incorrecto");
        comment.update({message},{where:{ id: id, userId: auth }});
               
        return comment;
        })
  },
  deleteComment: (root, {id}, { auth, users,comments })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where:{id: auth}})
        .then( user => {
          if (user.role <2) throw new Error("Debe ser Admin")
          return comments.findOne({where:{id: id}})
                  .then(comment => {
                    return comment;
                  })
    })},
}
