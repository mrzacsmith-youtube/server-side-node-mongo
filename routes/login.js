const { model } = require('mongoose')

const router = require('express').Router()
const User = require('../models/User.js')

router.post('/', (req, res, next) => {
  const email = req.body.email
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return next(err)
    }

    // check user = null, then send to error handler
    if (user == null) {
      return next(new Error('User and/or password is incorrect.'))
    }

    // check password
    if (user.password != req.body.password) {
      return next(new Error('User and/or password is incorrect.'))
    }

    res.json({
      confirmation: 'success',
      user: user,
    })
  })
})

module.exports = router
