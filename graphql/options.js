// Modulos
const Sequelize = require('sequelize');
const errors = require('./errors');

const Op = Sequelize.Op;

// Para decidir que funcion usar para Ordenar
const sortResults = (order,model) => {
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
      case 'AUTHOR_ASC': return [model, 'userName', 'ASC'];
      case 'AUTHOR_DESC': return [model, 'userName', 'DESC'];
      case 'POSTID_ASC': return [model, 'id', 'ASC'];
      case 'POSTID_DESC': return [model, 'id', 'DESC'];
    }
  };

// Para crear que atributos necesitos del modelo
const usersAtributes = (order= '') => {
    // en este caso no quiero devolver el password
    const attr = [
    'id',
    'userName',
    'email',
    'role',
    'createdAt',
    'updatedAt',
    ]
    // Si busco por Post Agrego columna donde los cuenta
    if (order === 'POST_ASC' || order === 'POST_DESC' ) 
      attr.push([Sequelize.literal('(SELECT COUNT(*) FROM posts WHERE posts.userId = users.id)'), 'PostCount']);
    // Devyuelvo los atributos
    return attr;
  };

const tagsAtributes = (order= '') => {
    const attr = [
      'id',
      'name',
      'createdAt',
      'updatedAt',
    ]
    // Si busco por Post Agrego columna donde los cuenta
    if (order === 'POST_ASC' || order === 'POST_DESC' ) 
      attr.push([Sequelize.literal('(SELECT COUNT(*) FROM posts JOIN tagging on tagging.postId = posts.id WHERE tagging.tagId = tags.id)'), 'PostCount']);
    // Devyuelvo los atributos
    return attr;
  };

module.exports = {
  
  userOption : (userName, role, count, offset, order, posts) => ({
    // Opciones de la busqueda
    // Atributos que necesito
    attributes: usersAtributes(order),
    limit: count,
    offset: offset,
    // Incluyo los POSTS (join) lo necesito para buscar en la base de datos
    include: (order === 'POST_ASC' || order === 'POST_DESC' ) ? [posts] : [],
    where: {
      userName: { $like: `%${userName}%`},
      role: role>-1 ? role : { [Op.gt]: -1 }
    },
    // Como los ordeno
    order: [
      sortResults(order)
    ]
  }),
  tagOption: (name, count, offset, order, posts) => ({
    // Opciones de la busqueda
    // Atributos que necesito
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
  }),
  commentOption: (userName, count, offset, order, posts, users) => ({
    // Opciones de la busqueda
    limit: count,
    offset: offset,
    // Incluyo los POSTS y USER (join) lo necesito para buscar en la base de datos
    include: [posts, {
      model: users,
      where: { userName }
    }],
    // Como los ordeno
    order: [
      sortResults(order, (order === 'POSTID_ASC' || order === 'POSTID_DESC' ) ? posts : users )
    ]
  }),

}
