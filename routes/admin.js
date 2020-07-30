const router = require('express').Router()

router.get('/', (req, res) => {
  const user = req.user
  if (user == null) {
    res.redirect('/')
    return
  }

  if (user.isAdmin == false) {
    res.redirect('/account')
    return
  }

  const data = {
    user: user,
  }

  res.render('admin', data)
})

module.exports = router
