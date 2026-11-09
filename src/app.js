const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const authRouter = require('./routes/auth');
const profilerRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use(cors({
    origin: [
        "http://localhost:4000",
        "http://15.134.225.211"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profilerRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB().then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

}).catch(err => {
    console.log('Not connected', err);
});