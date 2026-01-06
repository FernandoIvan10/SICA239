const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {cerrarSemestre} = require('../controllers/historialAcademico.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router.post( // Guardar historial académico
    '/',
    verificarRol(['superadmin']),
    cerrarSemestre
)

module.exports = router