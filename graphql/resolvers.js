// Resolvers
const {postsUser, commentsUser, postsCountUser, commentsCountUser,
       getUsers, getUser, me, isEmail, isUserName, 
       logIn, signIn, updateUser, changeRole, deleteUser } = require('./UsersResolvers');
const {postsTag, getTags, getTag, deleteTag} = require('./TagsResolvers');
const {authorPost, tagsPost, commentsPost, likesPost, likesCountPost, dislikesCountPost, commentsCountPost, 
       getPosts, getPost, viewPost, 
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
    commentsCount: commentsCountPost,
    likesCount: likesCountPost,
    dislikesCount: dislikesCountPost,
  },
  User: {
    posts: postsUser,
    comments: commentsUser,
    postsCount: postsCountUser,
    commentsCount: commentsCountUser,
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
    viewPost,
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
