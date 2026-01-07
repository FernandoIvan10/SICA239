// imports
require('dotenv').config()
const express = require('express')
const path = require('path')
const conectarBD = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const adminsRoutes = require('./routes/admins.routes')
const alumnosRoutes = require('./routes/alumnos.routes')
const calificacionesRoutes = require('./routes/calificaciones.routes')
const gruposRoutes = require('./routes/grupos.routes')
const materiasRoutes = require('./routes/materias.routes')
const horariosRoutes = require('./routes/horarios.routes')
const historialAcademicoRoutes = require('./routes/historialAcademico.routes')

conectarBD() // Conexión a la base de datos

const app = express() // Instancia de express

app.use(express.json()) // middleware JSON

// Rutas de dominio público
app.use('/api/auth', authRoutes)
// Rutas de dominio privado
app.use('/api/admins', adminsRoutes)
app.use('/api/alumnos', alumnosRoutes)
app.use('/api/calificaciones', calificacionesRoutes)
app.use('/api/grupos', gruposRoutes)
app.use('/api/materias', materiasRoutes)
app.use('/api/horarios', horariosRoutes)
app.use('/api/historial-academico', historialAcademicoRoutes)

// Manejo de rutas no encontradas
app.use('/api', (req, res)=>{
    res.status(404).json({message: 'Ruta API no encontrada'})
})

// Se sirven las rutas de React en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
  })
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

module.exports = app