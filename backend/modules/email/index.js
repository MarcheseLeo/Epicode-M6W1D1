const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sgtSend = async (
    to,
    subject,
    message,
) => {
    try {
        const emailOptions = {
            from: 'leonardo.lol.ldp@gmail.com',
            to,
            subject,
            html: message
        }
        return await sgMail.send(emailOptions)
    } catch (e) {
        console.error(e)
        throw new Error('Not possible to send email, an error occurred')
    }
}

const sendEmail = async (
    to,
    subject,
    message,
) => {
    try {
        const emailOptions = {
            from: 'noreply@mioserver.com',
            to,
            subject,
            html: message
        }

        return await transporter.sendMail(emailOptions)
    } catch (e) {
        console.error(e)
        throw new Error('Not possible to send email, an error occurred')
    }
}


module.exports = {
    sgtSend,
    sendEmail
}