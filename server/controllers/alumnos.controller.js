// imports
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
const bcrypt = require('bcrypt')

// Función para agregar un nuevo alumno
const agregarAlumno = async (req, res) => {
    try {
        const { matricula, nombre, apellido, contrasena, grupoNombre, materiasRecursadas } = req.body

        // Valida que los campos obligatorios estén rellenados
        if (!matricula || !nombre || !apellido || !contrasena || !grupoNombre) {
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
            return res.status(400).json({ mensaje: 'La matrícula ingresada ya se encuentra registrada en el sistema.' })
        }

        // Valida que las materias recursadas tengan la estructura correcta
        if (materiasRecursadas && !Array.isArray(materiasRecursadas)) {
            console.error('materiasRecursadas debe ser un arreglo.')
            return res.status(500).json({ mensaje: 'Error interno del servidor.'})
        }
        if (materiasRecursadas && materiasRecursadas.some(m => !m.materia || !m.grupo)) {
            console.error('Cada materia recursada debe tener materia y grupo.')
            return res.status(500).json({ mensaje: 'Error interno del servidor.' })
        }
        if(materiasRecursadas){ // Se valida que las materias y los grupos existan
            for (const item of materiasRecursadas) {
                const materiaValida = await Materia.findById(item.materia)
                const grupoValido = await Grupo.findById(item.grupo)
                if (!materiaValida || !grupoValido) {
                    return res.status(404).json({ mensaje: 'No se encontró la materia o grupo a recursar.'})
                }
            }
        }

        // Se crea el nuevo alumno
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
        const nuevoAlumno = new Alumno({
            matricula,
            nombre,
            apellido,
            contrasena: contrasenaEncriptada,
            grupoId: grupoExistente._id,
            materiasRecursadas: materiasRecursadas
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

        const { nombre, apellido, grupoNombre, materiasRecursadas } = req.body;

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
                return res.status(404).json({ mensaje: 'El grupo especificado no existe.' })
            }
            // Valida que el alumno no tenga calificaciones en el grupo anterior
            if (alumnoExistente.grupoId.toString() !== grupoExistente._id.toString()) {
                const tieneCalificaciones = await Calificacion.exists({
                    alumnoId: alumnoExistente._id,
                    grupoId: alumnoExistente.grupoId
                })
                if (tieneCalificaciones) {
                    return res.status(400).json({
                        mensaje: 'No se puede cambiar el grupo del alumno porque tiene calificaciones registradas en su grupo actual.'
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
                            mensaje: 'No se puede quitar o modificar una materia recursada con calificaciones registradas.'
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
        const alumnos = await Alumno.find(query)
            .select('-contrasena') // Se excluye la contraseña en la consulta
            .populate('grupoId', 'nombre') // Obtiene el nombre del grupo al que pertenece el alumno
        return res.status(200).json(alumnos)
    } catch (error) {
        console.error('Error al listar alumnos:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para obtener un alumno por ID
const obtenerAlumnoPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await Alumno.findById(id)
            .select('-contrasena') // No enviar contraseña

        if (!alumno) { // Se valida que el alumno exista
            return res.status(404).json({ mensaje: 'Alumno no encontrado.' })
        }

        return res.status(200).json(alumno)
    } catch (error) {
        console.error('Error al obtener el alumno:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

const obtenerAlumnosPorGrupo = async (req, res) => {
    try {
        const { grupoId } = req.params
        if (!grupoId) return res.status(400).json({ mensaje: 'Se requiere el ID del grupo.' })

        // Alumnos con el grupo como grupo principal
        const alumnosGrupo = await Alumno.find({ grupoId }, '-contrasena')

        // Alumnos que recursan materias en ese grupo, pero que no pertenecen al grupo
        const alumnosRecursando = await Alumno.find({ 
            'materiasRecursadas.grupo': grupoId,
            grupoId: { $ne: grupoId }
        }, '-contrasena')

        const alumnos = [...alumnosGrupo, ...alumnosRecursando]
        return res.status(200).json(alumnos)
    } catch (error) {
        console.error('Error al obtener alumnos por grupo:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña por primera vez
const primerCambioContrasenaAlumno = async (req, res) => {
    try {
        const { nuevaContrasena } = req.body
        const { usuarioId } = req

        if (!nuevaContrasena || nuevaContrasena.length < 6) { // Validaciones de la contraseña
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' })
        }

        const alumno = await Alumno.findById(usuarioId)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ mensaje: 'Alumno no encontrado.' })
        }

        alumno.contrasena = await bcrypt.hash(nuevaContrasena, 10)
        alumno.requiereCambioContrasena = false
        await alumno.save()

        return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' })
    } catch (error) {
        console.error('Error al cambiar contraseña del alumno:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para cambiar la contraseña
const cambiarContrasena = async (req, res) =>{
    try{
        const {contrasenaAntigua, contrasenaNueva} = req.body
        const {usuarioId} = req

        if(!contrasenaAntigua || !contrasenaNueva){ // Valida que se hayan ingresado las contraseñas
            return res.status(400).json({mensaje: 'Se requiere la antigua y la nueva contraseña.'})
        }

        const alumno = await Alumno.findById(usuarioId)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ mensaje: 'Alumno no encontrado.' })
        }

        const esValido = await bcrypt.compare(contrasenaAntigua, alumno.contrasena)
        if(!esValido){ // Valida que la contraseña antigua coincida
            return res.status(401).json({mensaje: 'Contraseña incorrrecta.'})
        }

        alumno.contrasena = await bcrypt.hash(contrasenaNueva, 10)
        await alumno.save()

        return res.status(200).json({ mensaje: 'Contraseña cambiada correctamente.' })
    }catch(error){
        console.error('Error al cambiar la contraseña: ', error)
        res.status(500).json({mensaje: 'Error interno del servidor.'})
    }
}

// Función para reiniciar la contraseña (Que la contraseña sea su Matrícula)
const reiniciarContrasena = async (req, res) => {
    try{
        const {id} = req
        
        const alumno = await Alumno.findById(id)
        if(!alumno){ // Valida que el alumno exista
            return res.status(404).json({ mensaje: 'Alumo no encontrado.' })
        }

        alumno.contrasena = await bcrypt.hash(alumno.matricula, 10)
        alumno.requiereCambioContrasena = true
        alumno.save()
        
        return res.status(200).json({mensaje: 'La contraseña ahora es la matrícula del usuario.'})
    }catch(error){
        console.error('Error al reiniciar la contraseña: ', error)
        res.status(500).json({mensaje: 'Error interno del servidor.'})
    }
}

// Función para cambiar el estado (activo) de un alumno
const cambiarEstado = async (req, res) => {
    try{
        const {id} = req.params

        const alumno = await Alumno.findById(id)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ mensaje: 'Alumno no encontrado.' })
        }

        alumno.activo = !alumno.activo
        await alumno.save()

        return res.status(200).json({ mensaje: 'Estado cambiado correctamente.' })
    }catch(error){
        console.error('Error al cambiar el estado del alumno: ', error)
        res.status(500).json({mensaje: 'Error interno del servidor.'})
    }
}

module.exports = {
    agregarAlumno, 
    modificarAlumno, 
    listarAlumnos, 
    obtenerAlumnoPorID, 
    obtenerAlumnosPorGrupo, 
    primerCambioContrasenaAlumno, 
    cambiarContrasena,
    reiniciarContrasena,
    cambiarEstado
} // Se exporta el controlador