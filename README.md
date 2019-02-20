Bulletin Board Server :clipboard:
=================

Servidor con la API del Tablón de Anuncios.

[Ir al Playground](https://bullentin-board-ql.glitch.me/graphql/)

UI del Tablón de Anuncios: **PROXIMAMENTE**.

<img src="https://cdn.glitch.com/beff46ab-c8a9-4e97-8811-1fe113d14bbc%2FBB.jpg?1550257125393" width="900">

- - - -

## Contenido :book:

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

## Versión :vs:

Versión numero: *1.0.2*

:one: :black_circle: :zero: :black_circle: :two:

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

## Endpoint :end:

API construida en *Graphql* con *Apollo*.

Endpoint: `https://bullentin-board-ql.glitch.me/graphql`

- - - -

## JWT :symbols:

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

## Usuario :busts_in_silhouette:

Los usuarios tienen los siguientes atributos:

* `id: Int` : ID asignado por el sistema al registrarse.
* `createdAt: String` : UNIX (ms), fecha de la creación
* `updatedAt: String` : UNIX (ms), fecha de la ultima actualización
* `lastLoginAt: String` : UNIX (ms), fecha del ultimo ingreso
* `userName: String` : Nombre de Usuario, debe ser Unico
* `email: String` : Email del Usuario, debe ser Unico
* `role: Int`, Nivel o Rol de Usuario, 2= Administador, 1= moderador, 0= Usuario
* `image: String`: URL de una imagen del usuario.
* `postsCount: Int` : Cantidad de Posts
* `commentsCount: Int`: Cantidad de Comentarios
* `posts(count: Int, offset: Int, order: PostOrder): [Post]`: Posts del Usuario
* `comments(count: Int, offset: Int, order: CommentOrder): [Comment]`: Comentarios del Usuario

Adicionalmente se necesitará un `password` tanto para registrarse, ingresar como actualizar.

### Registrate :black_nib:

`signIn(input: {userName: String, password: String, email: String, image: String})`

**Obligatorio** : `userName`, `password` (minimo 4 caracteres), `email`

**Opcional** : `image` (url)

Genera un Token que se puede usar para mantener la sesión durante una hora.

Si ya ingreso (osea esta usando el Token) no puede usarse.

Ejemplo:

```graphql
# Se Registra el Usuario "Ejemplo"
mutation {
signIn(input:{userName:"Ejemplo", password:"abc123", email:"ejemplo@falsa.com"}) {
  token
  userName
  }
}
```

### Ingresar :raising_hand:

`logIn(userName: String, password: String)`

**Obligatorio** : `userName`, `password` (minimo 4 caracteres)

Genera un Token que se puede usar para mantener la sesión durante una hora.

Si ya ingreso (osea esta usando el Token) no puede usarse.

Ejemplo

```graphql
# Intenta Ingresar el Usuario Ejemplo
mutation {
logIn(userName:"Ejemplo", password:"abc123") {
  token
  userName
  }
}
```

### Actualizar :scissors:

`updateUser(newUser: {userName: String, password: String, email: String, image: String}, oldUser: {userName: String, password: String, email: String, image: String})`

Necesita haber Ingresado previamente

+ *oldUser* : Datos anteriores del Usuario. El `password` debe ser correcto.
+ *newUser* : Datos del Usuario a cambiar. Si no se quiere cambiar un campo, poner lo mismo que en *oldUser*

**Obligatorio** : `userName`, `password` (minimo 4 caracteres), `email`

**Opcional** : `image` (url)

Genera un Token que se puede usar para mantener la sesión durante una hora y Actualiza el Usuario.

```graphql
# Actualiza los datos del Usuario
mutation {
updateUser( newUser:{userName: "UnEjemplo", password: "123abc", email:"ejemplo@muyfalsa.com"}, oldUser:{userName: "Ejemplo", password: "abc123", email:"ejemplo@falsa.com"}) {
    token
    userName
  }
}
```

### Niveles de Usuario :hotel:

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
# Cambia el rol del User de ID 2, a MOD
mutation {
  changeRole(userId:2, role: MOD) {
    id
    userName
    # más atributos de Usuario
    role
  }
}
```
### Borrar un usuario :bomb:

Solo un `ADMIN` puede borrarlo. Sus Posts y Comentarios no se pierden

`deleteUser(id: ID)`

**OBLIGATORIO**: `id` (ID del usuario a borrar)

Devuelve los datos del usuario Borrado

Ejemplo

```graphql
# Borra el Usuario de ID 150
mutation {
  deleteUser(id: 150) {
    id
    userName
    # más atributos de Usuario
  }
}
```

- - - -

## Busqueda de Usuarios :mag_right:

Pueden **Ordenarse** por:

* ID : `ID_ASC` y `ID_DESC` 
* Nombre de Usuario: `USERNAME_ASC` y `USERNAME_DESC`
* Creación: `CREATED_ASC` y `CREATED_DESC`
* Ultima Actualización: `UPDATED_ASC` y `UPDATED_DESC`
* Cantidad de Posts: `POSTS_ASC` y `POSTS_DESC`
* Cantidad de Comentarios: `COMMENTS_ASC` y `COMMENTS_DESC`

### Por ID :id:

`getUser(id: ID!)`

** OBLIGATORIO **: ID del Usuario.

Devuelve un Usuario si el ID es correcto, o `null`

EJEMPLO

```graphql
query {
# Busca el Usuario con ID 200
  getUsers(id: 200) {
    userName
    id
    email
    role
    image
    createdAt
    updatedAt
    lastLoginAt
    postsCount
    commentsCount
    # Mas atributos de Usuario
  }
}
```

### Usuario Identificado :star:

`me`

Debe haber ingresado, devuelve el user actual

EJEMPLO

```graphql
# Busca al usuario del token que se le pasa como Autenticación
query {
  me {
    userName
    id
    email
    role
    image
    createdAt
    updatedAt
    lastLoginAt
    postsCount
    commentsCount
    # Mas atributos de Usuario
  }
}
```

### Varios Usuarios :family:

`getUsers(userName: String, role: Role, count: Int, offset: Int, order: UserOrder)`

Todos los parametros son **Opcionales**

* `role` Filtra por Nivel de usuario
* `userName` Filtra por Nombre de Usuario (no es necesario que sea exacto)
* `count` cantidad a devolver / Default: todos
* `offset` desde que posición / Default: principio (0)
* `order` Tipo de ordenamiento / Default: Alfabeticamente por userName

Devuelve una lista de Usuarios, o `null`

EJEMPLO

```graphql
# Busca 10 Usuarios que en su nombre tengan la frase 'Juan', solo Usuarios, ordenados por cantidad de Post (más cantidad primero), desde el principio de la lista
query {
  getUsers(userName: "Juan", count:10, offset: 0, order: POSTS_DESC, role: USER) {
    userName
    id
    email
    role
    image
    createdAt
    updatedAt
    lastLoginAt
    postsCount
    commentsCount
    # Mas atributos de Usuario
  }
}
```

### Nombre de Usuario Habilitado :crystal_ball:

`isUserName(userName: String)`

Si el `userName` existe devuelve `true` sino `false`


EJEMPLO

```graphql
# Busca si existe el nombre de Usuario "SoyLaComadreja" registrado
query {
  isUserName(userName:"SoyLaComadreja")
}
```

### Email Habilitado :email:

`isEmail(email: String)`

Si el `email` existe devuelve `true` sino `false`

EJEMPLO

```graphql
# Busca si existe el Email: "rambo@gmail.com" registrado
query {
  isEmail(email:"rambo@gmail.com")
}
```

- - - -

## Posts :speech_balloon:

Los  tienen los siguientes atributos:

* `id: Int` : ID asignado por el sistema al crearse
* `createdAt: String` : UNIX (ms), fecha de la creación
* `updatedAt: String` : UNIX (ms), fecha de la ultima edición
* `title: String` : Titulo, hasta 50 caracteres
* `message: String` : Mensaje, hasta 1500 caracteres
* `views: Int` : Cantidad de visitas
* `likesCount: Int` : Cantidad de 'Me Gusta'/Likes
* `dislikesCount: Int` : Cantidad de 'No Me Gusta'/Dislikes
* `commentsCount: Int` : Cantidad de Comentarios
* `author: User` : Datos del Autor
* `comments(count: Int, offset: Int, order: CommentOrder): [Comment]` : Comentarios creados por el Usuario, orden por Default: Mas reciente primero
* `tags(count: Int, offset: Int, order: TagOrder): [Tag]` : Tags asociados, orden por Default: ID mas bajo primero 
* `likes(userId: Int, count: Int, offset: Int): [Like]` : Datos de los Likes/Dislikes, buscar si un usuario ya dió alguno 

En cuanto a los `likes(userId: 1)` busca si el usuario de ID 1, dio like o dislike, y devuelve 

* `postId`
* `userId`
* `like` : `true`: 'Me Gusta'/like, `false`: 'No Me Gusta'/dislike

### Crear :love_letter:

`createPost(title: String, message: String, tagList: [String])`

**OBLIGATORIO** : `title` (máximo 50 caracteres), `message` (máximo 1500 caracteres)

**OPCIONAL** : `tagList` (lista de tags)

Necesita haber Ingresado con un Usuario valido.

Crea un post y devuelve sus datos.

EJEMPLO

```graphql
# Crea un Post
mutation {
createPost(title:"Hola Universo", message:"Mi primer post, cortito.", tagList: ["Nuevo", "Ejemplo"]) {
    id
    title
    message
    views
    likesCount
    dislikesCount
    createdAt
    updatedAt
    tags{
      name
    }
    author{
      userName
    }
    comments {
      message
    }
    # Y otros atributos de Post
  }
}
```

### Editar :wrench:

`updatePost(id: Int, title: String, message: String, tagList:[String])`

**OBLIGATORIO** : `id` (id del post) 

**OPCIONAL** : `title` (máximo 50 caracteres), `message` (máximo 1500 caracteres), `tagList` (lista de tags)

Necesita haber Ingresado con un Usuario valido.

Actualiza el un post, solo si el usuario ingresado es el autor o Moderador/Administrador.

Devuelve el Post Actualizado.

EJEMPLO

```graphql
# Actualiza un post con nuevos datos
mutation {
  updatePost(id: 80, title: "Hola Universo", message:"Este el mensaje modificado pero muy modificado", tagList:["Ejemplo","Modificado","Viejo"]){
    id
    title
    message
    views
    likesCount
    dislikesCount
    createdAt
    updatedAt
    tags{
      name
    }
    author{
      userName
    }
    comments {
      message
    }
    # Y otros atributos de Post
  }
}
```

### Borrar :boom:

`deletePost(id: Int)`

**OBLIGATORIO** : `id` (id del post) 

Necesita haber Ingresado con un Usuario valido.

Borra el un post, solo si el usuario ingresado es el autor o Moderador/Administrador.

Devuelve el Post Borrado

EJEMPLO

```graphql
# Borra el post
mutation {
 deletePost(id: 80) {
    title
    message
    # Y otros atributos de Post
  }
}
```

### Visitar Post :ok_hand:

`viewPost(id: Int)`

**OBLIGATORIO** : `id` (id del post)

Devuelve el Post (si existe), y aumenta el atributo de visitas en 1.

EJEMPLO

```graphql
# Entra a ver el Post y registra el evento
mutation {
  viewPost(id: 80) {
    title
    message
    views
    # Y otros atributos de Post
  }
}
```

### Me Gusta :thumbsup:

`giveLike(postId: Int)`

**OBLIGATORIO** : `postId` (id del post)

Si el ID existe, intenta agregar un 'Me Gusta' al post.

Si el usuario no le dio Like previamente, agrega el like al post, y devuelve `true`.

Si el usuario le dio dislike previamente, cambia a like, y devuelve `true`.

Si el usuario le dio like previamente, borra el like y devuelve `false`.

EJEMPLO

```graphql
# Le da Like a un post / o lo quita si ya lo habia hecho
mutation {
  giveLike(postId: 80)
}
```

### No Me Gusta :-1:

`giveDislike(postId: Int)`

**OBLIGATORIO** : `postId` (id del post)

Si el ID existe, intenta agregar un 'No Me Gusta' al post.

Si el usuario no le dio Dislike previamente, agrega el Dislike al post, y devuelve `true`.

Si el usuario le dio Like previamente, cambia a Dislike, y devuelve `true`.

Si el usuario le dio Dislike previamente, borra el Dislike y devuelve `false`.

EJEMPLO

```graphql
# Le da DisLike a un post / o lo quita si ya lo habia hecho
mutation {
  giveDislike(postId: 80)
}
```
- - - -

## Busqueda de Posts :mag:

Pueden **Ordenarse** por:

* ID : `ID_ASC` y `ID_DESC` 
* Nombre de Autor: `AUTHOR_ASC` y `AUTHOR_DESC`
* Creación: `CREATED_ASC` y `CREATED_DESC`
* Ultima Actualización: `UPDATED_ASC` y `UPDATED_DESC`
* Cantidad de 'Me Gusta': `LIKES_ASC` y `LIKES_DESC`
* Cantidad de 'No Me Gusta': `DISLIKES_ASC` y `DISLIKES_DESC`
* Cantidad de Comentarios: `COMMENTS_ASC` y `COMMENTS_DESC`

### Por ID :id:

`getPost(id: Int)`

**OBLIGATORIO** : `id` (id del post)

Busca el Post, devuelve sus datos si existe, sino `Null`

EJEMPLO

```graphql
# Busca el post 
query {
  getPost(id: 151) {
    title
    likes(userId: 23{
      like
    }
    author {
      userName
    }
    message
    tags(offset:0, order: CREATED_ASC){
      name
    }
    likesCount
    dislikesCount
    commentsCount
    comments(count: 2, offset:0) {
      message
      createdAt
    }
    # Y otros atributos de Post
  }
}
```

### Varios Posts :page_with_curl:

`getPosts(title: String, count: Int, offset: Int, order: PostOrder)`

Todos los parametros son **Opcionales**

* `title` Filtra por Frase en el Titulo (no es necesario que sea exacto)
* `count` cantidad a devolver / Default: todos
* `offset` desde que posición / Default: principio (0)
* `order` Tipo de ordenamiento / Default: Mas Reciente primero

Devuelve una lista de Posts. Sino `null`

EJEMPLO

```graphql
# Busca los posts cuyo titulo incluya "Hola", ordenados por Cantidad de Comentarios, mas cantidad primero, desde el 2 de la lista y 12 posts que le siguen si existen
query {
  getPosts(title: "Hola", count: 12, offset: 2, order: COMMENT_DESC) {
    title
    message
    likesCount
    dislikesCount
    commentsCount
    # Y otros atributos de Post
}
```

- - - -

## Tags :hash:
  
Los  tienen los siguientes atributos:

* `id: Int` : ID asignado por el sistema al crearse
* `createdAt: String` : UNIX (ms), fecha de la creación
* `name: String` : Nombre del Tag, 20 caracteres Máximo 
* `postsCount: Int` : Cantidad de Post asociados al Tag
* `posts(count: Int, offset: Int, order: PostOrder): [Post]` : Posts en los que se encuentra, ordernados desde el mas reciente al mas antiguo

Pueden **Ordenarse** por:

* ID : `ID_ASC` y `ID_DESC` 
* Nombre del Tag: `NAME_ASC` y `NAME_DESC`
* Creación: `CREATED_ASC` y `CREATED_DESC`
* Ultima Actualización: `UPDATED_ASC` y `UPDATED_DESC`
* Cantidad de Posts: `POSTS_ASC` y `POSTS_DESC`


### Buscar por ID :mag_right:

`getTag(id: Int)`

**OBLIGATORIO** : `id` (id del Tag)

Busca un Tag por ID, si existe devuelve los datos, sino `null`

EJEMPLO

```graphql
# Busca un Tag por Id
query {
  getTag(id:1) {
    name
    postCount
    post {
      id
    }
    # Resto de Atributos
  }
}
```

### Buscar varios :mag:

`getTags(name: String, count: Int, offset: Int, order: TagOrder)`

Todos los parametros son **Opcionales**

* `name` Filtra por Nombre de Tags (no es necesario que sea exacto)
* `count` cantidad a devolver / Default: todos
* `offset` desde que posición / Default: principio (0)
* `order` Tipo de ordenamiento / Default: ID ascendente

Devuelve una lista de Tags.

EJEMPLO

```graphql
# Busca 100 Tags que tengan "Es" en su nombre, desde el numero 100, ordenados alfabeticamente por nombre del Tag desde Z a A
query {
  getTags(name: "Es", count: 100, offset: 100, order: NAME_DESC) {
    name
    postCount
    post {
      id
    }
    # Resto de Atributos
  }

}
```

### Borrar Tags :bomb:

`deleteTag(id: Int)`

**OBLIGATORIO** : `id` (id del Tag)

Administador Borra un Tag. Solo si no tiene Post asociados.

Devuelve el post borrado.

EJEMPLO

```graphql

mutation {

  deleteTag(id: 1010) {
    name
    id
    # Resto de Atributos
  }

}
```

- - - -

## Comentarios :thought_balloon:

Los  tienen los siguientes atributos:

* `id: Int` : ID asignado por el sistema al crearse
* `createdAt: String` : UNIX (ms), fecha de la creación
* `updatedAt: String` : UNIX (ms), fecha de la ultima edición
* `message: String` : Mensaje del Comentario, 500 caracteres máximo
* `author: User` : Datos del Autor
* `post: Post` : Datos del Post

Pueden **Ordenarse** por:

* ID : `ID_ASC` y `ID_DESC` 
* Nombre del Autor: `AUTHOR_ASC` y `AUTHOR_DESC`
* ID de Posts: `POSTID_ASC` y `POSTID_DESC`
* Creación: `CREATED_ASC` y `CREATED_DESC`
* Ultima Actualización: `UPDATED_ASC` y `UPDATED_DESC`

### Crear :sparkles:

`createComment(postId: Int, message:String)`

**OBLIGATORIO** : `postId` (id del post), `message` (500 caracters máxismo)

Crea un comentario en un post determinado.

Se debe estar identificado con un Usuario valido. 

Devuelve el comentario Creado

EJEMPLO

```graphql
# Crea el Comentario en el post de ID 1
mutation {
  createComment(postId: 1, message:"Muy Bueno") {
    id
    message
    author{
      userName
    }
    post {
      id
      title
    }
    # Resto de Atributos
  }
}
```

### Editar :hammer:

`editComment(id: Int, message:String)`

**OBLIGATORIO** : `id` (id del comentario), `message` (500 caracters máxismo)

Edita un comentario. Solo Autor o Moderador/Administrador

Se debe estar identificado con un Usuario valido. 

Devuelve el comentario Editado

EJEMPLO

```graphql
# Edita el comentario de ID 10
mutation {
  editComment(id: 10, message:"Muy Bueno! PD: Genial") {
    id
    message
    # Resto de Atributos
  }
}
```

### Borrar :collision:

`deleteComment(id: Int)`

**OBLIGATORIO** : `id` (id del comentario)

Borra un comentario. Solo Autor o Moderador/Administrador

Se debe estar identificado con un Usuario valido. 

Devuelve el Comentario Borrado

EJEMPLO

```graphql

mutation {
  deleteComment(id: 10) {
    id
    message
    # Resto de Atributos
  }
}
```

### Buscar varios :mag:

`getComments(count: Int, offset: Int, order: CommentOrder)`

Todos los parametros son **Opcionales**

* `count` cantidad a devolver / Default: todos
* `offset` desde que posición / Default: principio (0)
* `order` Tipo de ordenamiento / Default: Mas Reciente Primero

Devuelve una lista de Comments o `null`

EJEMPLO

```graphql
# Busca los primeros 5 comentarios ordenados alfabeticamente por nombre de Autor
query {
  getComments(count: 5, offset:0, order: AUTHOR_ASC){
    message
    id
    post {
      id
    }
    author {
      userName
    }
  }
  getTags {
    name
    posts{
      id
      title
    }
  }
}
```

- - - -

## Hecho con :speaker:

* Node.js
* Express.js
* GraphQL
* Apollo
* Sequelize
* SQL - SQLite 3
* Json Web Token
* Passport
* [Glitch](https://glitch.com/)

## Hecho por Gastón Pereyra :man:
* Github: <https://github.com/gastonpereyra/bulletin_board_QL>
* Docs del Bulletin Board: <https://github.com/gastonpereyra/bulletin_board_QL/tree/master/docs/>
