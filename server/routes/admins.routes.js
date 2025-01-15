// imports
const express = require('express')
const {agregarAdmin, modificarAdmin, listarAdmins} = require('../controllers/admins.controller')
const {agregarAlumno, modificarAlumno, listarAlumnos} = require('../controllers/alumnos.controller')
const {agregarGrupo, modificarGrupo} = require('../controllers/grupos.controller')
const {agregarCalificacion, modificarCalificacion, listarCalificaciones} = require('../controllers/calificaciones.controller')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const router = express.Router() // Se crea un router

// Verfica el rol para ver el panel
router.get(
    '/panel',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    (req, res) => {
        res.json({ mensaje: 'Bienvenido al panel de administración.' })
    }
)

// Ruta para agregar un alumno (solo para "superadmin")
router.post(
    '/panel/alumnos/agregar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAlumno // Se llama al controlador
)

// Ruta para agregar un administrador (solo para "superadmin")
router.post(
    '/panel/admins/agregar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAdmin // Se llama al controlador
)

// Ruta para agregar un grupo (para "superadmin" y "editor")
router.post(
    '/panel/grupos/agregar',
    verificarToken, // Se valida la autenticación 
    verificarRol(['superadmin','editor']), // Se valida el rol
    agregarGrupo
)

// Ruta para agregar calificaciones (para "superadmin" y "editor")
router.post(
    '/panel/calificaciones/agregar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    agregarCalificacion // Se llama al controlador
)

// Ruta para modificar un usuario administrador (solo para "superadmin")
router.put(
    '/panel/admins/modificar/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    modificarAdmin // Se llama al controlador
)

// Ruta para modificar un usuario alumno (solo para "superadmin")
router.put(
    '/panel/alumnos/modificar/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    modificarAlumno // Se llama al controlador
)

// Ruta para modificar un grupo (para "superadmin" y "editor")
router.put(
    '/panel/grupos/modificar/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    modificarGrupo // Se llama al controlador
)

// Ruta para listar administradores (solo para "superadmin")
router.get(
    '/panel/admins/listar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    listarAdmins // Se llama al controlador
)

// Ruta para listar alumnos (sólo para administradores)
router.get(
    '/panel/alumnos/listar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    listarAlumnos // Se llama al controlador
)

// Ruta para modificar una calificación (para 'superadmin' y 'editor')
router.put(
    '/panel/calificaciones/modificar/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    modificarCalificacion // Se llama al controlador
)

// Ruta para listar las calificaciones (Sólo para administradores)
router.get(
    '/panel/calificaciones/listar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin','editor','lector']), // Se valida el rol
    listarCalificaciones // Se llama al controlador
)

module.exports = router // Se exporta el router