# Parte 6
### Sequelize

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/6th_icon-icons.com_68933.png" width="200">

Voy a configurar Sequelize para dejarlo listo para ser usado.

## Configurandolo

En `sequelize.js`

```javascript
const Sequelize = require('sequelize');
const userModel = require('./models/users');
// Crear la Base de Datos
const db= new Sequelize(process.env.DB_URL);
// Agregamos el modelo del Usuario
const User = userModel(db);
// Sincronizamos para que agregue las tables si hace falta
db.sync()
  .then(() => {
    console.log('Todas las Tablas Creadas!');
  })
  .catch( error => {
    console.log('Error: '+error);
});
// Exportamos
module.exports = User;
```

Esto va a crear las tablas si hace falta. 

También define le paso la Base de datos a la función que arme antes para definir los Usuarios. Ahora estan conectadas, es eso lo que exporto, si hubiera mas modelos haria algo similar.

## Admin

Una vez creado un Usuario aca puedo usar una linea de código similar a esta para convertirlo en admin

```javascript
User.update({role: 2}, {where:{ id: ID_USUARIO}});
```

Luego que se ejecuta borrarlo.

