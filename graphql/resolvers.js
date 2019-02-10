// Resolvers
const {postsUser, getUsers, getUser, me, isEmail, isUserName, 
       logIn, signIn, updateUser, changeRole, deleteUser } = require('./UsersResolvers');
const {postsTag, getTags, getTag, deleteTag} = require('./TagsResolvers');
const {authorPost, tagsPost, commentsPost, likesPost, dislikesPost, 
       getPosts, getPost, getPostByTitle, 
       createPost, updatePost, deletePost,giveLike, giveDislike} = require('./PostsResolvers');
const {postComment, getComments, authorComment, createComment, editComment ,deleteComment } = require('./CommentsResolvers');

// Listos para Exportar
module.exports = {
  // Agregar atributos especiales
  Post: {
    author: authorPost,
    tags: tagsPost,
    comments: commentsPost,
    likes: likesPost,
    dislikes: dislikesPost,
  },
  User: {
    posts: postsUser
  },
  Tag: {
    posts: postsTag
  },
  Comment: {
    post: postComment,
    author: authorComment,
  },
  // Agregar los Queries
  Query: {
    // Users
    getUsers,
    getUser,
    me,
    isUserName,
    isEmail,
    // Posts
    getPosts,
    getPost,
    getPostByTitle,
    // Tags
    getTags,
    getTag,
    // Comments
    getComments,
  },
  // Agregar los Modificaciones
  Mutation: {
    // Users
    logIn,
    signIn,
    updateUser,
    changeRole,
    deleteUser,
    // Posts
    createPost,
    updatePost,
    deletePost,
    // Likes
    giveLike,
    giveDislike,
    // Tags
    deleteTag,
    // Comments
    createComment,
    editComment,
    deleteComment,
  }
}
