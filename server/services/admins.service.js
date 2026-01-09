const Administrador = require('../models/administrador.model')
const bcrypt = require('bcrypt')

// Función para agregar un nuevo usuario administrador
async function agregarAdministrador(data) {
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

// Función para modificar un administrador
async function modificarAdministrador(id, data) {
    const admin = await Administrador.findById(id)
    if (!admin) { // El administrador debe existir
        const error = new Error('Administrador no encontrado')
        error.code = 'ADMINISTRADOR_NO_ENCONTRADO'
        throw error
    }

    const { nombre, apellido, rol } = data

    if(!nombre && !apellido && !rol){
        const error = new Error('No se proporcionaron campos para actualizar')
        error.code = 'SIN_CAMBIOS'
        throw error
    }

    // Se actualizan sólo los campos proporcionados
    if(nombre) admin.nombre = nombre
    if(apellido) admin.apellido = apellido
    if(rol) admin.rol = rol

    return admin.save()
}

// Función para listar todos los administradores con filtros opcionales
async function listarAdmins(data) {
    const { rol, buscador } = data

    let query = {} // Consulta

    if (buscador) { // Búsqueda por texto
        query.$or = [
            { nombre: { $regex: buscador, $options: 'i' } }, // Búsqueda por nombre
            { apellido: { $regex: buscador, $options: 'i' } }, // Búsqueda por apellido
            { rfc: { $regex: buscador, $options: 'i' } } // Búsqueda por RFC
        ]
    }

    if (rol) { // Filtro por rol
        query.rol = rol
    }

    return Administrador.find(query)
}

// Función para consultar un administrador por ID
async function consultarAdmin(id) {
    if(!id){ // El ID es obligatorio
        const error = new Error('ID del administrador es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const admin = await Administrador.findById(id)

    if(!admin){
        const error = new Error('Administrador no encontrado')
        error.code = 'ADMINISTRADOR_NO_ENCONTRADO'
        throw error
    }

    return admin
}

// Función para cambiar la contraseña por primera vez
async function cambiarPrimerContrasenaAdmin(id, data) {
    if(!id){ // El ID es obligatorio
        const error = new Error('ID del administrador es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const {contrasenaNueva} = data

    if(!contrasenaNueva){ // La nueva contraseña es obligatoria
        const error = new Error('La nueva contraseña es obligatoria')
        error.code = 'CONTRASENA_OBLIGATORIA'
        throw error
    }

    if(contrasenaNueva.length < 6){ // La contraseña debe tener al menos 6 caracteres
        const error = new Error('La nueva contraseña debe tener al menos 6 caracteres')
        error.code = 'CONTRASENA_INVALIDA'
        throw error
    }

    const admin = await Administrador.findById(id)
    if(!admin){ // El administrador debe existir
        const error = new Error('Administrador no encontrado')
        error.code = 'ADMINISTRADOR_NO_ENCONTRADO'
        throw error
    }

    if (!admin.requiereCambioContrasena) {
        const error = new Error('El administrador ya realizó el primer cambio de contraseña')
        error.code = 'CAMBIO_NO_PERMITIDO'
        throw error
    }

    admin.contrasena = await bcrypt.hash(contrasenaNueva, 10)
    admin.requiereCambioContrasena = false
    await admin.save()

    return admin
}

module.exports = {
    agregarAdministrador,
    modificarAdministrador,
    listarAdmins,
    consultarAdmin,
    cambiarPrimerContrasenaAdmin
}