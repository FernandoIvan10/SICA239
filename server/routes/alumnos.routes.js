// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {agregarAlumno, modificarAlumno, listarAlumnos, obtenerAlumnoPorID, obtenerAlumnosPorGrupo, primerCambioContrasenaAlumno, cambiarContrasena} = require('../controllers/alumnos.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar un alumno (solo para "superadmin" y "editor")
router.post(
    '/alumnos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    agregarAlumno // Se llama al controlador
)

// Ruta para listar alumnos (sólo para administradores)
router.get(
    '/alumnos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    listarAlumnos // Se llama al controlador
)

// Ruta para cambiar la contraseña de un alumno por primera vez
router.put(
    '/alumnos/primer-cambio-contrasena',
    verificarToken, // Se valida la autenticación
    primerCambioContrasenaAlumno // Se llama al controlador
)

// Ruta para cambiar la contraseña
router.put(
    '/alumnos/cambiar-contrasena',
    verificarToken, // Se valida la autenticación
    cambiarContrasena // Se llama al controlador
)

// Ruta para modificar un usuario alumno (solo para "superadmin" y "editor")
router.put(
    '/alumnos/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    modificarAlumno // Se llama al controlador
)

// Ruta para obtener un alumno con su ID (sólo para administradores)
router.get(
    '/alumnos/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    obtenerAlumnoPorID// Se llama al controlador
)

// Ruta para obtener los alumnos que toman materias con un grupo específico (sólo para "superadmin" y "editor")
router.get(
    '/alumnos/por-grupo/:grupoId',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    obtenerAlumnosPorGrupo // Se llama al controlador
)

module.exports = router // Se exporta el router