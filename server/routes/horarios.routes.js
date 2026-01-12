const express = require('express')
const upload = require('../middleware/upload')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { 
    crearHorario,
    eliminarHorario,
    obtenerHorarios,
} = require('../controllers/horarios.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router
    .route('/')
        .post( // Agregar horario
            verificarRol(['superadmin', 'editor']),
            upload.single('imagen'),
            crearHorario
        )
        .get( // Listar horarios
            verificarRol(['superadmin','editor','lector']),
            obtenerHorarios
        )

router.delete( // Eliminar horario
    '/:id',
    verificarRol(['superadmin', 'editor']),
    eliminarHorario
)

module.exports = router