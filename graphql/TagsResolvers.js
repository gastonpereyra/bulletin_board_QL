// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
const {tagOption} = require('./options');

module.exports = {
  // ----- TAG
  // ***** Para Agregar los Posts del Tag 
  postsTag: (tag) => tag.getPosts(),
  // ----- Query
  // ***** Busco los Tags
  // Count y Offset para la paginación, offset desde donde y count cuantos, Default count: -1 (todos), offset= 0 (desde el principio)
  // Order el orden, default= 'ID_ASC' (ordenado por ID creciente)
  // de Context traigo los modelos de Tags y Posts
  getTags: (root, {count=-1, offset=0, order='ID_ASC', name=''}, {tags, posts}) => {
      return tags.findAll(tagOption(name,count,offset,order,posts))
        .then( tagList => tagList)
    },
  // ***** Encuentra un Tag
  getTag: (root, {id}, {auth, tags}) => {
      return tags.find({ where: {id: id} })
        .then( tag => tag)
    },
}
