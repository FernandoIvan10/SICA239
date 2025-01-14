// imports
const Administrador = require('../models/administrador.model')
const bcrypt = require('bcrypt')

// Controlador que agrega un nuevo usuario administrador
const agregarAdmin = async(req,res)=>{
    try{
        const {rfc, nombre, apellido, contraseña, rol} = req.body

        // Valida que todos los campos estén rellenados
        if(!rfc || !nombre || !contraseña || !rol){
            return res.status(400).json({message:"Faltan campos obligatorios"})
        }

        // Valida que el admin no exista
        const existeAdmin = await Administrador.findOne({rfc})
        if(existeAdmin){
            return res.status(400).json({message:"El administrador ya existe"})
        }

        // Se crea el nuevo admin
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10)
        const nuevoAdmin = new Administrador({
            rfc,
            nombre,
            apellido,
            contraseña: contraseñaEncriptada,
            rol,
        })

        await nuevoAdmin.save() // Se guarda el nuevo admin
        return res.status(201).json({message:"Administrador creado exitosamente"})
    }catch(error){
        console.error('Error al agregar al administrador:',error)
        return res.status(500).json({message:"Error interno del servidor"})
    }
}

// Controlador para modificar un administrador
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
            return res.status(404).json({ mensaje: 'El administrador especificado no existe.' })
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

// Controlador para listar todos los admins con opciones de filtros
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
        const admins = await Administrador.find(query).select('-contraseña'); // Se excluye la contraseña en la consulta
        return res.status(200).json(admins)
    } catch (error) {
        console.error('Error al listar administradores:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}


module.exports = {agregarAdmin, modificarAdmin, listarAdmins} // Se exporta el controlador