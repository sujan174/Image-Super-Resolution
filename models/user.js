const mongoose = require('mongoose');

// Define user schema with authentication fields and image upscaling history
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  // Track all images processed by this user with feedback and metadata
  imageHistory: [{
    originalPath: { type: String, required: true },
    upscaledPath: { type: String, required: true },
    modelUsed: { type: String, required: true },
    scaleFactor: { type: Number, required: true },
    likedResult: { type: Boolean, default: null },
    time: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
