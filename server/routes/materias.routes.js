const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { buscarMaterias } = require('../controllers/materias.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router.get( // Listar materias
  '/',
  verificarRol(['superadmin', 'editor', 'lector']),
  buscarMaterias
)

module.exports = router