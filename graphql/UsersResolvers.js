const Sequelize = require('sequelize');

function sortResults(order,model) {
  switch(order) {
    case 'ID_ASC': return ['id','ASC'];
    case 'ID_DESC': return ['id','DESC'];
    case 'CREATED_ASC' : return ['createdAt','ASC'];
    case 'CREATED_DESC' : return ['createdAt','DESC'];
    case 'UPDATED_ASC' : return ['updatedAt','ASC'];
    case 'UPDATED_DESC' : return ['updatedAt','DESC'];
    case 'USERNAME_ASC': return ['userName','ASC'];
    case 'USERNAME_DESC': return ['userName','DESC'];
    case 'POST_ASC': return [model,'id','ASC'];
    case 'POST_DESC': return [model,'count(id)','DESC'];
    case 'TITLE_ASC': return ['title','ASC'];
    case 'TITLE_DESC': return ['title','DESC'];
  }
};

module.exports = {
  getUsers: (root,{count=-1, offset=0, order='ID_ASC'},{auth,users, posts}) => {
      return users.findAll({
        limit: count,
        offset: offset,
        include: [posts],
        order: [
          sortResults(order)
        ]
      }).then( usersList => {
        return usersList.map( user => {
          user.posts = user.getPosts();
          return user;
        })
      });
    },
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
}
