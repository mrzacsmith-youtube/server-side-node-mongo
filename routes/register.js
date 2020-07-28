const router = require('express').Router()
const User = require('../models/User.js')

router.post('/', (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      res.json({
        confirmation: 'failed',
        error: err,
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
