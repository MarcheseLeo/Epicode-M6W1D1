const express = require('express')
const startServer = require('./config/db')
const PORT = 9099

//rotte
const authorsRoute = require('./modules/authors/authors.route')
const postsRoute = require('./modules/posts/posts.route')
const server = express()
server.use(express.json())
server.use('/users', authorsRoute)
server.use('/posts', postsRoute)
startServer(PORT, server)