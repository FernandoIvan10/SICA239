// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {cerrarSemestre, obtenerHistorialAcademicoPorID} = require('../controllers/historialAcademico.controller')

const router = express.Router() // Se crea un router

// Ruta para cerrar el semestre (solo para "superadmin")
router.post(
    '/historial-academico',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    cerrarSemestre // Se llama al controlador
)

// Ruta para obtener el historial académico de un alumno
router.get(
    '/historial-academico/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['alumno']), // Se valida el rol
    obtenerHistorialAcademicoPorID // Se llama al controlador
)

module.exports = router // Se exporta el router