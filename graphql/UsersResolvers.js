// Modulos
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errors = require('./errors');
// Para agregar opciones en las busquedas
const {userOption, postOption, commentOption} = require('./options');

module.exports = {
  // ----- USER
  // ***** Para Agregar los Posts del usuario
  postsUser: (user, //  root
              {count=-1, offset=0, order='CREATED_DESC'}, // parametros
              {users}) => // context
                  user.getPosts(postOption('', count, offset, order, users)),
  // ***** Para Agregar los Comentarios del usuario
  commentsUser: (user, //  root
                {count=-1, offset=0, order='CREATED_DESC'}, // parametros
                {posts,users}) =>  // context
                  user.getComments(commentOption(count,offset,order,posts,users)),
  // ***** Cantidad de Posts y Comentarios del Usuario
  postsCountUser: (user) => user.getPosts().then( posts => posts ? posts.length : 0),
  commentsCountUser: (user) => user.getComments().then( comments => comments ? comments.length : 0),
  // ----- Queries
  // ***** Para buscar todos los usuarios
  // Count y Offset para la paginación, offset desde donde y count cuantos, Default count: -1 (todos), offset= 0 (desde el principio)
  // Order el orden, default= 'ID_ASC' (ordenado por ID creciente)
  // de Context traigo los modelos de Usuaruis y Posts
  // Si no encuentra devuelve NULL
  getUsers: (root,{count=-1, offset=0, order='USERNAME_ASC', userName='', role=-1}, {users}) => {
      // Convierto los roles de String a Int
      const roleToSearch = role === 'ADMIN' ? 2 : role === 'MOD' ? 1 : role === 'USER' ? 0 : role;
      // Busco los usuarios
      return users.findAll(userOption(userName, roleToSearch, count, offset, order))
        .then( usersList => usersList)
        // Si surge algun problema
        .catch(err => new Error(errors.SEARCH_00));
    },
  // **** Busca UN usuario por ID
  // Si no encuentra devuelve NULL
  getUser: (root, {id}, {users}) => {
      return users.findOne({ where: {id: id} })
        .then( user => user )
        // Si surge algun problema
        .catch(err => new Error(errors.SEARCH_01));
    },
  // **** Busca el Usuario Loggeado
  // Si no encuentra devuelve NULL
  me: (root, args, {auth, users}) => {
    // Si no esta loggeado ERROR
    if (!auth) throw new Error(errors.LOG_01);
    // Sino
    return users.findOne({ where: {id: auth.id} })
      .then( user => user )
      // Si surge algun problema
      .catch(err => new Error(errors.SEARCH_01));
  },
  // **** Chequea si el Nombre de Usuario esta Disponible
  isUserName: (root, {userName}, { users }) => {
      return users.findOne({where: {userName: userName}})
        .then( res => res !== null )
        .catch(err => new Error(errors.SEARCH_00));
    },
  // **** Chequea si el Email esta disponible ****
  isEmail: (root, {email}, { users }) => {
      return users.findOne({where: {email: email}})
        .then( res => res !== null )
        .catch(err => new Error(errors.SEARCH_00));
    },
  // ----- MUTATIONS
  // **** Proceso para Loggearse ****
  logIn: (root, {userName, password}, { auth, users })=> {
    // Si auth existe => ya esta logeado
    if (auth) throw new Error (errors.LOG_02);
    // Contraseña debe ser mayor a 4 caracteres
    if (password.length<4) throw new Error(errors.SIGN_02);
    // Sino busco el nombre del usuario
    return users.findOne({where: {userName: userName}}).then((user) => {
        // Si lo encuentra decodifico el password. 
        const isPass = bcrypt.compareSync(password, user.password);
        // Si falla hay error, lo lanzó. Fin
        if (!isPass) throw new Error();
        // Sino actualizo el ultimo logeo
        return user.update({lastLoginAt: Date.now() }).then ( () => {
          // Creo el Token
          const token = jwt.sign({ id: user.id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
          // Retorno el objeto.
          return ({
            token,
            userName
          });
        });
        
      })
      // Si no lo encuentra el Username o el password esta mal
      .catch(error =>  new Error(errors.LOG_03) );
    },
  // **** Registrarse ****
  // Ideal que en el Front se aseguren que el userName o email no existan con isEmail y isUserName
  // Y chequear la longitud de la password y que email sea email.
  signIn: (root, {input}, { auth, users })=> {
    // Si auth existe => ya esta logeado
    if (auth) throw new Error (errors.LOG_02);
    // Contraseña debe ser mayor a 4 caracteres
    if (input.password.length<4) throw new Error(errors.SIGN_02);
    // Sino busco crear el usuario
    // Primero agrego el ultimo loggeo
    const user= {...input, lastLoginAt: Date.now() };
    // Creo
    return users.create(user)
      .then( newUser => {
      // Si lo crea correctamente emito el token
        const token = jwt.sign({ id: newUser.id, userName: newUser.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return ({
            token,
            "userName": newUser.userName
          });
      })
      // Si el email o el usuario existen, o email no es email (u otro error) 
      .catch(err => new Error(errors.SIGN_01));
  },
  // **** Actualiza un User****
  // Input: nuevos datos del User, y los viejos datos
  // con Auth busca el usuario loggeado, y los viejos datos deben coincidir con el encontrado sino un loggeado quiere modificar otro usuario
  // Devuelve un nuevo token ya que se puede cambiar el usuario y esto va a probocar que falle la autenticación.
  updateUser: (root, {newUser, oldUser}, { auth, users })=> {
    // Si no esta loggeado no se puede hacer esta acción
    if (!auth) throw new Error(errors.LOG_01);
    // Contraseña debe ser mayor a 4 caracteres
    if (newUser.password.length<4) throw new Error(errors.SIGN_02);
    // Busco el user (id del loggeado, datos del user a cambiar, deben ser el mismo)
    return users.findOne({ where: {id: auth.id, userName: oldUser.userName, email: oldUser.email} })
      .then(user => {
        // Chequea que la contraseña este correcta
        const isPass = bcrypt.compareSync(oldUser.password, user.password );
        if (!isPass)
          throw new Error()
        // Si pasa el chequeo, busco actualizar
        return users.update({...newUser,lastLoginAt: Date.now()}, { where: { id: auth.id, userName: oldUser.userName, email: oldUser.email }})
          .then( updatedUser => {
          // Si no encuentra (por alguna razon) tira error
          if (updatedUser[0] === 0) throw new Error();
          // Si actualiza, Crea el nuevo Token
          const token = jwt.sign({ id: auth.id, userName: newUser.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
          // Retorno el objeto.
            return ({
              token,
              userName: newUser.userName
            })
        });
      }).catch(err => new Error(errors.LOG_04+" "+err)); // si al buscar el user no lo encuentra
    },
  // **** Cambia de Rol de un User ****
  changeRole: (root, {userId, role}, { auth, users })=> {
    // Debe Estar Loggeado
    if (!auth) throw new Error(errors.LOG_01);
    // Debe ser Admin
    if (auth.role <2) throw new Error(errors.LOG_05);
    // Convierto a Int el rol (no se puede modificar a ADMIN)
    const newRole = role === 'ADMIN' ? 2 : role === 'MOD' ? 1 : 0;
    if (newRole === 2) throw new Error(errors.UPDATE_01);
    // Busco el user ID sino Error
    return users.findOne({ where: { id: userId } })
      .then(user => {
        // Si lo encuentra cambia el Rol
        user.update({role: newRole})
        // Devuelve el User
        user.role= newRole;
        return user;
      }).catch(err => new Error(errors.LOG_04));
    },
  // **** Borra un User ****
  deleteUser: (root, {id}, { auth, users })=> {
    // Debe Estar Loggeado
    if (!auth) throw new Error(errors.LOG_01);
    // Debe ser Admin
    if (auth.role <2) throw new Error(errors.LOG_05);
    // Busco el user a borrar
    return users.findOne({ where: { id } })
      .then(user => {
        // Si lo encuentro lo borro
        user.destroy();
        // devuelvo el borrado
        return user;
      // Sino tira error
      }).catch(err => new Error(errors.DELETE_00));
    },
}
