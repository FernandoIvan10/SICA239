const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
const Horario = require('../models/horario.model')
const Alumno = require('../models/alumno.model')
const cloudinary = require('../config/cloudinary')

// Función para agregar un nuevo grupo
async function agregarGrupo(data){
    const {nombre, semestre, materias} = data

    if(
        !nombre
        || !semestre
        || !materias
        || materias.length === 0
    ){ // Todos los campos obligatorios deben ser proporcionados
        const error = new Error('Faltan campos obligatorios')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    const existe = await Grupo.findOne({nombre})
    if(existe){ // El nombre del grupo debe ser único
        const error = new Error('Nombre de grupo duplicado')
        error.code = 'NOMBRE_DUPLICADO'
        throw error
    }

    if (!Array.isArray(materias)) { // Las materias deben estar definidas en un Array 
        const error = new Error('Formato de materias inválido')
        error.code = 'FORMATO_INVALIDO_MATERIAS'
    }

    let materiasIds = []
    
    for (const m of materias) {
        const materiaNombre = m.nombre
        if (!materiaNombre) { // El nombre de la materia debe existir
            const error = new Error('Falta el nombre de la materia')
            error.code = 'CAMPOS_FALTANTES'
            throw error
        }
    
        let materia = await Materia.findOne({ nombre: materiaNombre })
        if (!materia) { // Si la materia no existe entonces se crea
            const nuevaMateria = new Materia({
                nombre: materiaNombre,
                semestre: semestre,
            })
            await nuevaMateria.save()
            materia = nuevaMateria
        }

        // Se agrega el ID de la materia a la lista de materias
        materiasIds.push(materia._id)
    }

    const nuevoGrupo = new Grupo({
        nombre,
        semestre,
        materias: materiasIds,
    })
    return await nuevoGrupo.save()
}

// Función para modificar un grupo
async function modificarGrupo(id, data){
    if(!id) { // El ID es obligatorio
        const error = new Error('ID de grupo es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const grupo = await Grupo.findById(id)
    if(!grupo){ // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    const {nombre, semestre, materias} = data

     if(
        !nombre
        && !semestre
        && (!materias || materias.length === 0)
    ){ // Debe haber al menos un campo para actualizar
        const error = new Error('No se proporcionaron campos para actualizar')
        error.code = 'SIN_CAMBIOS'
        throw error
    }
    
    // Actualiza los campos proporcionados
    const actualizaciones = {}
    if (nombre){
        const existe = await Grupo.findOne({nombre})
        if(existe){ // El nombre del grupo debe ser único
            const error = new Error('Nombre de grupo duplicado')
            error.code = 'NOMBRE_DUPLICADO'
            throw error
        }
        actualizaciones.nombre = nombre
    } 
    if (semestre) actualizaciones.semestre = semestre
    if (materias && materias.length > 0) {
        const calificaciones= await Calificacion.findOne({grupoId: id})
        if(calificaciones){ // No se puede modificar las materias si existen calificaciones
            const error = new Error('No se pueden modificar las materias porque el grupo tiene calificaciones registradas')
            error.code = 'CAMBIO_MATERIAS_NO_PERMITIDO'
            throw error
        }
    
        let materiasIds = []
        for (const materiaNombre of materias) {
            let materia = await Materia.findOne({ nombre: materiaNombre })
            if (!materia) { // Si la materia no existe entonces se crea
                const nuevaMateria = new Materia({ nombre: materiaNombre })
                await nuevaMateria.save()
                materiaExistente = nuevaMateria
            }
            materiasIds.push(materia._id)
        }
        actualizaciones.materias = materiasIds
    }
    
    return await Grupo.findByIdAndUpdate(id, actualizaciones, { new: true })
}

// Función para listar todos los grupos
async function listarGrupos(){
    return await Grupo.find()
        .populate('materias', 'nombre') //Se obtienen los nombres de las materias
        .exec()
}

// Función para consultar un grupo por ID
async function consultarGrupo(id){
    if(!id) { // El ID es obligatorio
        const error = new Error('ID de grupo es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const grupo = await Grupo.findById(id).populate('materias', 'nombre')

    if(!grupo){ // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    return grupo
}

// Función para eliminar un grupo
async function quitarGrupo(id){
    if(!id) { // El ID es obligatorio
        const error = new Error('ID de grupo es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const grupo = await Grupo.findById(id)
    if(!grupo){ // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    const calificaciones = await Calificacion.findOne({ grupoId: id })
    if (calificaciones) { // No se puede eliminar el grupo si hay calificaciones capturadas
        const error = new Error('No se puede eliminar el grupo porque tiene calificaciones registradas')
        error.code = 'ELIMINACION_NO_PERMITIDA'
        throw error
    }

    const alumno = await Alumno.findOne({ grupoId: id })
    const alumnoRecursando = await Alumno.findOne({'materiasRecursadas.grupo': id})
    if (alumno || alumnoRecursando) { // No se puede eliminar el grupo si hay alumnos registrados en él
        const error = new Error('No se puede eliminar el grupo porque tiene alumnos registrados')
        error.code = 'ELIMINACION_NO_PERMITIDA'
        throw error
    }
    
    const horario = await Horario.findOne({ grupo: id })
    if (horario) { // Si el grupo tiene un horario asignado este se elimina
        await cloudinary.uploader.destroy(horario.publicId) // Elimina la imagen de Cloudinary
        await Horario.findByIdAndDelete(horario._id) // Elimina el documento de la base de datos
    }
    
    return await Grupo.findByIdAndDelete(id)
}

// Función para migrar alumnos de un grupo a otro
async function cambiarGrupoAlumnos(data){
    const {grupoOrigen, grupoDestino, alumnos} = data

    if(!grupoOrigen || !grupoDestino || !alumnos){ // Todos los campos obligatorios deben ser proporcionados
        const error = new Error('Faltan campos obligatorios')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    if(!Array.isArray(alumnos)){ // Los alumnos deben estar en un Array
        const error = new Error('Formato de alumnos inválido')
        error.code = 'FORMATO_INVALIDO_ALUMNOS'
        throw error
    }

    const origenExiste = await Grupo.findById(grupoOrigen)
    const destinoExiste = await Grupo.findById(grupoDestino)

    if (!origenExiste || !destinoExiste) { // Los grupos deben existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    return await Alumno.updateMany(
            { _id: { $in: alumnos } },
            { $set: { grupoId: grupoDestino, materiasRecursadas: [] } },
        )
}

module.exports = {
    agregarGrupo,
    modificarGrupo,
    listarGrupos,
    quitarGrupo,
    cambiarGrupoAlumnos,
    consultarGrupo
}