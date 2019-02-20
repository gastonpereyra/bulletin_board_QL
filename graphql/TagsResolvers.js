// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');
// Opciones para las busquedas
const {tagOption, postOption} = require('./options');

module.exports = {
  // ----- TAG
  // ***** Para Agregar los Posts del Tag 
  postsTag: (tag, // Root
             {count=-1, offset=0, order="CREATED_DESC"}, // Parametros
             {users}) => // Contexto
                tag.getPosts(postOption('', count, offset, order, users)),
  // ***** Para Agregar la cantidad de Posts del Tag
  postsCountTag: (tag) => tag.getPosts().then( posts => posts ? posts.length : 0),
  // ----- Query
  // ***** Busco los Tags
  // Count y Offset para la paginación, offset desde donde y count cuantos, Default count: -1 (todos), offset= 0 (desde el principio)
  // Order el orden, default= 'ID_ASC' (ordenado por ID creciente)
  // de Context traigo los modelos de Tags y Posts
  getTags: (root, {count=-1, offset=0, order='ID_ASC', name=''}, {tags, posts}) => {
      return tags.findAll(tagOption(name,count,offset,order,posts))
        .then( tagList => tagList)
        .catch(err => new Error(errors.SEARCH_00));
  },
  // ***** Encuentra un Tag
  getTag: (root, {id}, {auth, tags}) => {
      return tags.find({ where: {id: id} })
        .then( tag => tag)
        .catch(err => new Error(errors.SEARCH_01));
  },
  // **** Borra un User ****
  deleteTag: (root, {id}, { auth, tags })=> {
    // Debe Estar Loggeado
    if (!auth) throw new Error(errors.LOG_01);
    // Debe ser Admin
    if (auth.role <2) throw new Error(errors.LOG_05);
    // Busco el user a borrar
    return tags.findOne({ where: { id } })
      .then(tag => {
        if (tag.getPosts().length >0)
          throw new Error(errors.NO_EMPTY);
        // Si lo encuentro lo borro
        tag.destroy();
        // devuelvo el borrado
        return tag;
      // Sino tira error
      }).catch(err => new Error(errors.DELETE_00+" "+err));
  },
}
