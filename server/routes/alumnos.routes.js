// imports
const express = require('express')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const router = express.Router() // Se crea un router

// Verifica el rol para ver el panel
router.get(
    '/panel',
    verificarToken,
    verificarRol(['alumno']),
    (req, res) => {
        res.json({ mensaje: 'Bienvenido al panel de estudiante.' })
    }
)

// Se exporta el router
module.exports = router