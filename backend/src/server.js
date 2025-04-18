import 'dotenv/config'
import express from 'express'
const app = express()

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(PORT, (req, res) => {
    console.log(`Port at http://localhost:${PORT}`)
})