# Parte 5
## Usuarios

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/5th_icon-icons.com_68918.png" width="200">

Todo lo que haga en la App Secundaria puedo usarlo para la principal, por eso lo hago. 

Antes habia hecho unos esquemas de lo que creia que iba a necesitar. Lo voy a usar.

Por ahora la parte de las relaciónes con los otros elementos no voy a usarlo asi que lo dejó afuera.

## GraphQL

En `graphql/schemas.graphql`

```graphql
type User {
  id: Int
  userName: String
  email: String
  password: String
  role: Int
  createdAt: String
  updatedAt: String
}

input UserInput {
  userName: String
  email: String
  password: String
}
```

Los tipo `input` los voy a usar para los Mutations a la hora de crear nuevos usuarios. `role` no lo pongo para que solo pueda ser cambiado por alguien con privilegios.

## Sequelize

En `models/users.js`

```javascript
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
// Modelo para Los Usuarios
const model = {
  userName: { type: Sequelize.STRING, unique: true, allowNull: false },
  email: { type: Sequelize.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  role: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, max: 2 } },
  password: { type: Sequelize.INTEGER, allowNull: false, validate: { len: [4,16] } }
};
// Hooks
const hooks = {
  hooks: {
    afterValidate: (user) => {
      user.password= bcrypt.hashSync(user.password, parseInt(process.env.CRYPT_SECRET));
    }
  }
};
// Exportar
module.exports = (db) => {
  return db.define('users', model, hooks);
};
```

Sequelize va a agregar `id`, `createdAt` y `updatedAt` y se va a encargar de eso.

Adicionalmente `role` tiene un valor por default, mi idea es que los roles solo puedan ser modificados por el Admin, que a su vez solo puede obtener dicho rol insertados a mano. Y pienso que sea un Integer para hacer cosas como "si role es menor a 2" pasa tal cosa, podría ser de otra manera, se me ocurrio asi.

Voy a necesitar que la Password este encriptada por eso traje a `bcryptjs` y lo uso en los hooks. 

Finalmente lo exporto para usarlo mas adelante. Pero exporto una función que recibe la referencia a la base de datos, y recién cuando se ejecuta la función se define termina de definir usuario. A futuro con Posts, Comments y Tags voy a usar algo parecido.

- - - -
