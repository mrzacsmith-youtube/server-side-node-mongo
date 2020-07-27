const express = require('express')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')

const homeRouter = require('./routes/home.js')

const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hjs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', homeRouter)

const PORT = 5775
app.listen(PORT, () => {
  console.log(`\n** Server is listening at http://localhost:${PORT} **\n`)
})
