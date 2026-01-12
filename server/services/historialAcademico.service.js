const Calificacion = require('../models/calificacion.model')
const Historial = require('../models/historialAcademico.model')
const Materia = require('../models/materia.model')

// Función para cerrar el semestre y guardar los promedios en el historial académico
async function guardarHistorialAcademico(){
    const calificaciones = await Calificacion.find()

    for (const cal of calificaciones) {
        const { alumnoId, materiaId, promedio } = cal
    
        if (promedio == null) continue // Ignorar si no hay promedio
    
        const materia = await Materia.findById(materiaId).lean()
        if (!materia) continue
    
        let historial = await Historial.findOne({ alumnoId })
        if (!historial) { // Si el alumno no tiene historial entonces se crea
            historial = new Historial({ alumnoId, calificaciones: [] })
        }

        const idx = historial.calificaciones.findIndex(
            c => 
                c.materiaId.toString() === materiaId.toString() &&
                c.semestre === materia.semestre
        )
    
        if (idx !== -1) {
            // Sobrescribe si ya tiene la materia
            historial.calificaciones[idx].nota = promedio
        } else {
            // Agrega nueva entrada
            historial.calificaciones.push({ materiaId, nota: promedio, semestre: materia.semestre })
        }
    
        await historial.save()
        await Calificacion.deleteMany({}) // Borra todas las calificaciones del semestre actual
    }
}

module.exports = {
    guardarHistorialAcademico
}