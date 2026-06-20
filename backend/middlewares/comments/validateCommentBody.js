const { body, validationResult } = require('express-validator')

const CommentBodyValidation = [
    body('rate')
        .optional()
        .isInt()
        .withMessage('rate must be a number'),
    body('comment')
        .notEmpty()
        .isString()
        .withMessage('comment must be not empty and a string')
]

const CommentBodyValidator = (req, res, next) =>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400)
            .json({
                errors: errors.array()
            })
    }
    next()
}

module.exports ={
    CommentBodyValidator,
    CommentBodyValidation
}
