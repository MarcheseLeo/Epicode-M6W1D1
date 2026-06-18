const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Authors = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: false,
        default: Date.now()
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    avatar: {
        type: String,
        required: false,
        default: "https://placeholder/300"
    },
    age: {
        type: mongoose.Schema.Types.Int32,
        required: false,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',
            default: []
        }
    ],
}, { timestamps: true, strict: true })

Authors.pre('save', async function () {
    const instance = this

    if (!instance.isModified())
        return

    const salt = await bcrypt.genSalt(10)
    instance.password = await bcrypt.hash(instance.password, salt)


})

Authors.pre('findOneAndUpdate', async function(){
    const update = this.getUpdate()

    if(update.password) {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(update.password, salt)

        this.setUpdate({
            ...update,
            password: hashed
        })
    }
})
module.exports = mongoose.model('author', Authors, 'authors')