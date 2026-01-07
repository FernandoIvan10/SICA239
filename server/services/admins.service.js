const Administrador = require('../models/administrador.model')
const bcrypt = require('bcrypt')

async function crearAdministrador(data) {
    const { 
        rfc,
        nombre,
        apellido,
        contrasena,
        rol
    } = data

    if (
        !rfc 
        || !nombre 
        || !apellido 
        || !contrasena 
        || !rol
    ) { // Todos los campos obligatorios deben ser proporcionados
        const error = new Error('Campos obligatorios faltantes')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    const existe = await Administrador.findOne({ rfc })
    if (existe) { // Valida que no exista otro admin con el mismo RFC
        const error = new Error('RFC duplicado')
        error.code = 'RFC_DUPLICADO'
        throw error
    }

    const hash = await bcrypt.hash(contrasena, 10)

    return Administrador.create({
        ...data,
        contrasena: hash
    })
}

module.exports = {
    crearAdministrador
}