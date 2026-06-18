const HttpException = require("../index");

class PostNotFoundException extends HttpException{
    constructor(
        message = 'Post not found',
        statusCode = 404, 
        error = 'The requested resource is not found'
    ){
        super(message, statusCode, error)
    }
}

module.exports = PostNotFoundException