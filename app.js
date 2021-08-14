const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')
const passport = require('passport')
const flash = require('connect-flash')
const MemoryStore = require('memorystore')(session)
const { xss } = require('express-xss-sanitizer')
const helmet = require('helmet')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')

const app = express()
const PORT = process.env.PORT || 8081
dotenv.config()

const routes = require('./routes')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(helmet.xssFilter())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(flash())
app.use(hpp())
app.use(xss())
app.use(limiter)
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'Ben',
  cookie: { maxAge: 86400000 },
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: 86400000 })
}))
app.use((req, res, next) => {
  if (req.session.token) {
    req.headers.authorization = `Bearer ${req.session.token}`
    return next()
  }
  return next()
})
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.danger_msg = req.flash('danger_msg')
  return next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
