// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

// Para decidir que funcion usar para Ordenar
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
    case 'NAME_ASC': return ['name','ASC'];
    case 'NAME_DESC': return ['name','DESC'];
    case 'POST_ASC': return [Sequelize.literal('PostCount'), 'ASC'];
    case 'POST_DESC': return [Sequelize.literal('PostCount'), 'DESC'];
    case 'TITLE_ASC': return ['title','ASC'];
    case 'TITLE_DESC': return ['title','DESC'];
  }
};

// Para crear que atributos necesitos del modelo
const tagsAtributes = (order= '') => {
  const attr = [
    'id',
    'name',
    'createdAt',
    'updatedAt',
  ]
  // Si busco por Post Agrego columna donde los cuenta
  if (order === 'POST_ASC' || order === 'POST_DESC' ) 
    attr.push([Sequelize.literal('(SELECT COUNT(*) FROM posts WHERE posts.userId = users.id)'), 'PostCount']);
  // Devyuelvo los atributos
  return attr;
  };

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
      return tags.findAll({
        attributes: tagsAtributes(order),
        limit: count,
        offset: offset,
        // Incluyo los POSTS (join) lo necesito para buscar en la base de datos
        include: (order === 'POST_ASC' || order === 'POST_DESC' ) ? [posts] : [],
        where: {name: { $like: `%${name}%`}},
        // Como los ordeno
        order: [
          sortResults(order)
        ]
      }).then( tagList => tagList)
    },
  // ***** Encuentra un Tag
  getTag: (root, {id}, {auth, tags}) => {
      return tags.find({
        where: {id: id}
      }).then( tag => tag)
    },
}
