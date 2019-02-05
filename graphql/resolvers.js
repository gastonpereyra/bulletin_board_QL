const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {getUsers} = require('./UsersResolvers');

module.exports = {
  Query: {
    // Users
    getUsers,
    getUser: (root, {id}, {auth,users}) => {
      return users.findOne({where: {id: id}}).then( user => {
        user.posts = user.getPosts();
        return user;
      });
    },
    getUserByName: (root, {userName}, {auth,users}) => {
      return users.findOne({where: {userName: userName}}).then( user => {
        user.posts = user.getPosts();
        return user;
      });
    },
    me: (root, args, {auth, users}) => {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where: {id: auth}}).then( user => {
        user.posts = user.getPosts();
        return user;
      });
    },
    isUserName: (root, {userName}, { users }) => {
      return users.find({where: {userName: userName}})
                  .then( res => !res? false : true);
    },
    isEmail: (root, {email}, { users }) => {
      return users.find({where: {email: email}})
                  .then( res => !res? false : true);
    },
    // Post
    getPosts: (root, {count=-1, offset=0}, {auth, users, posts}) => {
      return posts.findAll({
        limit: count,
        offset: offset,
        order: [ ['id', "DESC"] ]
      }).then( results => results.map( post => {
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));
        return post;
        })
      )
    },
    getPost: (root, {id}, {auth, users, posts}) => {
      return posts.findOne({where: {id: id}}).then( post => {
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));
        return post;
        })
    },
    getPostByTitle: (root, {title}, {auth, users, posts}) => {
      return posts.findAll({where: {title: {$like: '%'+title+'%'}}}).then( results => results.map( post => {
        post.author= post.getUser();
        post.tags= post.getTags();
        post.comments= post.getComments();
        post.likes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'l' ? 1 : 0, 0 ));
        post.dislikes = post.getLikes().then( like => like.reduce( (total,val) => total += val.like === 'd' ? 1 : 0, 0));
        return post;
        })
      )
    },
    // Tag
    getTags: (root, args, {auth, tags}) => {
      return tags.findAll().then( results => results.map( tag => {
        tag.posts = tag.getPosts();
        return tag
      }))
    },
    getTag: (root, {id}, {auth, tags}) => {
      return tags.find({where: {id: id}}).then( tag => {
        tag.posts = tag.getPosts();
        return tag
      })
    },
    getTagByName: (root, {name}, {auth, tags}) => {
      return tags.findAll({where: {name: {$like: '%'+name+'%'}}}).then( results => results.map( tag => {
        tag.posts = tag.getPosts();
        return tag
      }))
    },
  },
  Mutation: {
    logIn: (root, {userName, password}, { auth, users })=> {
      if (auth) throw new Error ("Usted ya esta loggeado.");
      return users.findOne({where: {userName: userName}}).then((user) => {
            const result = bcrypt.compareSync(password, user.password);
            if (!result) throw new Error();
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            return ({
              token,
              "userName": user.userName
            });
        })
        .catch(error =>  new Error("Usuario o Password Incorrectos.") );
    },
    signIn: (root, {input}, { auth, users })=> {
      if (auth) throw new Error ("Usted ya esta loggeado.");

      return users.create(input)
        .then( newUser => {
          const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
          return ({
              token,
              "userName": newUser.userName
            });
        })
        .catch(err => new Error('No se pudo Crear Usuario, '+err));
    },
    updateUser: (root, {input}, { auth, users })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.update(input,{where:{ id: auth }})
                  .then(user => users.findOne({where:{id: auth}}))
                  .catch(err => "Error: "+err);
    },
    changeRole: (root, {userId, role}, { auth, users })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where:{id: auth}})
                  .then(user => {
                    if (user.role <2) throw new Error("Debe ser Admin");
                    const newRole = role === 'MOD' ? 1 : 0;
                    return users.update({role: newRole},{where:{ id: userId }})
                      .then( () => users.findOne({where:{id: userId}}))
                  })
                  .catch(err => err);
    },
    deleteUser: (root, {id}, { auth, users })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where:{id: auth}})
                  .then(user => {
                    if (user.role <2) throw new Error("Debe ser Admin")
                    return users.findOne({where:{ id: id }})
                            .then( u => users.destroy({where:{ id: id }})
                                    .then( () => u)
                            );
                  })
                  .catch(err =>  new Error("Error: "+err));
    },
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
