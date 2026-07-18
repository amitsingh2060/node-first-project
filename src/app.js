const express = require('express')
const connectDB = require('./config/database')
const app = express();
const User = require('./models/users')
const bcrypt = require('bcrypt');
const { validateSignup } = require('./utils/validation')
app.use(express.json())

app.post('/signup', async (req, res) => {
    try {
        console.log("API called");
        // validation of data
        validateSignup(req)
        const { firstName, lastName, emailId, password } = req.body
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log("passwordHash", passwordHash);

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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password");
        }
        return res.status(200).send("Login successful");
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.get("/user", async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.find({ emailId: emailId })
        if (user.length === 0) {
            res.status(404).send('user not found')
        } else {
            res.send(user)
        }
    } catch {
        res.status(400).send("wrong")
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(404).send('something went wrong')
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        res.send("successful deleted")
    } catch (error) {
        res.status(400).send('not found')
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"]

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )
        if (!isUpdateAllowed) {
            throw new Error("update not allowed")
        }
        if (data.skills.length > 10) {
            throw new Error("can not be more then 10")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: 'after',
            runValidators: true
        })
        res.send("update successful")
    } catch (error) {
        res.status(400).send("UPDATE FAILED " + error.message)
    }
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
