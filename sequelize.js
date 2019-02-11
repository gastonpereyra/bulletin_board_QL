const Sequelize = require('sequelize');
const userModel = require('./models/users');
const postModel = require('./models/posts');
const commentModel = require('./models/comments');
const tagModel = require('./models/tags');
const likeModel = require('./models/likes');
// Crear la Base de Datos
const db= new Sequelize(process.env.DB_URL);
// Agregamos los modelos
const User = userModel(db);
const Post = postModel(db);
const Comment = commentModel(db);
const Tag = tagModel(db);
const Like = likeModel(db);
// Asociaciones
User.hasMany(Post);
User.hasMany(Comment);
Post.belongsTo(User);
Post.hasMany(Comment);
Post.hasMany(Like);
Post.belongsToMany(Tag, {through: 'tagging' });
Tag.belongsToMany(Post, {through: 'tagging' });
Like.belongsTo(User);
Like.belongsTo(Post);
Comment.belongsTo(User);
Comment.belongsTo(Post);


// Sincronizamos para que agregue las tables si hace falta
db.sync()
  .then(() => {
    console.log('Todas las Tablas Creadas!');
  })
  .catch( error => {
    console.log('Error: '+error);
});
// Exportamos
module.exports = {
  User,
  Post,
  Comment,
  Tag,
  Like
};

