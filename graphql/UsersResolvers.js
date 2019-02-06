// Modulo de Sequelize
const Sequelize = require('sequelize');
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
    case 'POST_ASC': return [Sequelize.literal('PostCount'), 'ASC'];
    case 'POST_DESC': return [Sequelize.literal('PostCount'), 'DESC'];
    case 'TITLE_ASC': return ['title','ASC'];
    case 'TITLE_DESC': return ['title','DESC'];
  }
};
// Para crear que atributos necesitos del modelo
const usersAtributes = (order= '') => {
  // Que atributos necesito para devolver, en este caso no quiero devolver el password
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

module.exports = {
  // ***** Para buscar todos los usuarios ****
  // Count y Offset para la paginación, offset desde donde y count cuantos, Default count: -1 (todos), offset= 0 (desde el principio)
  // Order el orden, default= 'ID_ASC' (ordenado por ID creciente)
  // de Context traigo los modelos de Usuaruis y Posts
  getUsers: (root,{count=-1, offset=0, order='ID_ASC', userName=''}, {users, posts}) => {
      return users.findAll({
        // Opciones de la busqueda
        // Atributos que necesito
        attributes: usersAtributes(order),
        limit: count,
        offset: offset,
        // Incluyo los POSTS (join)
        include: [posts],
        where: {userName: { $like: `%${userName}%`}},
        // Como los ordeno
        order: [
          sortResults(order)
        ]
      // Devuelvo el resultado
      }).then( usersList => usersList); 
    },
  // **** Busca UN usuario por ID ****
  getUser: (root, {id}, {users, posts}) => {
      return users.findOne({
        // Opciones de la busqueda
        attributes: usersAtributes(),
        where: {id: id},
        include: [posts]
      // Devuelvo el resultado
      }).then( user => user);
    },
  // **** Busca el Usuario Loggeado ****
  me: (root, args, {auth, users, posts}) => {
    // Si no esta loggeado ERROR
      if (!auth) throw new Error("Debe estar Loggeado");
    // Sino
      return users.findOne({
        // Opciones de la busqueda
        attributes: usersAtributes(),
        where: {id: auth},
        include: [posts]
        // Devuelvo el resultado
        }).then( user => user);
    },
  // **** Chequea si el Nombre de Usuario esta Disponible ****
  isUserName: (root, {userName}, { users }) => {
      return users.find({where: {userName: userName}})
                  .then( res => res !== null );
    },
  // **** Chequea si el Email esta disponible ****
  isEmail: (root, {email}, { users }) => {
      return users.find({where: {email: email}})
                  .then( res => res !== null );
    }
}
