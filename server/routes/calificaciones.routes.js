const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
    agregarCalificacion,
    listarCalificaciones,
} = require('../controllers/calificaciones.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router
    .route('/')
        .post( // Agregar calificaciones
            verificarRol(['superadmin', 'editor']),
            agregarCalificacion
        )
        .get( // Listar calificaciones
            verificarRol(['superadmin','editor','lector']),
            listarCalificaciones
        )

module.exports = router