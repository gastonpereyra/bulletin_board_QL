// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

const addTagging = (tagList, post, tags) => {
  tagList.forEach( name => {
    tags.findOne({where: {name}}).then( 
      tag => tag ? post.addTags(tag.id) : 
      tags.create({ name }).then( ntag => post.addTags(ntag.id))
    );
  });
};

module.exports = {
  // ----- POST
  // ***** Agregar el User a Post
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  authorPost: (post) => post.getUser(),
  // ***** Agregar los Tag a Post
  tagsPost: (post) => post.getTags(),
  // ***** Agregar los Comentarios a Post
  commentsPost: (post) => post.getComments(),
  // ***** Agregar los Like/Dislikes a Post
  likesPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ actual ? 1 : 0, 0)),
  dislikesPost: (post) => post.getLikes().then( likeList => likeList.reduce( (total, actual) => total+ !actual ? 1 : 0, 0)),
  // ----- QUERY
  getPosts: (root, {title='', minLikes=0, minDislikes=0, count=-1, offset=0, order='ID_ASC' }, {auth, users, posts, likes}) => {
      return posts.findAll({
        limit: count,
        offset: offset,
        // order: [ [likes, "likeCount"] ]
      }).then( results => results.map( post => {
        return post;
        })
      )
    },
    getPost: (root, {id}, {auth, users, posts}) => {
      return posts.findOne({where: {id: id}})
        .then( post => post)
        .catch(err => new Error(errors.SEARCH_00));
    },
    getPostByTitle: (root, {title}, {auth, users, posts}) => {
      return posts.findAll({where: {title: {$like: '%'+title+'%'}}}).then( results => results.map( post => {
        return post;
        })
      )
    },
  // ----- MUTATIONS
  createPost: (root,{title,message,tagList=[]},{auth, posts, tags}) => {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    return posts.create({title, message, userId: auth.id})
      .then( post => {
        addTagging(tagList, post, tags);
        return post
    }).catch(err => new Error(errors.CREATE_00));
  },
  updatePost: (root, {id,title,message,tagList}, { auth, posts,tags })=> {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    return posts.findOne({where: {id: id}}).then( post => {
      if (auth.role > 0 || post.userId === auth.id) { 
        
        post.getTags()
          .then( oldTags => {
            oldTags.forEach( oldTag => {
              if (!tagList.includes(oldTag.name))
                post.removeTags(oldTag);
            });
            return oldTags;
          }).then( oldTags => {
            const newTags = tagList.map( newTag => {
              if (!oldTags.includes(newTag.name))
                return newTag;
            });
            addTagging(newTags, post, tags);
        });
        return post.update({title, message}).catch(err => new Error(errors.UPDATE_00));
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
