const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
const Horario = require('../models/horario.model')
const Alumno = require('../models/alumno.model')
const cloudinary = require('../config/cloudinary')

// Función para agregar un nuevo grupo
async function agregarGrupo(data){
    const {nombre, semestre, materias} = data

    if(!nombre
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

module.exports = {
    agregarGrupo
}