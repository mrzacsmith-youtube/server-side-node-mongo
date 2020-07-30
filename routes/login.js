const { model } = require('mongoose')
const passport = require('passport')
const router = require('express').Router()

router.post(
  '/',
  passport.authenticate('localLogin', {
    successRedirect: '/account',
  })
)

module.exports = router
