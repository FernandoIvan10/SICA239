// imports
const express = require('express')
const path = require('path')

// variables
const app = express() // Instancia de express
const puerto = 3000 // Puerto del servidor

app.use(express.json()) // El servidor acepta solicitudes JSON

app.use(express.static(path.join(__dirname, 'client', 'build'))) // Sirve los archivos del frontend

// Se sirven las rutas de React para las demás rutas
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

// Iniciar el servidor
app.listen(puerto, () => {});