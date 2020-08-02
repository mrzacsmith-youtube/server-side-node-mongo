const router = require('express').Router()
const Mailgun = require('mailgun-js')
const Item = require('../models/Item')
const User = require('../models/User')

const randomString = (length) => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiljklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

router.get('/', (req, res, next) => {
  const user = req.user

  if (user == null) {
    res.redirect('/')
    return
  }

  Item.find(null, (err, items) => {
    if (err) return next(err)

    Item.find({ interested: user._id }, (err, interestedItems) => {
      if (err) return next(err)

      const data = {
        user: user,
        items: items,
        interested: interestedItems,
      }

      res.render('account', data)
    })
  })
})

router.get('/additem/:itemid', (req, res) => {
  const user = req.user
  if (user == null) {
    res.redirect('/')
    return
  }

  Item.findById(req.params.itemid, (err, item) => {
    if (err) {
      return next(err)
    }

    if (item.interested.indexOf(user.id) == -1) {
      item.interested.push(user._id)
      item.save()
      res.redirect('/account')
    }
  })
})

router.get('/removeitem/:itemid', (req, res) => {
  const user = req.user
  if (user == null) {
    res.redirect('/')
    return
  }
  Item.findById(req.params.itemid, (err, item) => {
    if (err) {
      return next(err)
    }
    if (item.interested.indexOf(user.id) == -1) {
      item.interested.pop(user._id)
      // item.interested.remove(user._id)
      // item.save()
      // res.redirect('/')
    }
  })
})

router.post('/resetpassword', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err)

    if (user == null) {
      res.redirect('/')
      return
    }

    user.nonce = randomString(12)
    user.passwordResetTime = new Date()
    user.save()

    const mailgun = Mailgun({
      apiKey: process.env.API_KEY,
      domain: process.env.DOMAIN,
    })

    const data = {
      from: 'Node Store <zrs3141592@gmail.com>',
      to: req.body.email,
      // sender: 'Node Store',
      subject: 'Password Reset Request',
      html: `Please click <a style="color:red;" href="http://localhost:5005/account/password-reset?nonce=${user.nonce}&id=${user._id}">HERE</a> to reset your password. This link is good for 24 hours only!`,
    }

    mailgun.messages().send(data, (error, body) => {
      if (err) {
        return next(err)
      }
      console.log(
        'mailgun should be sending ' +
          req.body.email +
          ' email now!\nWith a body of ' +
          body
      )
      res.json({
        confirmation: 'success',
        data: 'Reset password',
        user: user,
      })
    })
  })
})

router.get('/password-reset', (req, res, next) => {
  const nonce = req.query.nonce
  if (nonce == null) {
    return next(new Error('Invalid request'))
  }
  const user_id = req.query.id
  if (user_id == null) {
    return next(new Error('Invalud request'))
  }

  User.findById(user_id, (err, user) => {
    if (err) {
      return next(new Error('Invalid Request'))
    }

    if (user.passwordResetTime == null) {
      return next(new Error('Invalid Request'))
    }

    if ((user.nonce = null)) {
      return next(new Error('Invalid Request'))
    }

    console.log('nonce: ' + nonce)
    console.log('user.nonce: ' + user.nonce)
    // if (user.nonce !== nonce) {
    //   return next(new Error('Invalid Request N'))
    // }

    const now = new Date()
    const diff = now - user.passwordResetTime
    const seconds = diff / 1000

    if (seconds > 24 * 60 * 60) {
      return next(new Error('Invalid Request'))
    }

    // render the reset password page
    const data = {
      id: user_id,
      nonce: nonce,
    }
    res.render('password-reset', data)

    // res.json({
    //   user: user,
    // })
  })
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
