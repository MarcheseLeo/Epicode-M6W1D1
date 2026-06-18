const HttpException = require('../index')

class InvalidPasswordException extends HttpException{
    constructor(
        message = "Incorrect credential",
        statusCode = 404,
        error = "The provided credential are not valid"
    ){
        super(message, statusCode, error)
    }
}


module.exports = InvalidPasswordException