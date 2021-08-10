const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8081
dotenv.config()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.json('hello world')
})

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
