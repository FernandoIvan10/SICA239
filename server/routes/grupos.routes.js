const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    agregarGrupo,
    modificarGrupo,
    listarGrupos,
    eliminarGrupo,
    migrarAlumnos
} = require('../controllers/grupos.controller')
const {obtenerAlumnosPorGrupo} = require('../controllers/alumnos.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router
    .route('/')
        .post( // Agregar grupo
            verificarRol(['superadmin', 'editor']),
            agregarGrupo
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

router.get( // Obtener alumnos por grupo
    '/:id/alumnos',
    verificarRol(['superadmin', 'editor', 'lector']),
    obtenerAlumnosPorGrupo
)

module.exports = router