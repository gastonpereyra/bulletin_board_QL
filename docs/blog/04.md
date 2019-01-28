# Parte 4
### App Secundaria

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/4th_icon-icons.com_68928.png" width="200">

Decido empezar haciendo los Usuarios, y me parece buena idea hacer un modelo para la DB y hacerlo en los Schemas de GraphQL.

Pero voy a necesitar ir probandolos.

Decido hacer una App secundaria para probar como va a funcionar a grandes rasgos.

## App Secundaria

Entonces empezamos un nuevo proyecto en Glitch.

<img src="https://github.com/gastonpereyra/Apuntes_Glitch/blob/master/imagenes/Glitch_hello_3.png">

Al empezar con este boilerplate ya hay armada una base de datos y una pequeña aplicación. No nos importa, voy a agregar más cosas.

Lo que voy a pretender de esta app es poder usar los query y mutation. Entonces voy a traer las siguientes dependencias:

* express (ya viene)

Para Base de Datos

* sqlite3 (ya viene)
* sequelize -> ORM
* bcryptjs -> encriptar las passwords

Para la API

* graphq
* graphql-import
* apollo-server-express

Para mantener las autenticaciones

* jsonwebtoken -> JWT
* passport
* passport-jwt

## Antes de empezar

Limpió las cosas creadas para la app del boilerplate, que me quede 

```javascript
const express = require('express');

// Express Stuff
var app = express();
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
```

## ENV

En la parte del directorio, hay un archivo que tiene una llave, se llama `.env`, sirve para guardar cosas que no son visibles para nadie excepto con colaboradores. Perfecto para guardar cosas importantes.

Lo voy a usar para guardar la dirección de la Base de Datos, y otras cuestiones de seguridad.

```
JWT_SECRET=
CRYPT_SECRET=
DB_URL=
```

La base de datos en `sqlite:.data/NOMBRE.sqlite`

Para acceder voy a poder hacerlo via `process.env.VARIABLE`

## Directorio

Voy a crear los siguientes archivos para usarlos mas tarde

* Para GraphQL
  * `graphql/schemas.graphql`
  * `graphql/schemas.js`
  * `graphql/resolvers.js`
  
* Para DB
  * `models/users.js`
  * `sequelize.js`
  
* Para Passport
  * `passport.js`
  
 - - - - 
