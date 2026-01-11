require('dotenv').config()
const Alumno = require('../models/alumno.model')
const Administrador = require('../models/administrador.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function autenticarUsuario(data){
    const {tipoUsuario, usuario, contrasena} = data

    if(!tipoUsuario || !usuario || !contrasena){
        const error = new Error('Credenciales incompletas')
        error.code = 'CREDENCIALES_INVALIDAS'
        throw error
    }

    let user = null
    let rol = null

    // Se valida y asigna el usuario que intenta ingresar
    if(tipoUsuario==='alumno'){
        user = await Alumno.findOne({matricula:usuario})
        rol = 'alumno'
    }else if(tipoUsuario==='administrador'){
        user = await Administrador.findOne({rfc:usuario})
        rol = user.rol
    }else{ // El tipo de usuario debe ser válido
        const error = new Error('Tipo de usuario invalido')
        error.code = 'TIPO_USUARIO_INVALIDO'
        throw error
    }

    if(!user){ // El usuario debe existir
        const error = new Error('Usuario no encontrado')
        error.code = 'USUARIO_NO_ENCONTRADO'
        throw error
    }

    // Se valida que la contraseña sea correcta
    const esValido = await bcrypt.compare(contrasena, user.contrasena)
    if(!esValido){
        const error = new Error('Contraseña incorrecta')
        error.code('CREDENCIALES_INVALIDAS')
        throw error
    }

    // Se genera un token de sesión
    const token = jwt.sign(
        {id:user._id, rol, requiereCambioContrasena: user.requiereCambioContrasena},
        process.env.CLAVE_SECRETA,
        {expiresIn:'3h'} // Tiempo de expiración
    )

    return {
        message: 'Inicio de sesión exitoso',
        token,
        rol,
        nombre: user.nombre,
        apellido: user.apellido,
        requiereCambioContrasena: user.requiereCambioContrasena
    }
}

module.exports = {
    autenticarUsuario
}