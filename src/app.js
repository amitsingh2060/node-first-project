const express = require('express')
const app = express();

// req handler
app.get('/user', (req, res) => {
    res.send("get method")
})
app.post('/user', (req, res) => {
    res.send("get method")
})

app.delete('/user', (req, res) => {
    res.send("get method")
})
app.use('/', (req, res) => {
    res.send('from server')
})

app.use('/Hello', (req, res) => {
    res.send('hello ...from server')
})
app.listen(3000, () => {
    console.log("Server is running ");
})