const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    admin:{
        type: Boolean,
        default: false
    },
    imageHistory: [{
        originalPath: {
            type: String,
            required: true
        },
        upscaledPath: {
            type: String, 
            required: true
        },
        modelUsed: {
            type: String,
            required: true
        },
        scaleFactor: {
            type: Number,
            required: true
        },
        likedResult: {
            type: Boolean,
            default: null 
        },
        time: {
            type: Date,
            default: Date.now 
        }
    }]
}, {
    timestamps: true 
});


const User = mongoose.model('User', userSchema);

module.exports = User;
