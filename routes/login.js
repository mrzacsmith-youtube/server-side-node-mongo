const { model } = require('mongoose')
const passport = require('passport')
const router = require('express').Router()
const User = require('../models/User.js')

router.post(
  '/',
  passport.authenticate('localLogin', {
    successRedirect: '/account',
  })
)

module.exports = router
