const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = (passport) => {
  passport.serializeUser((user, next) => {
    next(null, user)
  })

  passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
      next(err, user)
    })
  })

  const localLogin = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, next) => {
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
        return next(null, user)
      })
    }
  )

  passport.use('localLogin', localLogin)

  const localRegister = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, next) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return next(err)
        }

        if (user != null) {
          return next(new Error('User already exists, please log in!'))
        }

        // create new user
        User.create({ email: email, password: password }, (err, user) => {
          if (err) return next(err)

          return next(null, user)
        })
      })
    }
  )
  passport.use('localRegister', localRegister)
}
