const express = require('express')
const app = express()
const PORT = 8081

app.get('/', (req, res) => {
  res.json('hello world')
})

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
