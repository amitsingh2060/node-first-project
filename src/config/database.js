const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://amitsingh12385_db_user:5SUNyIbtXZraV7iw@amit.hvonxei.mongodb.net/LearnNode?retryWrites=true&w=majority&appName=LearnNode"
    );

    console.log("Connected DB:", mongoose.connection.name);
};

module.exports = connectDB;