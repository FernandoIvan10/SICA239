// imports
const express = require('express')
const path = require('path')
const conectarBD = require('./config/db')
const authRoutes = require('./routes/auth.routes')

// Conexión a la base de datos
conectarBD();

// variables
const app = express() // Instancia de express
const puerto = 3000 // Puerto del servidor

app.use(express.json()) // El servidor acepta solicitudes JSON

app.use(express.static(path.join(__dirname, 'dist'))) // Sirve los archivos del frontend

// Ruta para las autenticaciones
app.use('/api/auth', authRoutes)

// Se sirven las rutas de React para las demás rutas
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Iniciar el servidor
app.listen(puerto, () => {});