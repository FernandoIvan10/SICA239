// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {agregarAdmin, modificarAdmin, listarAdmins, obtenerAdminPorID, primerCambioContrasenaAdministrador, cambiarContrasena} = require('../controllers/admins.controller')

const router = express.Router() // Se crea un router

// Ruta para agregar un administrador (solo para "superadmin")
router.post(
    '/admins',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAdmin // Se llama al controlador
)

// Ruta para listar administradores (solo para "superadmin")
router.get(
    '/admins',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    listarAdmins // Se llama al controlador
)

// Ruta para cambiar la contraseña de un administrador por primera vez
router.put(
    '/admins/primer-cambio-contrasena',
    verificarToken, // Se valida la autenticación
    primerCambioContrasenaAdministrador // Se llama al controlador
)

// Ruta para cambiar la contraseña
router.put(
    '/admins/cambiar-contrasena',
    verificarToken, // Se valida la autenticación
    cambiarContrasena // Se llama al controlador
)

// Ruta para modificar un usuario administrador (solo para "superadmin")
router.put(
    '/admins/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    modificarAdmin // Se llama al controlador
)

// Ruta para obtener un administrador con su ID (sólo para administradores)
router.get(
    '/admins/:id',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    obtenerAdminPorID// Se llama al controlador
)

module.exports = router // Se exporta el router