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
        type:Boolean,
        default: false
    },
    imageHistory: [{
        originalPath: { // This was missing
            type: String,
            required: true
        },
        upscaledPath: { // This was also missing
            type: String, 
            required: true
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