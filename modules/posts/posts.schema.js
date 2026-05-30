const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    category: {
        type: String,
        required: false,
        default: 'unassigned'
    },
    title: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: false,
        default: 'https://placehold.co/6500x400'
    },
    readTime: {
        value: {
            type: mongoose.Schema.Types.Int32,
            required: false,
            default: 0,
        },
        unit: {
            type: String,
            required: false,
            enum: ['minutes', 'seconds',]
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
        required: true
    },
    content: {
        type: String,
        required: true
    }

}, { timestamps: true, strict: true })

module.exports = mongoose.model('post', PostSchema, 'posts')