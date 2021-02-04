const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String
    },
    country: {
        type: String
    },
    category: {
        type: String
    },
    savedArticles: [
        {
            sourceName: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            urlToImage: {
                type: String,
                required: true
            },
            publishedAt: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            }
        },
    ]
})


module.exports = User = mongoose.model('user', UserSchema)