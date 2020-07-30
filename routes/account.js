const router = require('express').Router()

const items = [
  { name: 'Item 1', description: '', price: 10 },
  { name: 'Item 2', description: '', price: 20 },
  { name: 'Item 3', description: '', price: 15 },
  { name: 'Item 4', description: '', price: 9 },
  { name: 'Item 5', description: '', price: 44 },
]

router.get('/', (req, res, next) => {
  const user = req.user

  if (user == null) {
    res.redirect('/')
    return
  }

  const data = {
    user: user,
    items: items,
  }

  res.render('account', data)
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
