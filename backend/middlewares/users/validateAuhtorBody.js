const { body, validationResult } = require('express-validator')

const userBodyValidation = [
    body('firstName')
        .notEmpty()
        .isString()
        .withMessage('Firstname must be a string and not empty'),
    body('lastName')
        .notEmpty()
        .isString()
        .withMessage('Lastname must be a string and not empty'),
    body('email')
        .isEmail()
        .notEmpty()
        .withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty()
        .isString()
        .withMessage('password must be a string and not empty')
        .isLength({ min: 8 })
        .withMessage('password must be at least an 8 charachter string'),
    body('dob')
        .isDate()
        .optional()
        .withMessage('Date of birth must be a valid date'),
    body('avatar')
        .optional()
        .isString()
        .isURL()
        .withMessage('avatar must be a valid url'),
    body('age')
        .optional()
        .isInt()
        .withMessage('age must be a valid number'),
]

const userBodyValidator = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400)
            .json({
                errors: errors.array()
            })
    }
    next()
}

module.exports = {
    userBodyValidator,
    userBodyValidation
}