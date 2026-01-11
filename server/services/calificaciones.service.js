const Calificacion = require('../models/calificacion.model')

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
            p => p.parcial === parcialInput
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

    await calificacion.save()
}

module.exports = {
    capturarCalificacion
}