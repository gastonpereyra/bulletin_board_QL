# Parte 13
### Posts

<img src="" width="200">

Los posts van a llevar muchas cosas adicionales, por ejemplo llevan la info de los Tags, de los Comentarios, del Autor, y Like/Dislike.

## Graphql

El schema general del post no cambia de lo que considere al principio.

```graphql
type Post {
  id: Int
  title: String
  message: String
  views: Int
  visible: Boolean
  likes: Int
  dislikes: Int
  author: User
  comments: [Comment]
  tags: [Tag]
  createdAt: String
  updatedAt: String
}
```

