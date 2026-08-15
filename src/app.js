const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const app = express();
const User = require('./models/users')
const { toInt } = require('validator');
const authRouter = require('./routes/auth');
const profilerRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
app.use(express.json())
app.use(cookieParser())



app.use('/', authRouter)
app.use('/', profilerRouter);
app.use('/', requestRouter)



connectDB().then(() => {
    console.log("database connect");
    app.listen(3000, () => {
        console.log("Server is running ");
    })
}).catch(err => {
    console.log('not connected', err);
})

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   age: Number
// });

// const User = mongoose.model("User", userSchema);

// const user = new User({
//   firstName: "Amit",
//   age: 25
// });

// await user.save();
