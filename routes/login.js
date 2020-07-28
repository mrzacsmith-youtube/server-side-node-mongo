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

    res.json({
      confirmation: 'success',
      user: users,
    })
  })
})

module.exports = router
