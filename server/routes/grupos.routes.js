const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    crearGrupo,
    modificarGrupo,
    listarGrupos,
    eliminarGrupo,
    migrarAlumnos
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
            listarGrupos
        )

router
    .route('/:id')
        .put( // Modificar grupo
            verificarRol(['superadmin', 'editor']),
            modificarGrupo
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