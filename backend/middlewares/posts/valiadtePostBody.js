const { body, validationResult } = require('express-validator')

const postBodyValidation = [
    body('category')
        .optional()
        .isString()
        .withMessage('Category must be a string'),
    body('title')
        .notEmpty()
        .isString()
        .withMessage('Title must be not empty and a string'),
    body('cover')
        .optional()
        .isURL()
        .withMessage('Cover must be a valid url'),
    body('content')
        .notEmpty()
        .isString()
        .withMessage('Content must be not empty and a string'),
]

const postBodyValidator = (req, res, next) =>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400)
            .json({
                errors: errors.array()
            })
    }

    next()
}

module.exports = {
    postBodyValidator,
    postBodyValidation
}
