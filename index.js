require('dotenv').config();
const express = require('express');
const path = require('path');
const connectToMongoDB = require("./controllers/utils/connectToMongoDB");
const cookieParser = require("cookie-parser");
const logMiddleware = require("./middleware/logs");

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://127.0.0.1:27017/upscaler");

const uploadRouter = require("./routes/upload"); 
const userRouter = require("./routes/user"); 

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logMiddleware);

app.use("/upload", uploadRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
});
