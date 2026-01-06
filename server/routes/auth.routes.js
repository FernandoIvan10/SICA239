const express = require('express')
const router = express.Router()
const {loginController} = require('../controllers/auth.controller')

router.post('/login', loginController) // Inicio de sesión

module.exports = router