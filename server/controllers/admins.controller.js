// imports
const Administrador = require('../models/administrador.model')
const bcrypt = require('bcrypt')

// Función que agrega un nuevo usuario administrador
const agregarAdmin = async(req,res)=>{
    try{
        const {rfc, nombre, apellido, contrasena, rol, requiereCambioContrasena = true} = req.body

        // Valida que todos los campos estén rellenados
        if(!rfc || !nombre || !contrasena || !rol){
            return res.status(400).json({mensaje:"Faltan campos obligatorios."})
        }

        // Valida que el admin no exista
        const existeAdmin = await Administrador.findOne({rfc})
        if(existeAdmin){
            return res.status(400).json({mensaje:"El RFC ingresado ya se encuentra registrado en el sistema."})
        }

        // Se crea el nuevo admin
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
        const nuevoAdmin = new Administrador({
            rfc,
            nombre,
            apellido,
            contrasena: contrasenaEncriptada,
            rol,
            requiereCambioContrasena
        })

        await nuevoAdmin.save() // Se guarda el nuevo admin
        return res.status(201).json({mensaje:"Administrador creado exitosamente."})
    }catch(error){
        console.error('Error al agregar al administrador:',error)
        return res.status(500).json({mensaje:"Error interno del servidor."})
    }
}

// Función para modificar un administrador
const modificarAdmin = async (req, res) => {
    try {
        const { id } = req.params // ID del administrador a modificar
        const { nombre, apellido, rol } = req.body

        // Valida que el ID sea proporcionado
        if (!id) {
            return res.status(400).json({ mensaje: 'El ID del administrador es obligatorio.' })
        }

        // Valida que el administrador exista
        const adminExistente = await Administrador.findById(id)
        if (!adminExistente) {
            return res.status(404).json({ mensaje: 'No existe el administrador especificado.' })
        }

        // Se actualizan sólo los campos proporcionados
        if (nombre) adminExistente.nombre = nombre
        if (apellido) adminExistente.apellido = apellido
        if (rol) adminExistente.rol = rol

        // Se guardan los cambios en la base de datos
        await adminExistente.save()

        return res.status(200).json({ 
            mensaje: 'Administrador modificado exitosamente.',
            admin: adminExistente 
        })
    } catch (error) {
        console.error('Error al modificar el administrador:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para listar todos los admins con opciones de filtros
const listarAdmins = async (req, res) => {
    try {
        const { buscador, rol } = req.query // Filtro por búsqueda y por rol

        let query = {} // Consulta

        // Búsqueda por texto
        if (buscador) {
            query.$or = [
                { nombre: { $regex: buscador, $options: 'i' } }, // Búsqueda por nombre
                { apellido: { $regex: buscador, $options: 'i' } }, // Búsqueda por apellido
                { rfc: { $regex: buscador, $options: 'i' } } // Búsqueda por RFC
            ]
        }

        // Filtro por rol
        if (rol) {
            query.rol = rol
        }

        // Se ejecuta la consulta
        const admins = await Administrador.find(query).select('-contrasena'); // Se excluye la contraseña en la consulta
        return res.status(200).json(admins)
    } catch (error) {
        console.error('Error al listar administradores:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para obtener un administrador por ID
const obtenerAdminPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Administrador.findById(id)
            .select('-contrasena') // No enviar contraseña

        if (!admin) { // Valida que el administrador exista
            return res.status(404).json({ mensaje: 'Administrador no encontrado.' })
        }
        return res.status(200).json(admin)
    } catch (error) {
        console.error('Error al obtener el administrador:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña por primera vez
const primerCambioContrasenaAdministrador = async (req, res) => {
    try {
        const { nuevaContrasena } = req.body
        const { usuarioId } = req.params

        if (!nuevaContrasena || nuevaContrasena.length < 6) { // Validaciones de la contraseña
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' })
        }

        const admin = await Administrador.findById(usuarioId)
        if (!admin) { // Valida que el administrador exista
            return res.status(404).json({ mensaje: 'Administrador no encontrado.' })
        }

        admin.contrasena = await bcrypt.hash(nuevaContrasena, 10)
        admin.requiereCambioContrasena = false
        await admin.save()

        return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' })
    } catch (error) {
        console.error('Error al cambiar contraseña del administrador:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña
const cambiarContrasena = async (req, res) => {
    try{const {contrasenaAntigua, contrasenaNueva} = req.body
        const {usuarioId} = req.params

        if(!contrasenaAntigua || !contrasenaNueva){ // Valida que las contraseñas sean ingresadas
            return res.status(400).json({mensaje: 'Se requiere la antigua y la nueva contraseña.'})
        }

        const administrador = await Administrador.findById(usuarioId)
        if (!administrador) { // Valida que el administrador exista
            return res.status(404).json({ mensaje: 'Administrador no encontrado.' })
        }

        const esValido = await bcrypt.compare(contrasenaAntigua, administrador.contrasena)
        if(!esValido){ // Se valida que la contraseña antigua coincida
            return res.status(401).json({mensaje: 'Contraseña incorrrecta.'})
        }

        administrador.contrasena = await bcrypt.hash(contrasenaNueva, 10)
        await administrador.save()

        return res.status(200).json({ mensaje: 'Contraseña cambiada correctamente.' })
    }catch(error){
        console.error('Error al cambiar la contraseña: ', error)
        res.status(500).json({mensaje: 'Error interno del servidor.'})
    }
}

// Función para reiniciar la contraseña (Que la contraseña sea su RFC)
const reiniciarContrasena = async (req, res) => {
    try{
        const {id} = req.params
        
        const admin = await Administrador.findById(id)
        if(!admin){ // Valida que el administrador exista
            return res.status(404).json({ mensaje: 'Administrador no encontrado.' })
        }

        admin.contrasena = await bcrypt.hash(admin.rfc, 10)
        admin.requiereCambioContrasena = true
        admin.save()
        
        return res.status(200).json({mensaje: 'La contraseña ahora es el RFC del usuario.'})
    }catch(error){
        console.error('Error al reiniciar la contraseña: ', error)
        return res.status(500).json({mensaje:"Error interno del servidor."})
    }
}

module.exports = {
    agregarAdmin,
    modificarAdmin,
    listarAdmins,
    obtenerAdminPorID,
    primerCambioContrasenaAdministrador,
    cambiarContrasena,
    reiniciarContrasena
} // Se exporta el controlador