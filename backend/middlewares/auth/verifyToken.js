const jwt = require('jsonwebtoken')
const InvalidOrMisssingToken = require('../../exceptions/auth/InvalidOrMissingToken')
const pc = require('picocolors')

const EXCLUDED_ROUTES = [
    '/auth/login',
    '/auth/google',
    '/auth/google/callback'
]

const verifyToken = async (req, res, next) => {
    if (EXCLUDED_ROUTES.includes(req.path) || (req.path === '/authors' && req.method === 'POST')) return next()

    const token = req.header('authorization')

    if (!token) {
        return next(new InvalidOrMisssingToken());
    }

    try {
        req.user = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
        console.log(
            pc.green('▶ Auth OK ') +
            pc.cyan(`${req.user.firstName} ${req.user.lastName} `) +
            pc.dim(`[${req.user.email}]`)
        )
        next()
    } catch (e) {
        console.log(pc.red('✖ Errore Auth: Token non valido o scaduto'))
        return next(new InvalidOrMisssingToken());
    }
}

module.exports = verifyToken