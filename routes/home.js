const router = require('express').Router()

router.get('/', (req, res) => {
  res.render('home', null)
})

module.exports = router
