Bulletin Board Server
=================

Servidor con la API del Tablón de Anuncios.

UI del Tablón de Anuncios: **PROXIMAMENTE**.

<img src="https://cdn.glitch.com/beff46ab-c8a9-4e97-8811-1fe113d14bbc%2FBB.jpg?1550257125393" width="900">

- - - -

## Contenido

**Table of Contents**

+ Versión
+ EndPoint
+ JWT
+ Usuarios
  * Registro
  * Ingresar
  * Actualizar
  * Niveles de Usuarios
  * Borrar un Usuario
+ Busqueda de Usuarios
  * Por ID
  * Usuario Identificado
  * Varios Usuarios
  * Nombre de Usuario Habilitado
  * Email Habilitado
+ Posts
  * Crear
  * Editar
  * Borrar
  * Visitar Post
  * Me Gusta
  * No Me Gusta
+ Busqueda de Posts
  * Por ID
  * Varios Posts
+ Tags
  * Buscar por ID
  * Buscar varios
  * Borrar Tags
+ Comentarios
  * Crear
  * Editar
  * Borrar
  * Buscar varios
+ Hecho Con
- - - -

## Versión

Versión numero: *1.0.0*

Cuenta con:

* Sistema de Identificación de Usuarios
* Niveles o Roles de Usuarios
* Creación de Posts
* Etiquetado de Posts con Tags
* Creación de Comentarios en los Posts
* Busqueda de Usuarios, ordenamiento y filtros.
* Busqueda de Posts, ordenamientos y filtros.
* Busqueda de Tags, ordenamientos y filtros.
* Busqueda de Comentarios, ordenamientos.

- - - -

## Endpoint

API construida en *Graphql* con *Apollo*.

Endpoint: `https://bullentin-board-ql.glitch.me/graphql`

- - - -

## JWT

Para mantener las sesiones se usa *Json Web Tokens*.

Estos duran 1 hora.

Al registrarse se recibe, también al actualizar los datos de Usuarios, y por supuesto para al Ingresar.

Se utiliza para poder realizar algunas acciones como:

* Crear/Editar Posts
* Crear/Editar Comentarios

Para utilizarlo basta con pasar en el Header del request:

```
{
  "Authorization" : "Bearer AQUI-EL-TOKEN"
}
```

Ejemplo:

```
{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlck5hbWUiOiJHYXN0b24iLCJpYXQiOjE1NDk4MzMyMzksImV4cCI6MTU0OTgzNjgzOX0.yEBd02cIiOlohJhGEpvm4iHKp5R33Izk-6m2MD5kNeQ"
}
```

- - - -
## Usuario

Los usuarios tienen los siguientes atributos:

* `id: Int` : ID asignado por el sistema al registrarse.
* `userName: String` : Nombre de Usuario, debe ser Unico
* `email: String` : Email del Usuario, debe ser Unico
* `role: Int`, Nivel o Rol de Usuario, 2= Administador, 1= moderador, 0= Usuario
* `image: String`: URL de una imagen del usuario.
* `createdAt: String` : UNIX (ms), fecha de la creación
* `updatedAt: String` : UNIX (ms), fecha de la ultima actualización
* `lastLoginAt: String` : UNIX (ms), fecha del ultimo ingreso
* `postsCount: Int` : Cantidad de Posts
* `commentsCount: Int`: Cantidad de Comentarios
* `posts(count: Int, offset: Int, order: PostOrder): [Post]`: Posts del Usuario
* `comments(count: Int, offset: Int, order: CommentOrder): [Comment]`: Comentarios del Usuario

Adicionalmente se necesitará un `password` tanto para registrarse, ingresar como actualizar.

Pueden **Ordenarse** por:

* ID : `ID_ASC` y `ID_DESC` 
* Nombre de Usuario: `USERNAME_ASC` y `USERNAME_DESC`
* Creación: `CREATED_ASC` y `CREATED_DESC`
* Ultima Actualización: `UPDATED_ASC` y `UPDATED_DESC`
* Cantidad de Posts: `POSTS_ASC` y `POSTS_DESC`
* Cantidad de Comentarios: `COMMENTS_ASC` y `COMMENTS_DESC`

### Registrate

`signIn(input: {userName: String, password: String, email: String, image: String})`

**Obligatorio** : `userName`, `password` (minimo 4 caracteres), `email`

**Opcional** : `image` (url)

Genera un Token que se puede usar para mantener la sesión durante una hora.

Si ya ingreso (osea esta usando el Token) no puede usarse.

Ejemplo:

```graphql
mutation {
signIn(input:{userName:"Ejemplo", password:"abc123", email:"ejemplo@falsa.com"}) {
  token
  userName
  }
}
```

### Ingresar

`logIn(userName: String, password: String)`

**Obligatorio** : `userName`, `password` (minimo 4 caracteres)

Genera un Token que se puede usar para mantener la sesión durante una hora.

Si ya ingreso (osea esta usando el Token) no puede usarse.

Ejemplo

```graphql
mutation {
logIn(userName:"Ejemplo", password:"abc123") {
  token
  userName
  }
}
```

### Actualizar

`updateUser(newUser: {userName: String, password: String, email: String, image: String}, oldUser: {userName: String, password: String, email: String, image: String})`

Necesita haber Ingresado previamente

+ *oldUser* : Datos anteriores del Usuario. El `password` debe ser correcto.
+ *newUser* : Datos del Usuario a cambiar. Si no se quiere cambiar un campo, poner lo mismo que en *oldUser*

**Obligatorio** : `userName`, `password` (minimo 4 caracteres), `email`

**Opcional** : `image` (url)

Genera un Token que se puede usar para mantener la sesión durante una hora y Actualiza el Usuario.

```graphql
mutation {
updateUser( newUser:{userName: "UnEjemplo", password: "123abc", email:"ejemplo@muyfalsa.com"}, oldUser:{userName: "Ejemplo", password: "abc123", email:"ejemplo@falsa.com"}) {
    token
    userName
  }
}
```

### Niveles de Usuario

Existen 3 niveles de Usuarios

* `ADMIN` (2) : Administador
* `MOD` (1) : Moderador
* `USER` (0) : Usuario común.

Solo pueden cambiarse por un Administador

`changeRole(userId: Int, role: Role)`

**Obligatorio** : `userId`, `role`

Devuelve los datos del usuario modificado

Ejemplo

```graphql
mutation {
  changeRole(userId:2, role: MOD) {
    id
    userName
    # más atributos de Usuario
    role
  }
}
```
### Borrar un usuario

Solo un `ADMIN` puede borrarlo. Sus Posts y Comentarios no se pierden

`deleteUser(id: ID)`

**OBLIGATORIO**: `id` (ID del usuario a borrar)

Devuelve los datos del usuario Borrado

Ejemplo

```graphql
mutation {
  deleteUser(id: 150) {
    id
    userName
    # más atributos de Usuario
  }
}
```

- - - -

- - - -

## Hecho con

* Node.js
* Express.js
* GraphQL
* Apollo
* Sequelize
* SQL - SQLite 3
* Json Web Token
* Bulma
* Vue
* Passport
* [Glitch](https://glitch.com/)

## Hecho por Gastón Pereyra
* Github: <https://github.com/gastonpereyra/bulletin_board_QL>
* Docs del Bulletin Board: <https://github.com/gastonpereyra/bulletin_board_QL/tree/master/docs/>
