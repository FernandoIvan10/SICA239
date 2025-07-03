// imports
const express = require('express')
const router = express.Router()
const {loginController} = require('../controllers/auth.controller')

// Ruta para iniciar sesión
router.post('/login', loginController)

module.exports = router // Se exportan las rutas