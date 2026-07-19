const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express();
const User = require('./models/users')
const bcrypt = require('bcrypt');
const { validateSignup } = require('./utils/validation');
const { toInt } = require('validator');
const { userAuth } = require('./middlewares/auth');
app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    try {
        console.log("API called");
        // validation of data
        validateSignup(req)
        const { firstName, lastName, emailId, password } = req.body
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log("passwordHash", passwordHash);

        // Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();
        res.send("User added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Emaul is not in db")
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password");
        }
        // Create JWT
        // const token = jwt.sign(
        //     { _id: user._id, emailId: user.emailId },
        //     "mySecretKey",
        //     { expiresIn: '1d' }
        // )
        const token = user.getJWT();
        console.log("token", token);
        // Add the token to cookies and send respons to the user 
        res.cookie("token", token, {
            // httpOnly: true,
            // maxAge: 24 * 60 * 60 * 1000
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
        });
        return res.status(200).send("Login successful");
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + "Connectiion Request sent")
})
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
