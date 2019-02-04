# Parte 7
### Query

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/7th_icon-icons.com_68922.png" width="200">

Los query que voy a necesitar fueron cambiando a medida que los iba pensando y haciendo.

## Basicos

En principio voy a querer

* Buscar Todos los Usuarios
* Buscar Un usuario Por Id
* Buscar Un usuario por username (pensando que alguna vez va a ser util)

Y aunque al principio no lo voy hacer para poder probar que funcione, voy a querer que estos no puedan ser usados sin estar loggeados.

## Otros

Mas tarde se me ocurrieron otros

* Buscar los datos del usuario loggeado
* Checkear si existe el email 
* Checkear si existe el usuario

## Finalmente

En `graphql/schemas.graphql`

```graphql
type Query {
  getUsers: [User]
  getUser(id: ID!): User
  getUserByName(userName: String!): User
  me: User
  isUserName(userName: String): Boolean
  isEmail(email: String): Boolean
  }
```

## Resolvers

Para los resolvers voy a usar la parte de `Context` ya que mediante ese parametro voy a pasar la conexión con la Base de datos y si esta loggeado o no.

En `graphql/resolvers.js`

```javascript
module.exports = {
Query: {
    getUsers: (root,args,{auth,users}) => {
      if (!auth) throw new Error('Debe estar Loggeado.'); // para probar si anda se puede sacar
        return users.findAll()
                    .catch(err => err);
    },
    getUser: (root, {id}, {auth,users}) => {
      if (!auth) throw new Error("Debe estar Loggeado"); // para probar si anda se puede sacar
      return users.findOne({where: {id: id}})
                  .catch(err => err)
    },
    getUserByName: (root, {userName}, {auth,users}) => {
      if (!auth) throw new Error("Debe estar Loggeado"); // para probar si anda se puede sacar
      return users.findOne({where: {userName: userName}})
                  .catch(err => err)
    },
    me: (root, args, {auth, users}) => {
      if (!auth) throw new Error("Debe estar Loggeado"); // para probar si anda se puede sacar
      return users.findOne({where: {id: auth}})
                  .catch(err => err)
    },
    isUserName: (root, {userName}, { users }) => {
      return users.find({where: {userName: userName}})
                  .then( res => !res? false : true)
                  .catch(err => err)
    },
    isEmail: (root, {email}, { users }) => {
      return users.find({where: {email: email}})
                  .then( res => !res? false : true)
                  .catch(err => err)
    }
  }
}
```

En `Context` tengo

* `users`: la tabla de Usuarios de la Base de Datos
* `auth`: es el ID del usuario loggeado.

No es dificil de entender, me parece a mi, uso las funciones de Sequelize

* findAll -> me devuelve todos los registros de una tabla
* findOne(OBJETO) -> el OBJETO son las opciones de busqueda como `where`
* find -> similar al anterior pero me devuelve todos los que encuentra

Todo lo exporto para conectar en el server.

- - - -
