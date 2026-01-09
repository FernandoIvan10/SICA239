const {agregarAlumno} = require('../services/alumnos.service')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
const bcrypt = require('bcrypt')

// Función para agregar un nuevo alumno
const crearAlumno = async (req, res) => {
    try {
        const payload = {
            matricula: req.body.matricula,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            contrasena: req.body.contrasena,
            grupoNombre: req.body.grupoNombre,
            materiasRecursadas: req.body.materiasRecursadas
        }

        await agregarAlumno(payload)
        return res.status(201).json({ message: 'Alumno creado' })
    } catch (error) {
        switch (error.code) {
            case 'CAMPOS_FALTANTES':
            case 'FORMATO_INVALIDO_MATERIAS_RECURSADAS':
                return res.status(400).json({ message: error.message })
            case 'GRUPO_NO_ENCONTRADO':
            case 'MATERIA_GRUPO_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            case 'MATRICULA_DUPLICADA':
                return res.status(409).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para modificar un alumno
const modificarAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        const { nombre, apellido, grupoNombre, materiasRecursadas } = req.body;

        // Valida que el ID sea proporcionado
        if (!id) {
            return res.status(400).json({ message: 'El ID del alumno es obligatorio.' })
        }

        // Valida que el alumno exista
        const alumnoExistente = await Alumno.findById(id)
        if (!alumnoExistente) {
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        // Actualiza los campos proporcionados
        const actualizaciones = {}
        if (nombre) actualizaciones.nombre = nombre
        if (apellido) actualizaciones.apellido = apellido
        if (grupoNombre) {
            // Se valida que el nuevo grupo exista
            const grupoExistente = await Grupo.findOne({ nombre: grupoNombre })
            if (!grupoExistente) {
                return res.status(404).json({ message: 'El grupo especificado no existe.' })
            }
            // Valida que el alumno no tenga calificaciones en el grupo anterior
            if (alumnoExistente.grupoId.toString() !== grupoExistente._id.toString()) {
                const tieneCalificaciones = await Calificacion.exists({
                    alumnoId: alumnoExistente._id,
                    grupoId: alumnoExistente.grupoId
                })
                if (tieneCalificaciones) {
                    return res.status(400).json({
                        message: 'No se puede cambiar el grupo del alumno porque tiene calificaciones registradas en su grupo actual.'
                    })
                }
            }
            if (materiasRecursadas) {
                // Se detectan cuáles materias recursadas han cambiado
                const actuales = alumnoExistente.materiasRecursadas.map(mr =>
                    `${mr.materia.toString()}-${mr.grupo.toString()}`
                )
                const nuevas = materiasRecursadas.map(mr =>
                    `${mr.materia}-${mr.grupo}`
                )
                const eliminadas = actuales.filter(mr => !nuevas.includes(mr))
                // Se valida que las materias eliminadas no tengan calificaciones
                for (const mr of eliminadas) {
                    const [materiaId, grupoId] = mr.split('-')
                    const tieneCalificaciones = await Calificacion.exists({
                        alumnoId: alumnoExistente._id,
                        grupoId,
                        materiaId
                    })
                    if (tieneCalificaciones) {
                        return res.status(400).json({
                            message: 'No se puede quitar o modificar una materia recursada con calificaciones registradas.'
                        })
                    }
                }
                actualizaciones.materiasRecursadas = materiasRecursadas
            }

            actualizaciones.grupoId = grupoExistente._id
        }

        // Se actualiza el alumno
        const alumnoActualizado = await Alumno.findByIdAndUpdate(id, actualizaciones, { new: true })

        return res.status(200).json({
            message: 'Alumno actualizado exitosamente.',
            alumno: alumnoActualizado,
        })
    } catch (error) {
        console.error('Error al modificar el alumno:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
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
        const alumnos = await Alumno.find(query)
            .select('-contrasena') // Se excluye la contraseña en la consulta
            .populate('grupoId', 'nombre') // Obtiene el nombre del grupo al que pertenece el alumno
        return res.status(200).json(alumnos)
    } catch (error) {
        console.error('Error al listar alumnos:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para obtener un alumno por ID
const obtenerAlumnoPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await Alumno.findById(id)
            .select('-contrasena') // No enviar contraseña

        if (!alumno) { // Se valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        return res.status(200).json(alumno)
    } catch (error) {
        console.error('Error al obtener el alumno:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

const obtenerAlumnosPorGrupo = async (req, res) => {
    try {
        const { grupoId } = req.params
        if (!grupoId) return res.status(400).json({ message: 'Se requiere el ID del grupo.' })

        // Alumnos con el grupo como grupo principal
        const alumnosGrupo = await Alumno.find({ grupoId, activo: true }, '-contrasena')

        // Alumnos que recursan materias en ese grupo, pero que no pertenecen al grupo
        const alumnosRecursando = await Alumno.find({ 
            'materiasRecursadas.grupo': grupoId,
            grupoId: { $ne: grupoId },
            activo: true
        }, '-contrasena')

        const alumnos = [...alumnosGrupo, ...alumnosRecursando]
        return res.status(200).json(alumnos)
    } catch (error) {
        console.error('Error al obtener alumnos por grupo:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña por primera vez
const primerCambioContrasenaAlumno = async (req, res) => {
    try {
        const { nuevaContrasena } = req.body
        const { id } = req.params

        if (!nuevaContrasena || nuevaContrasena.length < 6) { // Validaciones de la contraseña
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' })
        }

        const alumno = await Alumno.findById(id)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        alumno.contrasena = await bcrypt.hash(nuevaContrasena, 10)
        alumno.requiereCambioContrasena = false
        await alumno.save()

        return res.status(200).json({ message: 'Contraseña actualizada correctamente.' })
    } catch (error) {
        console.error('Error al cambiar contraseña del alumno:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña
const cambiarContrasena = async (req, res) =>{
    try{
        const {contrasenaAntigua, contrasenaNueva} = req.body
        const {id} = req.params

        if(!contrasenaAntigua || !contrasenaNueva){ // Valida que se hayan ingresado las contraseñas
            return res.status(400).json({message: 'Se requiere la antigua y la nueva contraseña.'})
        }

        const alumno = await Alumno.findById(id)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        const esValido = await bcrypt.compare(contrasenaAntigua, alumno.contrasena)
        if(!esValido){ // Valida que la contraseña antigua coincida
            return res.status(401).json({message: 'Contraseña incorrecta.'})
        }

        alumno.contrasena = await bcrypt.hash(contrasenaNueva, 10)
        await alumno.save()

        return res.status(200).json({ message: 'Contraseña cambiada correctamente.' })
    }catch(error){
        console.error('Error al cambiar la contraseña: ', error)
        res.status(500).json({message: 'Error interno del servidor.'})
    }
}

// Función para reiniciar la contraseña (Que la contraseña sea su Matrícula)
const reiniciarContrasena = async (req, res) => {
    try{
        const {id} = req.params
        
        const alumno = await Alumno.findById(id)
        if(!alumno){ // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        alumno.contrasena = await bcrypt.hash(alumno.matricula, 10)
        alumno.requiereCambioContrasena = true
        alumno.save()
        
        return res.status(200).json({message: 'La contraseña ahora es la matrícula del usuario.'})
    }catch(error){
        console.error('Error al reiniciar la contraseña: ', error)
        res.status(500).json({message: 'Error interno del servidor.'})
    }
}

// Función para cambiar el estado (activo) de un alumno
const cambiarEstado = async (req, res) => {
    try{
        const {id} = req.params

        const alumno = await Alumno.findById(id)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        alumno.activo = !alumno.activo
        await alumno.save()

        return res.status(200).json({ message: 'Estado cambiado correctamente.' })
    }catch(error){
        console.error('Error al cambiar el estado del alumno: ', error)
        res.status(500).json({message: 'Error interno del servidor.'})
    }
}

module.exports = {
    crearAlumno, 
    modificarAlumno, 
    listarAlumnos, 
    obtenerAlumnoPorID, 
    obtenerAlumnosPorGrupo, 
    primerCambioContrasenaAlumno, 
    cambiarContrasena,
    reiniciarContrasena,
    cambiarEstado
} // Se exporta el controlador 