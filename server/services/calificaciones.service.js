const Calificacion = require('../models/calificacion.model')
const Alumno = require('../models/alumno.model')
const Materia = require('../models/materia.model')
const Grupo = require('../models/grupo.model')

// Función para capturar una nueva calificación
async function capturarCalificacion(data){
    const {
        alumnoId,
        materiaId,
        grupoId,
        parcial,
        nota
    } = data

    if (
        !alumnoId
        || !materiaId
        || !grupoId
        || !parcial
        || !nota
    ) { // Todos los campos obligatorios deben ser proporcionados
        const error = new Error('Faltan campos obligatorios')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    const alumnoExiste = await Alumno.findById(alumnoId)
    if(!alumnoExiste) { // El alumno debe existir
        const error = new Error('Alumno no encontrado')
        error.code = 'ALUMNO_NO_ENCONTRADO'
        throw error
    }

    const materiaExiste = await Materia.findById(materiaId)
    if(!materiaExiste) { // La materia debe existir
        const error = new Error('Materia no encontrada')
        error.code = 'MATERIA_NO_ENCONTRADA'
        throw error
    }

    const grupoExiste = await Grupo.findById(grupoId)
    if(!grupoExiste) { // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    if (nota < 0 || nota > 10) {
        const error = new Error('La nota es inválida')
        error.code = 'NOTA_INVALIDA'
        throw error
    }

    let calificacion = await Calificacion.findOne({
        alumnoId,
        materiaId,
        grupoId
    })

    if(!calificacion){ // Si la calificación no existe entonces se crea
        calificacion = new Calificacion({
            alumnoId,
            materiaId,
            grupoId,
            parciales: [{parcial: parcial, nota: Number(nota)}],
            promedio: Number(nota)
        })
    }else{ // Si la calificación existe entonces se actualiza
        const parcialExistente = calificacion.parciales.find(
            p => p.parcial === parcial
        )

        if(parcialExistente){
            parcialExistente.nota = Number(nota)
        }else{
            calificacion.parciales.push({parcial, nota})
        }
        // Recalcular promedio
        const suma = calificacion.parciales.reduce(
            (total, p) => total + p.nota,
            0
        )
        calificacion.promedio = Number(
            (suma/calificacion.parciales.length).toFixed(2)
        )
    }

    return await calificacion.save()
}

// Función para listar todas las calificaciones, con opciones de filtros
async function listarCalificaciones(data){
    const {alumnoId, materiaId, grupoId} = data

    // Se aplican los filtros en caso de que existan
    const query = {}
    if (grupoId) query.grupoId = grupoId
    if (alumnoId) query.alumnoId = alumnoId
    if (materiaId) query.materiaId = materiaId

    // Realiza la consulta con los filtros aplicados
    return await Calificacion.find(query)
        .populate('alumnoId', 'nombre apellido') // Incluye información del alumno
        .populate('materiaId', 'nombre') // Incluye información de la materia
        .populate('grupoId', 'nombre') // Incluye información del grupo
        .exec()
}

module.exports = {
    capturarCalificacion,
    listarCalificaciones
}