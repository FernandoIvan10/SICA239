// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { subirHorario, eliminarHorario, listarHorarios } = require('../controllers/horarios.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar un horario (para "superadmin" y "editor")
router.post(
    '/horarios',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    subirHorario // Se llama al controladr
)

// Ruta para listar los horarios (para administradores)
router.get(
    '/horarios',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    listarHorarios // Se llama al controlador
)

// Ruta para eliminar un horario (solo para "superadmin" y "editor")
router.delete(
    '/horarios/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor']), // Se valida el rol
    eliminarHorario // Se llama al controlador
)

module.exports = router // Se exporta el router