const express = require('express')
const startServer = require('./config/db')
const PORT = 9099

//rotte

const authorsRoute = require('./modules/authors/authors.route')

const server = express()
server.use(express.json())
server.use('/', authorsRoute)
startServer(PORT, server)