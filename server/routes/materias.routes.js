// rutas/materias.routes.js
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { buscarMaterias } = require('../controllers/materias.controller')

const router = express.Router() // Se crea un router

// Ruta para buscar materias (Sólo para administradores)
router.get(
  '/',
  verificarToken, // Se valida la autenticación
  verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
  buscarMaterias // Se llama al controlador
)

module.exports = router // Se exporta el router
