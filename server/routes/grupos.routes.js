const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    crearGrupo,
    actualizarGrupo,
    obtenerGrupos,
    eliminarGrupo,
    migrarAlumnos,
    obtenerGrupoPorId
} = require('../controllers/grupos.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router
    .route('/')
        .post( // Agregar grupo
            verificarRol(['superadmin', 'editor']),
            crearGrupo
        )
        .get( // Listar grupos
            verificarRol(['superadmin','editor','lector']),
            obtenerGrupos
        )

router
    .route('/:id')
        .get( // Obtener grupo por ID
            verificarRol(['superadmin','editor']),
            obtenerGrupoPorId
        )
        .put( // Modificar grupo
            verificarRol(['superadmin', 'editor']),
            actualizarGrupo
        )
        .delete( // Eliminar grupo
            verificarRol(['superadmin', 'editor']),
            eliminarGrupo
        )

router.post( // Migrar alumnos entre grupos
    '/:id/migraciones',
    verificarRol(['superadmin', 'editor']),
    migrarAlumnos
)

module.exports = router