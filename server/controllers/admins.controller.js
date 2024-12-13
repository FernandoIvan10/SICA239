// imports
const Administrador = require('../models/administrador.model')
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
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

// Controlador para agregar un nuevo alumno
const agregarAlumno = async (req, res) => {
    try {
        const { matricula, nombre, apellido, contraseña, grupoId } = req.body

        // Valida que los campos estén rellenados
        if (!matricula || !nombre || !apellido || !contraseña || !grupoId) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
        }

        // Valida que el grupo exista
        const grupoExistente = await Grupo.findById(grupoId)
        if (!grupoExistente) {
            return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
        }

        // Valida que el usuario no exista
        const existeAlumno = await Alumno.findOne({ matricula })
        if (existeAlumno) {
            return res.status(400).json({ mensaje: 'El alumno ya existe.' })
        }

        // Se crea el nuevo alumno
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10)
        const nuevoAlumno = new Alumno({
            matricula,
            nombre,
            apellido,
            contraseña: contraseñaEncriptada,
            grupoId,
        })

        await nuevoAlumno.save() // Se guarda el nuevo alumno
        return res.status(201).json({ mensaje: 'Alumno creado exitosamente.' })
    } catch (error) {
        console.error('Error al agregar el alumno:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

module.exports = {agregarAdmin, agregarAlumno} // Se exporta el controlador