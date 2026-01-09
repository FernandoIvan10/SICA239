const { 
    agregarAdministrador, 
    modificarAdministrador, 
    listarAdmins,
    consultarAdmin,
    cambiarPrimerContrasenaAdmin,
    cambiarContrasena
} = require('../services/admins.service')

// Función para agregar un nuevo administrador
const crearAdmin = async(req, res) => {
    try{
        const payload = {
            rfc: req.body.rfc,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            contrasena: req.body.contrasena,
            rol: req.body.rol
        }
        
        await agregarAdministrador(payload)
        return res.status(201).json({message:"Administrador creado"})
    }catch(error){
        switch(error.code){
            case 'CAMPOS_FALTANTES':
                return  res.status(400).json({message: error.message})
            
            case 'RFC_DUPLICADO':
                return res.status(409).json({message: error.message})
            
            default:
                console.error(error)
                return res.status(500).json({message: 'Error interno del servidor'})
        }
    }
}

// Función para modificar un administrador
const actualizarAdmin = async (req, res) => {
    try {
        const { id } = req.params // ID del administrador a modificar
        const payload = { // Datos a modificar
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            rol: req.body.rol
        }

        await modificarAdministrador(id, payload);

        return res.status(200).json({ message: 'Administrador modificado' })
    } catch (error) {
        switch (error.code) {
            case 'ADMINISTRADOR_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            
            case 'SIN_CAMBIOS':
                return res.status(400).json({ message: error.message })
            
            default:
                console.error(error)
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para listar todos los admins con opciones de filtros
const obtenerAdmins = async (req, res) => {
    try {
        const payload = {
            rol: req.query.rol,
            buscador: req.query.buscador
        }

        const admins = await listarAdmins(payload)
        return res.status(200).json(admins)
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// Función para obtener un administrador por ID
const obtenerAdminPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await consultarAdmin(id)

        return res.status(200).json(admin)
    } catch (error) {
        switch (error.code) {
            case 'ID_OBLIGATORIO':
                return res.status(400).json({ message: error.message })
            case 'ADMINISTRADOR_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para cambiar la contraseña por primera vez
const actualizarContrasenaDefaultAdmin = async (req, res) => {
    try {
        const payload = {
            contrasenaNueva: req.body.contrasenaNueva
        }
        const { id } = req.params

        await cambiarPrimerContrasenaAdmin(id, payload)
        return res.status(200).json({ message: 'Contraseña actualizada' })
    } catch (error) {
        switch (error.code) {
            case 'ID_OBLIGATORIO':
            case 'CONTRASENA_OBLIGATORIA':
            case 'CONTRASENA_INVALIDA':
            case 'CAMBIO_NO_PERMITIDO':
                return res.status(400).json({ message: error.message })
            case 'ADMINISTRADOR_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para cambiar la contraseña
const actualizarContrasena = async (req, res) => {
    try{
        const payload = {
            contrasenaAntigua: req.body.contrasenaAntigua,
            contrasenaNueva: req.body.contrasenaNueva   
        }
        const {id} = req.params

        await cambiarContrasena(id, payload)
        return res.status(200).json({ message: 'Contraseña cambiada' })
    }catch(error){
        switch (error.code) {
            case 'ID_OBLIGATORIO':
            case 'CONTRASENA_OBLIGATORIA':
            case 'CONTRASENA_INVALIDA':
            case 'CAMBIO_NO_PERMITIDO':
            case 'CONTRASENA_INCORRECTA':
                return res.status(400).json({ message: error.message })
            case 'ADMINISTRADOR_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para reiniciar la contraseña (Que la contraseña sea su RFC)
const reiniciarContrasena = async (req, res) => {
    try{
        const {id} = req.params
        
        const admin = await Administrador.findById(id)
        if(!admin){ // Valida que el administrador exista
            return res.status(404).json({ message: 'Administrador no encontrado.' })
        }

        admin.contrasena = await bcrypt.hash(admin.rfc, 10)
        admin.requiereCambioContrasena = true
        admin.save()
        
        return res.status(200).json({message: 'La contraseña ahora es el RFC del usuario.'})
    }catch(error){
        console.error('Error al reiniciar la contraseña: ', error)
        return res.status(500).json({message:"Error interno del servidor."})
    }
}

module.exports = {
    crearAdmin,
    actualizarAdmin,
    obtenerAdmins,
    obtenerAdminPorID,
    actualizarContrasenaDefaultAdmin,
    actualizarContrasena,
    reiniciarContrasena
}