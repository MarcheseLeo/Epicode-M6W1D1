const authService = require('./auth.service')

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body
        const {token} = await authService.login(email, password)

        res.header('authorization', token)
            .status(200)
            .send({
                statusCode: 200,
                message: 'Login successfully',
                token
            })


    }catch(e){
        next(e)
    }
}

module.exports = {
    login
}