const express =  require('express')
const authors = express.Router()
const authorController = require('./authors.controller')
const postController = require('../posts/posts.controller')
const {userBodyValidation, userBodyValidator} = require('../../middlewares/users/validateAuhtorBody')

const {cloud} = require('../../middlewares/multer/index')

authors.get('/', authorController.getAuthors)
authors.get('/me', authorController.getMe)
authors.get('/:id', authorController.getAuthor)
authors.get('/:id/posts', postController.getPostByAuthor)

authors.post('/',[userBodyValidation, userBodyValidator] , authorController.createAuthor)
authors.put('/:id', authorController.editAuthor)
authors.delete('/:id', authorController.deleteAuthor)

authors.patch('/:authorId/avatar', cloud.single('avatar'), authorController.uploadAvatar)

module.exports = authors