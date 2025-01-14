// imports
const Administrador = require('../models/administrador.model')
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
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
        const { matricula, nombre, apellido, contraseña, grupoNombre } = req.body

        // Valida que los campos estén rellenados
        if (!matricula || !nombre || !apellido || !contraseña || !grupoNombre) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
        }

        // Valida que el grupo exista
        const grupoExistente = await Grupo.findOne({ nombre: grupoNombre })
        if (!grupoExistente) {
            return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
        }

        // Valida que el alumno no exista
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
            grupoId: grupoExistente._id,
        })

        await nuevoAlumno.save(); // Guarda el nuevo alumno
        return res.status(201).json({ mensaje: 'Alumno creado exitosamente.' })
    } catch (error) {
        console.error('Error al agregar el alumno:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Controlador para agregar un nuevo grupo
const agregarGrupo = async (req, res) => {
    try {
        const { nombre, materias } = req.body

        // Valida que el campo nombre no esté vacío
        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre del grupo es obligatorio.' })
        }

        // Verifica que las materias estén definidas en un arreglo
        if (!materias || !Array.isArray(materias) || materias.length === 0) {
            return res.status(400).json({ mensaje: 'Debe proporcionar al menos una materia.' })
        }

        let materiasIds = []

        // Recorre la lista de materias
        for (const materia of materias) {
            const materiaNombre = materia.nombre
            if (!materiaNombre) { // Valida que el nombre de la materia no esté vacío
                return res.status(400).json({ mensaje: 'El nombre de cada materia es obligatorio.' })
            }

            // Valida que la materia no exista
            let materiaExistente = await Materia.findOne({ nombre: materiaNombre })

            if (!materiaExistente) {
                // Si no existe, crea una nueva materia
                const nuevaMateria = new Materia({
                    nombre: materiaNombre,
                })
                await nuevaMateria.save()
                materiaExistente = nuevaMateria
            }
            // Se agrega el ID de la materia a la lista
            materiasIds.push(materiaExistente._id)
        }

        // Crear el grupo
        const nuevoGrupo = new Grupo({
            nombre,
            materias: materiasIds,
        })

        await nuevoGrupo.save() // Guarda el grupo
        return res.status(201).json({ message: 'Grupo creado exitosamente con materias.', grupo: nuevoGrupo })
    } catch (error) {
        console.error('Error al agregar el grupo con materias:', error)
        return res.status(500).json({ menssage: 'Error interno del servidor.' })
    }
}

// Controlador para agregar una nueva calificación
const agregarCalificacion = async (req, res) => {
    try {
        const { alumnoId, materiaId, grupoId, parciales } = req.body

        // Validar que todos los campos obligatorios estén presentes
        if (!alumnoId || !materiaId || !grupoId || !parciales || parciales.length === 0) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
        }

        // Validar que el alumno exista
        const alumnoExistente = await Alumno.findById(alumnoId)
        if (!alumnoExistente) {
            return res.status(400).json({ mensaje: 'El alumno especificado no existe.' })
        }

        // Validar que la materia exista
        const materiaExistente = await Materia.findById(materiaId)
        if (!materiaExistente) {
            return res.status(400).json({ mensaje: 'La materia especificada no existe.' })
        }

        // Validar que el grupo exista
        const grupoExistente = await Grupo.findById(grupoId)
        if (!grupoExistente) {
            return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
        }

        // Validar que las notas sean válidas
        for (const parcial of parciales) {
            if (!parcial.parcial || typeof parcial.nota !== 'number' || parcial.nota < 0 || parcial.nota > 10) {
                return res.status(400).json({
                    mensaje: 'Cada parcial debe tener un nombre y una nota válida entre 0 y 10.',
                })
            }
        }

        // Calcular el promedio de las calificaciones
        const sumaNotas = parciales.reduce((acum, parcial) => acum + parcial.nota, 0)
        const promedio = sumaNotas / parciales.length

        // Crear la nueva calificación
        const nuevaCalificacion = new Calificacion({
            alumnoId,
            materiaId,
            grupoId,
            parciales,
            promedio,
        })

        await nuevaCalificacion.save() // Guardar en la base de datos

        return res.status(201).json({
            mensaje: 'Calificación agregada exitosamente.',
            calificacion: nuevaCalificacion,
        })
    } catch (error) {
        console.error('Error al agregar la calificación:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

module.exports = {agregarAdmin, agregarAlumno, agregarGrupo, agregarCalificacion} // Se exporta el controlador