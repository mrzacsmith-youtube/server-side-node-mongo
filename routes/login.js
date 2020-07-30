const { model } = require('mongoose')

const router = require('express').Router()
const User = require('../models/User.js')

router.post('/', (req, res, next) => {
  const email = req.body.email
  User.find({ email: email }, (err, users) => {
    if (err) {
      // res.json({
      //   confirmation: 'failed',
      //   error: err,
      // })
      return next(err)
    }

    if (users.length === 0) {
      // res.json({
      //   confirmation: 'failed',
      //   message: 'User and/or password is incorrect!',
      // })
      return next(new Error('User and/or password is incorrect.'))
    }

    const user = users[0]

    // check password

    if (user.password != req.body.password) {
      // res.json({
      //   confirmation: 'failed',
      //   message: 'User and/or password is incorrect.',
      // })
      return next(new Error('User and/or password is incorrect.'))
    }

    res.json({
      confirmation: 'success',
      user: user,
    })
  })
})

module.exports = router
