// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {agregarCalificacion, modificarCalificacion, listarCalificaciones} = require('../controllers/calificaciones.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar calificaciones (para "superadmin" y "editor")
router.post(
    '/calificaciones',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    agregarCalificacion // Se llama al controlador
)

// Ruta para listar las calificaciones (Sólo para administradores)
router.get(
    '/calificaciones',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin','editor','lector']), // Se valida el rol
    listarCalificaciones // Se llama al controlador
)

// Ruta para modificar una calificación (para 'superadmin' y 'editor')
router.put(
    '/calificaciones/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    modificarCalificacion // Se llama al controlador
)


module.exports = router // Se exporta el router