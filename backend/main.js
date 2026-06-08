const express = require('express')
const startServer = require('./config/db')
require('dotenv').config()
const PORT = process.env.PORT || 3000

//rotte
const authorsRoute = require('./modules/authors/authors.route')
const postsRoute = require('./modules/posts/posts.route')
const server = express()
server.use(express.json())
server.use('/authors', authorsRoute)
server.use('/posts', postsRoute)
startServer(PORT, server)