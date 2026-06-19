const express = require('express')
const startServer = require('./config/db')
const cors = require('cors');
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 3000

//middlewares
const {requestLogger} = require('./middlewares/globals/logger')
const {errorHandler} = require('./middlewares/errors/errorHandlers')
const verifyToken = require('./middlewares/auth/verifyToken')


//rotte
const authorsRoute = require('./modules/authors/authors.route')
const postsRoute = require('./modules/posts/posts.route')
const authRoute = require('./modules/auth/auth.route')
const googleOauthRoute = require('./modules/oauth/oauth.route')

const server = express()
server.use(cors({
    origin: process.env.FRONTEND_URL
}))
server.use(express.json())
server.use('/upload', express.static(path.join(__dirname, './upload')))


server.use(requestLogger)

server.use('/', authRoute)
server.use('/', googleOauthRoute)

server.use(verifyToken)

server.use('/authors', authorsRoute)
server.use('/posts', postsRoute)


//Error handler mmiddleware
server.use(errorHandler)

startServer(PORT, server)