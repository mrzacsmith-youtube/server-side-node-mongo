const { model } = require('mongoose')

const router = require('express').Router()
const User = require('../models/User.js')

router.post('/', (req, res) => {
  const email = req.body.email
  User.find({ email: email }, (err, users) => {
    if (err) {
      res.json({
        confirmation: 'failed',
        error: err,
      })
      return
    }

    if (users.length === 0) {
      res.json({
        confirmation: 'failed',
        message: 'User not found',
      })
      return
    }

    const user = users[0]

    // check password

    if (user.password != req.body.password) {
      res.json({
        confirmation: 'failed',
        message: 'User and/or password is incorrect',
      })
      return
    }

    res.json({
      confirmation: 'success',
      user: user,
    })
  })
})

module.exports = router
