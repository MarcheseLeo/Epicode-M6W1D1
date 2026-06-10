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
    dob:{
        type:Date,
        required: false,
        default: Date.now()
    },
    password:{
        type:String,
        required: true,
        min: 8,
    },
    avatar:{
        type: String,
        required: false,
        default: "https://placeholder/300"
    },
    age:{
        type: mongoose.Schema.Types.Int32,
        required: false,
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',
            default: []
        }
    ],
}, {timestamps:true, strict:true})

module.exports = mongoose.model('author',Authors, 'authors')