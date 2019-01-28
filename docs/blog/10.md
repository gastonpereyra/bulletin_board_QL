# Parte 10
### Apollo

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/10th_icon-icons.com_68909.png" width="200">

Entró en la ultilmas partes de lado del Server de esta aplicación secundaria.

## Importar Schemas

Primero en `graphql/schemas.js`

Pasamos los .graphql a información que podamos usar.

```javascript
const { importSchema } = require('graphql-import');

module.exports = importSchema('./graphql/schemas.graphql');
```

Si vieron otros de mis ejemplos es igual, uso `importSchema` para traer el archivo donde escribí los Schemas, y lo exporto para usarlo en el archivo del server.

## Configurar Apollo

<img src="https://apollographql.gallerycdn.vsassets.io/extensions/apollographql/vscode-apollo/1.4.0/1547823995582/Microsoft.VisualStudio.Services.Icons.Default" width="200">

En `Server.js`

voy a necesitar los siguientes modulos

```javascript
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
// DB
const User = require('./sequelize');
// Auth
const pass = require('./passport');
```

Aca traigo no solo los Schemas, Resolvers y el cliente de Apollo sino que además traigo los datos de la Base de Datos y la configuración de Passport

Entonces inicio Passport usando la función que hice en la parte anterior

```javascript
// Cosas de express...

// Passport Config
pass(app, '/graphql', User);
```

Ahora configuro Apollo

```javascript
// API / Apollo Stuff
const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: ( {req}) => ({
    auth: req.user,
    users: User
  })});

server.applyMiddleware({app});
```

La parte de los pasar los Schemas y los resolvers.. es como he hecho antes, lo nuevo viene con el `context`.

* Aca tomo el objeto que viene del Request, y saco la parte que identifico usando Passport y lo paso a `auth`.
* Y en users, conecto la base de datos.

Estos objetos van a viajar y ser compartidos por todos los resolvers, y van ser usados en aquellos que lo necesiten. 
Podria pasar mas cosas, si asi lo necesitara.

De esta manera todas las piezas estan conectadas. En la parte visual en `/graphql/` esta el playground para probar.

- - - 
