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

    console.log('email', req.body.email)

    const data = {
      to: req.body.email,
      from: 'Node Store',
      // sender: 'Node Store',
      subject: 'Password Reset Request',
      html: 'This is a test email',
    }

    mailgun.messages().send(data, (error, body) => {
      if (err) {
        return next(err)
      }
      console.log('mailgun should be sending ' + req.body.email + ' email now!')
      res.json({
        confirmation: 'success',
        data: 'Reset password',
        user: user,
      })
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
