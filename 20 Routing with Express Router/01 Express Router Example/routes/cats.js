/*
Example from https://expressjs.com/en/guide/routing.html
*/

var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Cats: Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.render('index', { title: 'COMP 2406', body: 'Cats Home Page'})
})
// define the about route
router.get('/about', function (req, res) {
  res.render('index', { title: 'COMP 2406', body: 'Cats About Page'})
})

module.exports = router
