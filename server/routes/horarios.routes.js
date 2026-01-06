const express = require('express')
const upload = require('../middleware/upload')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { 
    subirHorario,
    eliminarHorario,
    listarHorarios,
} = require('../controllers/horarios.controller')

const router = express.Router()

router.use(verificarToken) // Todas las rutas requieren autenticación

router
    .route('/')
        .post( // Agregar horario
            verificarRol(['superadmin', 'editor']),
            upload.single('imagen'),
            subirHorario
        )
        .get( // Listar horarios
            verificarRol(['superadmin','editor','lector']),
            listarHorarios
        )

router.delete( // Eliminar horario
    '/:id',
    verificarRol(['superadmin', 'editor']),
    eliminarHorario
)

module.exports = router