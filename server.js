const express = require('express');
// Para la API
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
// DB
const { User, Post, Comment, Tag, Like } = require('./sequelize');
// Auth
const pass = require('./passport');

// Express Stuff
var app = express();
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Passport Config
pass(app, '/graphql', User);

// API / Apollo Stuff
const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: ( {req}) => ({
    auth: req.user,
    users: User,
    posts: Post,
    comments: Comment,
    tags: Tag,
    likes: Like
  })});

server.applyMiddleware({app});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
