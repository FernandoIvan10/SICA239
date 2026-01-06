const express = require('express')
const upload = require('../middleware/upload')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const { 
    subirHorario,
    eliminarHorario,
    listarHorarios,
    obtenerHorariosPorID 
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

router
    .route('/:id')
        .get( // Obtener un horario
            verificarRol(['alumno']),
            obtenerHorariosPorID
        )
        .delete( // Eliminar horario
            verificarRol(['superadmin', 'editor']),
            eliminarHorario
        )

module.exports = router