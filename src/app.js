const express = require('express')
const connectDB = require('./config/database')
const app = express();
const User = require('./models/users')
app.use(express.json())

app.post('/signup', async (req, res) => {
    try {
        console.log("API called");
        const user = new User(req.body);
        const savedUser = await user.save();
        res.send("User added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

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

connectDB().then(() => {
    console.log("database connect");
    app.listen(3000, () => {
        console.log("Server is running ");
    })
}).catch(err => {
    console.log('not connected');
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
