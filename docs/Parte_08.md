# Parte 8
### Mutation

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/8th_icon-icons.com_68932.png" width="200">

Los Mutation van a ser la parte escencial, van proveer:

* Registro
* Log In
* Actualización -> Solo el mismo Usuario
* Borrar -> Solo Admin
* Cambió de Rol -> Solo Admin

de Usuarios.

La idea es que Registro y Log In devuelvan un JWT que el App Cliente mantenga y lo pasé para poder certificar que es un usuario valido.

## Schemas

En `graphql/schemas.graphql`

```graphql

enum Role {
  USER
  MOD
}

type AuthUser {
  token: String!
  userName: String
}

type Mutation {
  logIn(userName: String!, password: String!): AuthUser
  signIn(input: UserInput!): AuthUser
  updateUser(input: UserInput!): User
  changeRole(userId: ID!, role: Role!): User
  deleteUser(id: ID!): User
}
```

Defino otros Schemas que me van a ayudar uno para poner como Role, que para "afuera" no sea numeros (esto puede cambiar mas adelante).

También uno para que sirva para devolver el JWT.

## Resolvers

En `graphql/resolvers.js`

Primero agrego dependencias

```javascipt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
```

Me van a servir para crear los Tokens, y para comparar las passwords encriptadas.

Luego ademas de los Query agrego:

```javascript
Mutation: {
    logIn: (root, {userName, password}, { auth, users })=> {
      if (auth) throw new Error ("Usted ya esta loggeado.");
      return users.findOne({where: {userName: userName}}).then((user) => {
            const result = bcrypt.compareSync(password, user.password);
            if (!result) throw new Error(); // Si la Clave no coincide tira Error
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET) // Crea el Token
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
          const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET); // Crea el Token
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
                  .then(user => users.findOne({where:{id: auth}})) // Si pudo modificar busca el registro y lo devuelve
                  .catch(err => "Error: "+err);
    },
    changeRole: (root, {userId, role}, { auth, users })=> {
      if (!auth) throw new Error("Debe estar Loggeado");
      return users.findOne({where:{id: auth}}) // Primero busca si el usuario logeado es Admin
                  .then(user => {
                    if (user.role <2) throw new Error("Debe ser Admin");
                    const newRole = role === 'MOD' ? 1 : 0; // Convierte el Role a Intenger
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
    }
  }
```

Funciones de Sequelize que use

* create(OBJETO) -> OBJETO con los campos a guardar
* update(OBJETO, OPCION) -> OBJETO con los campos a actualizar, OPCION de como encontrar al registro (where: ...)
* destroy(OPCION) -> Puede borrar 1 o varios segun como sea la OPCION


Luego creé un Token, no es dificil, solo necesité que queria convertir, y una clave secreta, también podria confiugrar cuando expira no es necesario ahora.

- - - -

