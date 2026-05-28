const express =  require('express')
const authors = express.Router()
const authorController = require('./authors.controller')

authors.get('/authors', authorController.getAuthors)
authors.get('/authors/:id', authorController.getAuthor)
authors.post('/authors', authorController.createAuthor)
authors.put('/authors/:id', authorController.editAuthor)
authors.delete('/authors/:id', authorController.deleteAuthor)

module.exports = authors