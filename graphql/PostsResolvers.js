// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
const {postOption} = require('./options');

// Función para agregar Tags, siempre devuelvo el Post con los Tags agregados, si los hay
const addTagging = async (tagList, post, tags) => {
  // Si no hay tags para agregar devuelvo el post
  if (tagList.length === 0) return post;
  
  const esperarAgregarTags = await tagList.map( name => {
    // Busco si existe el Tag
    return tags.findOne({where: {name}}).then( 
      // Si existe agrego al Post
      tag => tag ? post.addTags(tag.id).then(() => post) : 
      // Si no existe lo creo y añado al post
      post.createTag({ name }).then(() => post)
    );
  });
  // devuelvo el Post cuando termine de agregar los Tags
  return esperarAgregarTags[esperarAgregarTags.length-1];
};

module.exports = {
  // ----- POST
  // ***** Agregar el User a Post
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  authorPost: (post) => post.getUser(),
  // ***** Agregar los Tag a Post
  tagsPost: (post,args,{posts}) => post.getTags(),
  // ***** Agregar los Comentarios a Post
  commentsPost: (post) => post.getComments(),
  // ***** Agregar los Like/Dislikes a Post
  likesPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ actual ? 1 : 0, 0)),
  dislikesPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ !actual ? 1 : 0, 0)),
  // ----- QUERY
  getPosts: (root, {title='', count=-1, offset=0, order='ID_ASC' }, {auth, users, posts}) => {
      return posts.findAll(postOption(title, count, offset, order, users))
        .then( post => post)
    },
    getPost: (root, {id}, {auth, users, posts}) => {
      return posts.findOne({where: {id: id}})
        .then( post => post)
        .catch(err => new Error(errors.SEARCH_00));
    },
  // ----- MUTATIONS
  createPost: (root,{title,message,tagList=[]},{auth, posts, tags}) => {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    // Creo el post
    return posts.create({title, message, userId: auth.id})
      .then( post => {
        // Si todo sale bien agrego los Tags y finalizado devuelvo el post creado
        return addTagging(tagList, post, tags).then( postConTags => postConTags);
    }).catch(err => new Error(errors.CREATE_00));
  },
  updatePost: (root, {id,title,message,tagList}, { auth, posts,tags })=> {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    return posts.findOne({where: {id: id}}).then( post => {
      if (auth.role > 0 || post.userId === auth.id) { 
        
        return post.update({title, message})
          .then( p => {
            return post.getTags()
              .then( oldTags => {
                oldTags.forEach( oldTag => {
                  if (!tagList.includes(oldTag.name))
                    post.removeTags(oldTag);
                });
                return oldTags;
              }).then( oldTags => {
                return tagList.map( newTag => {
                  if (!p.hasTags({ name: newTag }))
                    return newTag;
                });
                
              }).then( newTags => addTagging(newTags, post, tags).then( newPost => newPost));
          })
          .catch(err => new Error(errors.UPDATE_00));
      }
      throw new Error(errors.UPDATE_01);
      })
  },
  deletePost: (root, {id}, { auth, comments, posts })=> {
      // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    return posts.findOne({where:{id: id}})
      .then( post => {
        if (!post) throw new Error(errors.SEARCH_02);
        if (auth.role > 0 || post.userId === auth.id) { 
          post.getTags()
          .then( oldTags => {
            oldTags.forEach( oldTag => {
              post.removeTags(oldTag);
            });
          });
          comments.destroy({where: {postId: id}});
          post.destroy();
          return post;
        }
        throw new Error(errors.UPDATE_01);
    });  
  },
  
  giveLike: (root,{postId},{auth, likes}) => {
      // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
      return likes.find({where:{ postId: postId, userId: auth.id}})
        .then(isLike => {
        if (isLike) return isLike.destroy().then(() => false);
        return likes.create({postId, like: true, userId: auth.id}).then( () => true)
      });
    },
  giveDislike: (root,{postId},{auth, likes}) => {
      // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    return likes.find({where:{ postId: postId, userId: auth.id}})
      .then(isDislike => {
      if (isDislike) return isDislike.destroy().then(() => false);;
      return likes.create({postId, like: false, userId: auth.id}).then( () => true)
    });
  },
  viewPost: (root, {id}, {auth, posts}) => {
      return posts.findOne({where: {id: id}})
        .then( post => {
          if (!post) throw new Error(errors.SEARCH_02);
          return post.update({views: post.views+1}).then( p => p);
        })
        .catch(err => new Error(errors.SEARCH_00+" "+err));
  },
}
