const express = require('express')
const posts = express.Router()
const postController = require('./posts.controller')

posts.get('/', postController.getPosts)
posts.get('/search', postController.getByTitle)
posts.get('/:id', postController.getPostById)

posts.post('/', postController.createPost)

posts.put('/:id', postController.editPost)

posts.delete('/:id', postController.deletePost)


module.exports = posts