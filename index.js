// Load environment variables and dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./controllers/utils/connectToMongoDB');
const logMiddleware = require('./middleware/logs');
const uploadRouter = require('./routes/upload');
const userRouter = require('./routes/user');

// Initialize Express application and configure port
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/upscaler';
connectToMongoDB(mongoUri);

// Configure view engine and middleware
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logMiddleware);

// Mount application routes
app.use('/upload', uploadRouter);
app.use('/user', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`App started on port http://localhost:${PORT}`);
});
