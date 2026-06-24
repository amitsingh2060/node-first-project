const express = require('express')
const app = express();

// req handler
app.use('/', (req, res) => {
    res.send('from server')
})

app.use('/Hello', (req, res) => {
    res.send('hello ...from server')
})
app.listen(3000, () => {
    console.log("Server is running ");
})