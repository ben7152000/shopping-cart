const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')

const app = express()
const PORT = process.env.PORT || 8081
dotenv.config()

const routes = require('./routes')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session({
  secret: 'Ben',
  name: 'Ben',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: true
}))

app.use(routes)

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
