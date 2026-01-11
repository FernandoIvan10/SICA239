require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {autenticarUsuario} = require('../services/auth.service')

// Función que valida el inicio de sesión
const iniciarSesion = async(req,res)=>{
    try{
        const payload = {
            tipoUsuario: req.body.tipoUsuario,
            usuario: req.body.usuario,
            contrasena: req.body.contrasena
        }

        const resultado = await autenticarUsuario(payload)
        res.status(200).json({resultado}) 
    }catch(error){
        switch (error.code) {
            case 'TIPO_USUARIO_INVALIDO':
                return res.status(400).json({ message: error.message })
            case 'CREDENCIALES_INVALIDAS':
                return res.status(401).json({ message: error.message })
            case 'USUARIO_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            default:
                console.error(error)
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

module.exports = {iniciarSesion}