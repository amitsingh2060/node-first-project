const express = require('express')
const connectDB = require('./config/database')
const app = express();
const User = require('./models/users')

app.post('/signup', async (req, res) => {
    try {
        console.log("API called");
        const user = new User({
            firstName: "Ashika",
            lastName: "Singh",
            emailId: "amitsingh@gmail.com",
            password: "amitdddd"
        });

        const savedUser = await user.save();
        console.log(savedUser);

        res.send("User added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

connectDB().then(() => {
    console.log("database connect");
    app.listen(3000, () => {
        console.log("Server is running ");
    })
}).catch(err => {
    console.log('not connected');
})
