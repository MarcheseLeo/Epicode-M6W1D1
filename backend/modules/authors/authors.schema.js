const mongoose = require('mongoose')

const Authors = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    birthday:{
        type:String,
        required: true,
    },
    avatar:{
        type: String,
        required: true
    }
}, {timestamps:true, strict:true})

module.exports = mongoose.model('author',Authors, 'authors')