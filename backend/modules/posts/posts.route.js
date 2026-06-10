const express = require('express')
const posts = express.Router()
const postController = require('./posts.controller')
const commentController = require('../comments/comments.controller')


posts.get('/', postController.getPosts)
posts.get('/search', postController.getByTitle)
posts.get('/:id', postController.getPostById)
posts.get('/:id/comments', commentController.getComments)
posts.get('/:id/comments/:commentId', commentController.getCommentById)

posts.post('/', postController.createPost)
posts.post('/:id', commentController.createComment)

posts.put('/:id', postController.editPost)
posts.put('/:id/comment/:commentId', commentController.editComment)

posts.delete('/:id', postController.deletePost)
posts.delete('/:id/comment/:commentId', commentController.deleteComment)

module.exports = posts