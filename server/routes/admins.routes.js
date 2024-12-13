// imports
const express = require('express')
const {agregarAlumno, agregarAdmin} = require('../controllers/admins.controller')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const router = express.Router() // Se crea un router

// Verfica el rol para ver el panel
router.get(
    '/panel',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin', 'editor', 'lector']), // Se valida el rol
    (req, res) => {
        res.json({ mensaje: 'Bienvenido al panel de administración.' })
    }
)

// Ruta para agregar un alumno (solo para "superadmin")
router.post(
    '/panel/alumnos/agregar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAlumno // Se llama al controlador
)

// Ruta para agregar un administrador (solo para "superadmin")
router.post(
    '/panel/admins/agregar',
    verificarToken, // Se valida la autenticación
    verificarRol(['superadmin']), // Se valida el rol
    agregarAdmin // Se llama al controlador
);

module.exports = router // Se exporta el router