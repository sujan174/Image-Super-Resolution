const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalImageFilename: {
        type: String,
        required: true
    },
    upscaledImageFilename: {
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
        required: true
    }
}, {
    timestamps: true
});

const feedbackModel = mongoose.model('Feedback', feedbackSchema);

module.exports = feedbackModel;
