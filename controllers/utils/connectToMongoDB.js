// Developed by Sujan H

const mongoose = require('mongoose');

// Establish connection to MongoDB database and exit process on failure
async function connectToMongoDB(url) {
  try {
    await mongoose.connect(url);
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
