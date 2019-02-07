// Modulos
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errors = require('./errors');
const {userOption} = require('./options');

module.exports = {
  // ----- USER
  // ***** Para Agregar los Posts del usuario **** 
  // uso el Root (user) y la función de Sequelize que viene por asociación.
  postsUser: (user) => user.getPosts(),
  // ----- Queries
  // ***** Para buscar todos los usuarios ****
  // Count y Offset para la paginación, offset desde donde y count cuantos, Default count: -1 (todos), offset= 0 (desde el principio)
  // Order el orden, default= 'ID_ASC' (ordenado por ID creciente)
  // de Context traigo los modelos de Usuaruis y Posts
  getUsers: (root,{count=-1, offset=0, order='ID_ASC', userName=''}, {users, posts}) => {
      return users.findAll(userOption(userName, count, offset, order, posts))
        .then( usersList => usersList); 
    },
  // **** Busca UN usuario por ID ****
  getUser: (root, {id}, {users, posts}) => {
      return users.findOne({ where: {id: id} })
        .then( user => user);
    },
  // **** Busca el Usuario Loggeado ****
  me: (root, args, {auth, users, posts}) => {
    // Si no esta loggeado ERROR
      if (!auth) throw new Error(errors.LOG_01);
    // Sino
      return users.findOne({ where: {id: auth} })
        .then( user => user);
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
    },
  // ----- MUTATIONS
  // **** Proceso para Loggearse ****
  logIn: (root, {userName, password}, { auth, users })=> {
    // Si auth existe => ya esta logeado
      if (auth) throw new Error (errors.LOG_02);
    // Sino busco el nombre del usuario
      return users.findOne({where: {userName: userName}}).then((user) => {
        // Si lo encuentra decodifico el password. 
            const result = bcrypt.compareSync(password, user.password);
        // Si falla hay error, lo lanzó. Fin
            if (!result) throw new Error();
        // Sino, creo el Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        // Retorno el objeto.
            return ({
              token,
              userName
            });
        })
      // Si no lo encuentra el Username o el password esta mal
        .catch(error =>  new Error(errors.LOG_03) );
    },
  // **** Registrarse ****
  // Ideal que en el Front se aseguren que el userName o email no existan con isEmail y isUserName
  // Y la longitud de la password y que email sea email.
  signIn: (root, {input}, { auth, users })=> {
    // Si auth existe => ya esta logeado
      if (auth) throw new Error (errors.LOG_02);
    // Sino busco crear el usuario
      return users.create(input)
        .then( newUser => {
        // Si lo crea correctamente emito el token
          const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
          return ({
              token,
              "userName": newUser.userName
            });
        })
      // Si el email o el usuario existen, o password de longitud erronea, o email no es email (u otro error) 
        .catch(err => new Error(errors.SIGN_01));
    },
  // **** Actualiza un User****
  updateUser: (root, {input}, { auth, users })=> {
      if (!auth) throw new Error(errors.LOG_01);
      return users.update(input,{where:{ id: auth }})
                  .then(user => users.findOne({where:{id: auth}}))
                  .catch(err => "Error: "+err);
    },
  // **** Cambia de Rol de un User ****
  changeRole: (root, {userId, role}, { auth, users })=> {
      if (!auth) throw new Error(errors.LOG_01);
      return users.findOne({where:{id: auth}})
                  .then(user => {
                    if (user.role <2) throw new Error("Debe ser Admin");
                    const newRole = role === 'MOD' ? 1 : 0;
                    return users.update({role: newRole},{where:{ id: userId }})
                      .then( () => users.findOne({where:{id: userId}}))
                  })
                  .catch(err => err);
    },
  // **** Borra un User ****
  deleteUser: (root, {id}, { auth, users })=> {
      if (!auth) throw new Error(errors.LOG_01);
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
}
