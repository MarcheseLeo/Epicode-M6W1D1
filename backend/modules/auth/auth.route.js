const express = require('express')
const authController = require('./auth.controller')
const auth = express.Router()

auth.post('/auth/login', authController.login)

module.exports = auth
