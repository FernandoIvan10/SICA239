// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {agregarAlumno, modificarAlumno, listarAlumnos} = require('../controllers/alumnos.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar un alumno (solo para "superadmin")
router.post(
    '/alumnos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAlumno // Se llama al controlador
)

// Ruta para modificar un usuario alumno (solo para "superadmin")
router.put(
    '/alumnos/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    modificarAlumno // Se llama al controlador
)

// Ruta para listar alumnos (sólo para administradores)
router.get(
    '/alumnos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    listarAlumnos // Se llama al controlador
)

module.exports = router // Se exporta el router