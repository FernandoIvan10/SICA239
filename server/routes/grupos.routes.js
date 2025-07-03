// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {agregarGrupo, modificarGrupo, listarGrupos, eliminarGrupo, migrarAlumnos} = require('../controllers/grupos.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar un grupo (para "superadmin" y "editor")
router.post(
    '/grupos',
    verificarToken, // Se valida la autenticación 
    verificarRol(['superadmin','editor']), // Se valida el rol
    agregarGrupo
)

// Ruta para listar los grupos (Sólo para administradores)
router.get(
    '/grupos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    listarGrupos // Se llama al controlador
)

// Ruta para migrar alumnos de un grupo a otro (para "superadmin" y "editor")
router.post(
    '/grupos/migrar-alumnos',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    migrarAlumnos // Se llama al controlador
)

// Ruta para modificar un grupo (para "superadmin" y "editor")
router.put(
    '/grupos/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    modificarGrupo // Se llama al controlador
)

// Ruta para eliminar un grupo (para "superadmin" y "editor")
router.delete(
    '/grupos/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    eliminarGrupo // Se llama al controlador
)

module.exports = router // Se exporta el router