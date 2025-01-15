// imports
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const bcrypt = require('bcrypt')

// Función para agregar un nuevo alumno
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

// Función para modificar un alumno
const modificarAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        const { nombre, apellido, grupoNombre } = req.body;

        // Valida que el ID sea proporcionado
        if (!id) {
            return res.status(400).json({ mensaje: 'El ID del alumno es obligatorio.' })
        }

        // Valida que el alumno exista
        const alumnoExistente = await Alumno.findById(id)
        if (!alumnoExistente) {
            return res.status(404).json({ mensaje: 'Alumno no encontrado.' })
        }

        // Actualiza los campos proporcionados
        const actualizaciones = {}
        if (nombre) actualizaciones.nombre = nombre
        if (apellido) actualizaciones.apellido = apellido
        if (grupoNombre) {
            // Se valida que el nuevo grupo exista
            const grupoExistente = await Grupo.findOne({ nombre: grupoNombre })
            if (!grupoExistente) {
                return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
            }
            actualizaciones.grupoId = grupoExistente._id
        }

        // Se actualiza el alumno
        const alumnoActualizado = await Alumno.findByIdAndUpdate(id, actualizaciones, { new: true })

        return res.status(200).json({
            mensaje: 'Alumno actualizado exitosamente.',
            alumno: alumnoActualizado,
        })
    } catch (error) {
        console.error('Error al modificar el alumno:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para listar todos los alumnos, con opciones de filtros
const listarAlumnos = async (req, res) => {
    try {
        const { buscador, grupo, semestre } = req.query // Filtro por búsqueda

        let query = {} // Consulta

        // Búsqueda por texto
        if (buscador) {
            query.$or = [
                { matricula: { $regex: buscador, $options: 'i' } }, // Búsqueda por matrícula
                { nombre: { $regex: buscador, $options: 'i' } }, // Búsqueda por nombre
                { apellido: { $regex: buscador, $options: 'i' } }, // Búsqueda por apellido                
            ]
        }

        // Filtro por grupo
        if (grupo) {
            query.grupo = grupo
        }

        // Filtro por semestre
        if (semestre){
            query.semestre = semestre
        }

        // Se ejecuta la consulta
        const alumnos = await Alumno.find(query).select('-contraseña'); // Se excluye la contraseña en la consulta
        return res.status(200).json(alumnos)
    } catch (error) {
        console.error('Error al listar alumnos:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

module.exports = {agregarAlumno, modificarAlumno, listarAlumnos} // Se exporta el controlador