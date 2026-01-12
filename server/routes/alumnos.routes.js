const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    crearAlumno,
    actualizarAlumno,
    obtenerAlumnos,
    obtenerAlumnoPorID,
    actualizarContrasenaDefaultAlumno,
    actualizarContrasena,
    restablecerContrasena,
    actualizarEstado,
    obtenerCalificacionesPorID,
    obtenerHistorialAcademicoPorID
} = require('../controllers/alumnos.controller')
const { obtenerHorariosPorID } = require('../controllers/horarios.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router.
    route('/')
        .post( // Agregar nuevo alumno
            verificarRol(['superadmin', 'editor']),
            crearAlumno
        )
        .get( // Listar alumnos
            verificarRol(['superadmin', 'editor', 'lector']),
            obtenerAlumnos
        )

router.
        route('/:id')
            .put( // Modificar alumno
                verificarRol(['superadmin', 'editor']),
                actualizarAlumno
            )
            .get( // Obtener alumno
                verificarRol(['superadmin', 'editor', 'lector']),
                obtenerAlumnoPorID
            )

router.put( // Cambiar contraseña
    '/:id/contrasena',
    actualizarContrasena
)

router.put( // Primer cambio de contraseña
    '/:id/contrasena/primer-cambio',
    actualizarContrasenaDefaultAlumno
)

router.put( // Reiniciar contraseña
    '/:id/contrasena/reinicio',
    verificarRol(['superadmin','editor']),
    restablecerContrasena
)

router.put( // Cambiar estado (activo/inactivo)
    '/:id/estado',
    verificarRol(['superadmin','editor']),
    actualizarEstado
)

router.get( // Obtener calificaciones de un alumno
    '/:id/calificaciones',
    verificarRol(['alumno']),
    obtenerCalificacionesPorID
)

router.get( // Obtener historial académico de un alumno
    '/:id/historial-academico',
    verificarRol(['alumno']),
    obtenerHistorialAcademicoPorID
)

router.get( // Obtener los horarios de un alumno
    '/:id/horarios',
    verificarRol(['alumno']),
    obtenerHorariosPorID
)

module.exports = router