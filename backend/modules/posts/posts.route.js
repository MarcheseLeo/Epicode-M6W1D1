const express = require('express')
const posts = express.Router()
const postController = require('./posts.controller')
const commentController = require('../comments/comments.controller')
const { postBodyValidation, postBodyValidator } = require('../../middlewares/posts/valiadtePostBody')
const { CommentBodyValidation, CommentBodyValidator } = require('../../middlewares/comments/validateCommentBody')

const { cloud } = require('../../middlewares/multer/index')

posts.get('/', postController.getPosts)
posts.get('/search', postController.getByTitle)
posts.get('/:id', postController.getPostById)
posts.get('/:id/comments', commentController.getComments)
posts.get('/:id/comments/:commentId', commentController.getCommentById)

posts.post('/',[postBodyValidation, postBodyValidator], postController.createPost)
posts.post('/:id',[CommentBodyValidation, CommentBodyValidator] ,commentController.createComment)

posts.put('/:id', postController.editPost)
posts.put('/:id/comment/:commentId', commentController.editComment)

posts.patch('/:id/cover', cloud.single('cover'), postController.uploadPostCover)

posts.delete('/:id', postController.deletePost)
posts.delete('/:id/comment/:commentId', commentController.deleteComment)

module.exports = posts