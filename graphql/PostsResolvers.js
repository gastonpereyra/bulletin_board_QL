// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
// Opciones para las busquedas
const {postOption, tagOption, commentOption, likeOption} = require('./options');

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
  // ***** Agregar los Tag a Post, ordenados por el ID
  tagsPost: (post, // Root
             {count=-1, offset=0, order='ID_ASC'},  // Parametro
             { posts }) => // Contexto
                post.getTags(tagOption('',count,offset,order,posts)),
  // ***** Agregar los Comentarios a Post, ordenados por el mas nuevo primero
  commentsPost: (post, // Root
                {count=-1, offset=0, order='CREATED_DESC'}, // Parametro
                {posts, users}) => // Contexto
                  post.getComments(commentOption(count,offset,order,posts,users)),
  // ***** Agregar los Like/Dislikes a Post
  likesPost: (post, // Root
             {userId= -1,count=-1,offset=0}) => 
                post.getLikes(likeOption(userId,count,offset)),
  // ***** Agregar el numero total de comentarios, likes, dislikes
  commentsCountPost: (post) => post.getComments().then(comments => comments ? comments.length : 0),
  likesCountPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ (actual.like ? 1 : 0), 0)),
  dislikesCountPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ (actual.like ? 0 : 1), 0)),
  // ----- QUERY
  getPosts: (root, {title='', count=-1, offset=0, order='CREATED_DESC' }, {auth, users, posts}) => {
      return posts.findAndCountAll(postOption(title, count, offset, order, users))
        .then( list => ({
          count: list.count,
          posts: list.rows
        }))
    },
  getPost: (root, {id}, {auth, users, posts}) => {
      return posts.findOne({where: {id: id}})
        .then( post => post)
        .catch(err => new Error(errors.SEARCH_00));
    },
  // ----- MUTATIONS
  // ***** Crear Posts
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
  // ***** Actualizar los Posts (lo que se quiera mantener debe ser pasado como como nuevo
  updatePost: (root, {id,title,message,tagList}, { auth, posts,tags })=> {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    // Busco si existe el post
    return posts.findOne({where: {id: id}}).then( post => {
      // Si es el autor o esta autorizado
      if (auth.role > 0 || post.userId === auth.id) { 
        // Actualiza
        return post.update({title, message})
          .then( p => post.getTags() // obtengo los Tags viejos
            .then( oldTags => {
                // Si no estan entre los nuevos, los borro y me quedo con los que estan en la Lista de Tags
                return oldTags.filter( oldTag => {
                  if (!tagList.includes(oldTag.name)) {
                    post.removeTags(oldTag);
                    return false;
                  } else return true;
                });
              }).then( oldTags => {
                // Filtro entre la lista de Tags los que ya estan agregados, y paso los nuevos
                return tagList.filter( name => !oldTags.includes({ name })
                );
              // Agrego los nuevos tags y devuelvo el post actualizado
              }).then( newTags => addTagging(newTags, post, tags).then( newPost => newPost))
          // Si hay problemas con la actualización
          ).catch(err => new Error(errors.UPDATE_00));
      }
      // Si no esta autorizado error
      throw new Error(errors.UPDATE_01);
      })
  },
  // ***** Borrar un Post (borra los comentarios al post)
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
  // ***** Agregar 1 Like al post
  giveLike: (root,{postId},{auth, likes}) => {
      // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    // Busco si ya le dieron Like/Dislike
    return likes.find({where:{ postId: postId, userId: auth.id}})
        .then(isLike => {
        // Si encuentro
        if (isLike) {
          // Si es un Dislike, convierto en Like
          if (!isLike.like) return isLike.update({ like: true }).then( () => true);
          // Si es un like, lo borro
          else return isLike.destroy().then(() => false);
        }
      // Si no lo encuentro lo agrego
        return likes.create({postId, like: true, userId: auth.id}).then( () => true)
      });
    },
  // ***** Agregar 1 dislike al post
  giveDislike: (root,{postId},{auth, likes}) => {
      // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    // Busco si ya le dieron DisLike/Like
    return likes.find({where:{ postId: postId, userId: auth.id}})
      .then(isDislike => {
      // Si encuentro
      if (isDislike) {
        // Si es un like, convierto en DisLike
        if (isDislike.like) return isDislike.update({ like: false }).then( () => true);
        // Si es un Dislike, lo borro
        else return isDislike.destroy().then(() => false);
      }
      // Si no lo encuentro lo agrego
      return likes.create({postId, like: false, userId: auth.id}).then( () => true)
    });
  },
  // ***** Visita un Post
  viewPost: (root, {id}, {auth, posts}) => {
      return posts.findOne({where: {id: id}})
        .then( post => {
          if (!post) throw new Error(errors.SEARCH_02);
          // Devuelvo el post con una visita mas agregada
          return post.update({views: post.views+1}).then( p => p);
        })
        .catch(err => new Error(errors.SEARCH_00+" "+err));
  },
}
