// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

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
  likesPost: (post) => post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 )),
  dislikesPost: (post) => post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0)),
  // ----- QUERY
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
  // ----- MUTATIONS
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
    }
}
