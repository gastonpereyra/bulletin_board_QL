# Parte 2
### Modelos

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/2nd_icon-icons.com_68916.png" width="200">

Hay que hacer los modelos de datos. Lo voy a necesitar tanto para la base de datos como para la API.

Necesito :

* Usuarios
* Posts
* Comentarios
* Tags

## User / Usuarios 

Que deberian tener los usuarios ?

| key | GraphQL | SQL | Comentario |
| --- | ------- | --- | ---------- |
| id | Int/ID  | INTEGER  | Asignado por DB, Autoincremental |
| userName | String | STRING | Unico |
| email | String | STRING |  Unico |
| password | String | STRING | encriptada |
| role | Int | INTEGER |  0=Usuario, 1=Mod, 2=Admin |
| createdAt | String | DATE | Datetime |
| updatedAt | String | DATE | Datetime |
| | | | |
| posts | [Post] | Usuario hasMany Post | Relación con Posts|
| comments | [Comement] | Usuario hasMany Comment | Relación con Comments |

## Tag / Etiquetas

| key | GraphQL | SQL | Comentario |
| --- | ------- | --- | ---------- |
| id | Int/ID | INTEGER | asignado por la DB, autoincremental |
| nombre | String | STRING | Unico |
| | | | |
| posts | [Post] | Tag belongsToMany Post | Relación con Posts |

## Post / Mensajes

| key | GraphQL | SQL | Comentario |
| --- | ------- | --- | ---------- |
| id | Int/ID | INTEGER | asignado por la DB, autoincremental |
| title | String | STRING  | Titulo del Post |
| message | String | TEXT | Mensaje |
| views | Int | INTEGER | Visitas |
| visible | Boolean | BOOLEAN | |
| createdAt | String | DATE | Datetime |
| updatedAt | String | DATE | Datetime |
| | | | |
| author | User | Post belongsTo User | Relación con User |
| comments | [Comment] | Post hasMany Comment | Relación con Comment |
| tags | [Tag] | Post belongsToMany Tag | Relación con Tag |
| likes | Int | Post hasMany Like | Positivos |
| dislikes | Int | Post hasMany Like | Negativos |

## Comment / Comentarios

| key | GraphQL | SQL | Comentario |
| --- | ------- | --- | ---------- |
| id | Int/ID | INTEGER | asignado por la DB, autoincremental |
| message | String | TEXT | Mensaje |
| createdAt | String | DATE | Datetime |
| updatedAt | String | DATE | Datetime |
| | | | |
| author | User | Comment belongsTo User | Relación con User |
| post | Post | Comment belongsto Post | Relación con Posts |

## Likes y Dislikes

En GrahpQL solo van a ser un conteo. Pero en la Base de datos la estrategia será guardar que User dio like o dislike a que Post, para que no pueda volver a hacerlo.

| key | GraphQL | SQL | Comentario |
| --- | ------- | --- | ---------- |
| like | - | String | l (like) o d (dislike) |
| userId | - | Like belongsTo User | Relación con User |
| postId | - | Like belongsto Post | Relación con Posts |

### Aclaración

* En cuanto a tablas de SQL a simple vista son 5: User, Post, Tag, Comment y Post_Tag
* En MongoDB se podría tener 4 colecciones, o 3 con los comentarios dentro de cada Post. 
* En GraphQL vamos a necesitar definir los Query y Mutations además.

- - - -
