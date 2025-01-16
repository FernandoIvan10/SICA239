// imports
const express = require('express')
const path = require('path')
const conectarBD = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const adminsRoutes = require('./routes/admins.routes')
const alumnosRoutes = require('./routes/alumnos.routes')
const calificacionesRoutes = require('./routes/calificaciones.routes')
const gruposRoutes = require('./routes/grupos.routes')

// Conexión a la base de datos
conectarBD();

// variables
const app = express() // Instancia de express
const puerto = 3000 // Puerto del servidor

app.use(express.json()) // El servidor acepta solicitudes JSON

app.use(express.static(path.join(__dirname, '../client/dist'))) // Sirve los archivos del frontend

// Ruta para las autenticaciones
app.use('/api/auth', authRoutes)

// Rutas protegidas
app.use('/api', adminsRoutes)
app.use('/api', alumnosRoutes)
app.use('/api', calificacionesRoutes)
app.use('/api', gruposRoutes)

// Se sirven las rutas de React para las demás rutas
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

// Ruta pública (no necesita autenticación)
app.get('/public', (req, res) => {
    res.json({ mensaje: 'Esta ruta es pública y no requiere autenticación.' })
})

// Iniciar el servidor
app.listen(puerto, () => {});