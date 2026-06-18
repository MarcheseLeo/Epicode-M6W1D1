const HttpException = require('../index')

class InvalidOrMisssingToken extends HttpException{
    constructor(
        message = "Token error",
        statusCode = 404,
        error = "Invalid or missing token detected"
    ){
        super(message, statusCode, error)
    }
}


module.exports = InvalidOrMisssingToken