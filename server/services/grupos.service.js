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
    ){
        const error = new Error('Faltan campos obligatorios')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    const existe = Grupo.findOne({nombre})
    if(existe){ // El nombre debe ser único
        const error = new Error('Nombre de grupo duplicado')
        error.code = 'NOMBRE_DUPLICADO'
        throw error
    }

    if (!Array.isArray(materias)) { // Las materias deben estar definidas en un Array 
        const error = new Error('Formato de materias inválido')
        error.code = 'FORMATO_INVALIDO_MATERIAS'
    }

    let materiasIds = []
    
    for (const materia of materias) {
        const materiaNombre = materia.nombre
        if (!materiaNombre) { // El nombre de la materia debe existir
            const error = new Error('Falta el nombre de la materia')
            error.code = 'CAMPOS_FALTANTES'
            throw error
        }
    
        let materia = await Materia.findOne({ nombre: materiaNombre })
        if (!materia) { // Si no existe la materia entonces se crea
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
    await nuevoGrupo.save()
}

async function modificarGrupo(id, data){
    if(!id) { // El ID es obligatorio
        const error = new Error('ID de grupo es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const {nombre, semestre, materias} = data

     if(
        !nombre
        || !semestre
        || !materias
        || materias.length === 0
    ){
        const error = new Error('No se proporcionaron campos para actualizar')
        error.code = 'SIN_CAMBIOS'
        throw error
    }

    const grupo = await Grupo.findById(id)
    if(!grupo){ // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }
    
    // Actualiza los campos proporcionados
    const actualizaciones = {}
    if (nombre) actualizaciones.nombre = nombre
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
    
    await Grupo.findByIdAndUpdate(id, actualizaciones, { new: true })
}

module.exports = {
    agregarGrupo,
    modificarGrupo
}