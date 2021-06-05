require('dotenv').config();
const express = require('express');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require("./middleware/errorHandler")
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const morgan = require('morgan')

const app = express();
require('colors');

// Mongoose Connection
connectDB()

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
    credentials: true
}))

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Static Pages
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")))
    app.use('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
} else {
    app.use('/', (req, res) => {
        res.send("Api Working")
    })
}

// Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(
        `Server running on ${process.env.NODE_ENV} mode in PORT ${PORT}`.yellow.bold
    )
);
