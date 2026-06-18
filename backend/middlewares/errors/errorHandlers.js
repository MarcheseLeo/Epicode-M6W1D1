const HttpException = require('../../exceptions/index')

const mongoose = require('mongoose')


const badRequestHandler = (err, req, res, next) =>{
    if(err.statusCode===400 || err.status===400){
        return res.status(400).send({
            statusCode: 400,
            error: "Richiesta non valida",
            message: err.message 
        })
    }

    next(err)
}

const genericErrorHandler = (err, req, res, next) => {
    console.error("ERRORE FATALE:", err); 

    res.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Ops! Qualcosa è andato storto nel server."
    })
}

const errorHandler = (err, req, res, next) =>{
    if(err instanceof HttpException){
        return res.status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                message: err.message,
                error: err.error
            })
    }

    if(err instanceof mongoose.Error.CastError){
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: object id is invalid or malformed'
            })
    }

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(err.statusCode || 400)
            .json({
                statusCode: err.statusCode || 400,
                message: 'Mongoose Error: one ore more passed or required props failed the validation',
                error: err.errors
            })
    }

    if(err.code===11000){
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: duplicate key error'
            })
    }

    res.status(500)
        .json({
            statusCode:500,
            message: "Internal Server error",
            error: "An error has occurred"
        })

}

module.exports = {
    badRequestHandler,
    genericErrorHandler,
    errorHandler
}