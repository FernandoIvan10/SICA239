// imports
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Alumno = require('../models/alumno.model')
const Administrador = require('../models/administrador.model')
const bcrypt = require('bcrypt')

// Controlador que valida el inicio de sesión
const loginController = async(req,res)=>{
    try{
        const {tipoUsuario, usuario, contraseña} = req.body // Datos del formulario de login

        let user = null
        let rol = null

        // Se valida y asigna el usuario que intenta ingresar
        if(tipoUsuario==='alumno'){
            user = await Alumno.findOne({matricula:usuario})
            if(!user){ // Se valida que el usuario exista
                return res.status(404).json({message: 'Usuario no encontrado'})
            }
            rol = 'alumno'
        }else if(tipoUsuario==='administrador'){
            user = await Administrador.findOne({rfc:usuario})
            if(!user){ // Se valida que el usuario exista
                return res.status(404).json({message: 'Usario no encontrado'})
            }
            rol = user.rol
        }else{
            return res.status(400).json({message:'Tipo de usuario invalido'})
        }

        // Se valida que la contraseña sea correcta
        const esValido = await bcrypt.compare(contraseña, user.contraseña)
        if(!esValido){
            return res.status(401).json({message: 'Contraseña incorrecta'})
        }

        // Se genera un token de sesión
        const token = jwt.sign(
            {id:user._id, rol},
            process.env.CLAVE_SECRETA,
            {expiresIn:'3h'} // Tiempo de expiración
        )
        
        // Respuesta exitosa
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            tipoUsuario,
            nombre: user.nombre,
            apellido: user.apellido, 
        }) 
    }catch(error){
        res.status(500).json({message: 'Error al iniciar sesión', error})
    }
}

module.exports = {loginController} // Se exporta el controlador