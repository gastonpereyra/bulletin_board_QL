# Parte 12
### Extendiendo

<img src="" width="200">

Lo que hice en con los usuarios lo voy a repetir para los demás modelos, cada uno con sus particularidades pero va a ser la base.

## Remix

Lo primero que voy a hacer es hacerle un remix a la app que terminé de desarrollar, y asi ya no tengo que repetir muchos de los pasos.

## Directorio

- En `/graphql/`, solo voy a modificar `schemas.graphql`, asi que no hay archivos que agregar.
- En `/models/`, agregó: `posts.js`, `tags.js`, `comments.js`, `likes.js`
- `sequelize.js` y `server.js` los voy a modificar mas adelante.

## Pasos a seguir

1. Agregar los Schemas en Graphql
2. Armar los modelos de Sequelize
3. Armar las asociaciones de Sequelize
4. Agregar objetos al context de Graphql
5. Armar los Resolvers

- - - -


