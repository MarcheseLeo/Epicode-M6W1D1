const jwt = require('jsonwebtoken')


const authGoogle = async(req, res, next) =>{
    try{
        const user = encodeURIComponent(JSON.stringify(req.user))
        const redirectUrl = `http://localhost:3000/oauth/success?user=${user}`

        res.redirect(redirectUrl)
    }catch(e){
        next(e)
    }
}


const manageOauthCallback = async (req, res, next) =>{
    try{
        const payload = {
            id: req.user._id, 
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

        const redirectUrl = `http://localhost:3000/oauth/success/?token=${token}`
        res.redirect(redirectUrl)
    }catch(e){

    }
}

module.exports = {
    authGoogle,
    manageOauthCallback
}