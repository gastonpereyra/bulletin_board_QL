// Resolvers
const {postsUser, getUsers, getUser, me, isEmail, isUserName, logIn, signIn, updateUser, changeRole, deleteUser } = require('./UsersResolvers');
const {postsTag, getTags, getTag} = require('./TagsResolvers');
const {authorPost, tagsPost, commentsPost, likesPost, dislikesPost} = require('./PostsResolvers');
const {postComment, authorComment } = require('./CommentsResolvers');
// Listos para Exportar
module.exports = {
  Post: {
    // Para Agregar User a Post
    author: authorPost,
    // Para Agregar Tags a Post
    tags: tagsPost,
    // Para Agregar Comentarios a Post
    comments: commentsPost,
    // Para Agregar Likes a Post
    likes: likesPost,
    // Para Agregar Dislikes a Post
    dislikes: dislikesPost,
  },
  User: {
    // Para Agregar Posts a Users
    posts: postsUser
  },
  Tag: {
    // Para Agregar Posts a Tag
    posts: postsTag
  },
  Comment: {
    // Para Agregar Posts a Tag
    post: postComment,
    // Para Agregar User a Post
    author: authorComment,
  },
  // Queries
  Query: {
    // Users
    getUsers,
    getUser,
    me,
    isUserName,
    isEmail,
    // Post
    getPosts: (root, {count=-1, offset=0}, {auth, users, posts}) => {
      return posts.findAll({
        limit: count,
        offset: offset,
        order: [ ['id', "DESC"] ]
      }).then( results => results.map( post => {
        /*
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));*/
        return post;
        })
      )
    },
    getPost: (root, {id}, {auth, users, posts}) => {
      return posts.findOne({where: {id: id}}).then( post => {
        /*
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));*/
        return post;
        })
    },
    getPostByTitle: (root, {title}, {auth, users, posts}) => {
      return posts.findAll({where: {title: {$like: '%'+title+'%'}}}).then( results => results.map( post => {
        /*
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));
        */
        return post;
        })
      )
    },
    // Tag
    getTags,
    getTag,
  },
  // Modificaciones
  Mutation: {
    logIn,
    signIn,
    updateUser,
    changeRole,
    deleteUser,
    // Post
    createPost: (root,{title,message,tagList},{auth, users, posts, tags}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return posts.create({title, message, userId: auth}).then( post => {
        const tagging= tagList.length === 0 ? null : tagList.map(tag => {
          return tags.findOrCreate({where: {name: tag}})
              .spread( (result,created) => {
                post.addTags(result.get({plain: true}).id);
                return result.get({plain: true})
          });
        });
        post.author= post.getUser();
        post.tags= tagging;
        post.likes= 0;
        post.dislikes= 0;
        return post;
      });
    },
    updatePost: (root, {id,title,message,tagList}, { auth, posts,tags })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return posts.findOne({where: {id: id}}).then( post => {
        if (post.userId !== auth) 
          throw new Error("Usuario Incorrecto");
        posts.update({title, message},{where:{ id: id, userId: auth }});
        post.getTags().then( oldTags => {
          oldTags.forEach( oldTag => {
          if (!tagList.includes(oldTag.name)){
            post.remove(oldTag);
            }
          });
          const tagging= tagList.map( newTag => {
              tags.findOrCreate({where: {name: newTag}})
                .spread( (result,created) => {
                  return post.addTags(result.get({plain: true}).id);
            });
          });
        });
        
        post.tags= post.getTags();
        post.author= post.getUser();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));
        return post;
        })
    },
    deletePost: (root, {id}, { auth, users, posts })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where:{id: auth}})
        .then( user => {
          if (user.role <2) throw new Error("Debe ser Admin")
          return posts.findOne({where:{id: id}})
                  .then(post => {
                    posts.destroy({where:{id: id}});
                    post.author= post.getUser();
                    return post;
                  })
    })},
    // Comment
    postComment: (root,{postId, message},{auth, users, posts, comments}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return comments.create({message, userId: auth, postId}).then( comment => {
        comment.author= comment.getUser();
        comment.post= comment.getPost();
        return comment;
      });
    },
    updatePost: (root, {id,message}, { auth, posts, comments })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return comments.findOne({where: {id: id}}).then( comment => {
        if (comment.userId !== auth) 
          throw new Error("Usuario Incorrecto");
        comment.update({message},{where:{ id: id, userId: auth }});
               
        comment.author= comment.getUser();
        comment.post= comment.getPost();
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
                    comment.author= comment.getUser();
                    comment.post= comment.getPost();
                    return comment;
                  })
    })},
    // Like
    giveLike: (root,{postId},{auth, likes}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return likes.find({where:{ postId: postId, userId: auth}})
        .then(isLike => {
        if (isLike) return likes.destroy({where:{ postId: postId, userId: auth}}).then(() => false);
        return likes.create({postId, like: 'l', userId: auth}).then( () => true)
      });
    },
    giveDislike: (root,{postId},{auth, likes}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return likes.find({where:{ postId: postId, userId: auth}})
        .then(isDislike => {
        if (isDislike) return likes.destroy({where:{ postId: postId, userId: auth}}).then(() => false);;
        return likes.create({postId, like: 'd', userId: auth}).then( () => true)
      });
    },
  }
}
