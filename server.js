const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const helmet = require('helmet')
const morgan = require('morgan')

const homeRouter = require('./routes/home.js')
const registerRouter = require('./routes/register.js')
const loginRouter = require('./routes/login.js')

mongoose.connect(
  'mongodb://localhost/serverSide',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, data) => {
    if (err) {
      console.log('DB connection failed')
      return
    }
    console.log('DB connection successful')
  }
)

const app = express()
app.use(helmet())
app.use(
  session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hjs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', homeRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)

app.use((err, req, res, next) => {
  res.render('error', {
    message: err.message,
  })
})

const PORT = 5005
app.listen(PORT, () => {
  console.log(`\n** Server is listening at http://localhost:${PORT} **\n`)
})
