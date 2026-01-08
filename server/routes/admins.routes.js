const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    agregarAdmin,
    modificarAdmin,
    obtenerAdmins,
    obtenerAdminPorID,
    primerCambioContrasenaAdministrador,
    cambiarContrasena,
    reiniciarContrasena
} = require('../controllers/admins.controller')

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(verificarToken)

router
    .route('/')
        .post( // Agregar nuevo administrador
            verificarRol(['superadmin']),
            agregarAdmin
        )
        .get( // Listar administradores
            verificarRol(['superadmin']),
            obtenerAdmins
        )

router
    .route('/:id')
        .put( // Modificar administrador
            verificarRol(['superadmin']),
            modificarAdmin
        )
        .get( // Obtener administrador
            verificarRol(['superadmin', 'editor', 'lector']),
            obtenerAdminPorID
        )

router.put( // Cambiar contraseña
    '/:id/contrasena',
    cambiarContrasena
)

router.put( // Primer cambio de contraseña
    '/:id/contrasena/primer-cambio',
    primerCambioContrasenaAdministrador
)

router.put( // Reiniciar contraseña
    '/:id/contrasena/reinicio',
    verificarRol(['superadmin']),
    reiniciarContrasena
)

module.exports = router