const express = require('express')
const oauth = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')
const googleController = require('./google.oauth.controller')

const Author = require('../authors/authors.schema')
const bcrypt = require('bcrypt')

oauth.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
}))

oauth.use(passport.initialize())
oauth.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await Author.findOne({ email: profile.emails[0].value })

                if(!user){
                    const hashedRandomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

                    user = new Author({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName || " ", 
                        email: profile.emails[0].value,
                        password: hashedRandomPassword,
                        avatar: profile.photos[0].value 
                    })
                    await user.save()
                }
                done(null, user);
            } catch (e) {
                done(e, null)
            }
        }
    )
)

oauth.get('/auth/google', passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    }))
oauth.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleController.manageOauthCallback)

module.exports = oauth