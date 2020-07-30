const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
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

        // check password and compare hash
        if (bcrypt.compareSync(password, user.password) == false)
          return next(new Error('Incorrect password'))

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

        // create new user and hash password
        const hashPassword = bcrypt.hashSync(password, 10)
        let isAdmin = false
        if (email.indexOf('@lambdastudents.com') != -1) isAdmin = true
        User.create(
          { email: email, password: hashPassword, isAdmin: isAdmin },
          (err, user) => {
            if (err) return next(err)

            return next(null, user)
          }
        )
      })
    }
  )
  passport.use('localRegister', localRegister)
}
