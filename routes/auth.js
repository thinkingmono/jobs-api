//Express router creation
const express = require('express')
const router = express()

//Import login and register controllers.
const { login, register } = require('../controllers/auth')

//Creating auth post routes for login and register.
router.post('/login', login)
router.post('/register', register)

//Export auth router.
module.exports = router