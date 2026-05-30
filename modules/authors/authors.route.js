const express =  require('express')
const authors = express.Router()
const authorController = require('./authors.controller')
const postController = require('../posts/posts.controller')

authors.get('/', authorController.getAuthors)
authors.get('/:id', authorController.getAuthor)
authors.get('/:id/posts', postController.getPostByAuthor)
authors.post('/', authorController.createAuthor)
authors.put('/:id', authorController.editAuthor)
authors.delete('/:id', authorController.deleteAuthor)

module.exports = authors