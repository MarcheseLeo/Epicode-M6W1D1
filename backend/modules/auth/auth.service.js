const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Author = require('../authors/authors.schema')
const InvalidPasswordException = require('../../exceptions/auth/InvalidPasswordException')

const login = async(email, password) =>{
    const user = await Author.findOne({email})

    if(!user)
        throw new InvalidPasswordException()

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid)
        throw new InvalidPasswordException()

    const token = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id
    }, process.env.JWT_SECRET, { 
        expiresIn: '10min'
    })

    return {
        token
    }
}

module.exports = {
    login
}