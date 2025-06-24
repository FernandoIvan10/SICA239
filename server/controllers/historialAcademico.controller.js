const Calificacion = require('../models/calificacion.model')
const Historial = require('../models/historialAcademico.model')

// Función para cerrar el semestre y guardar los promedios en el historial académico
const cerrarSemestre = async (req, res) => {
    try {
        const calificaciones = await Calificacion.find()

        for (const cal of calificaciones) {
            const { alumnoId, materiaId, promedio } = cal

            if (promedio == null) continue // Ignorar si no hay promedio

            // Buscar o crear historial del alumno
            let historial = await Historial.findOne({ alumnoId })

            if (!historial) {
                historial = new Historial({ alumnoId, calificaciones: [] })
            }

            const idx = historial.calificaciones.findIndex(
                c => c.materiaId.toString() === materiaId.toString()
            )

            if (idx !== -1) {
                // Sobrescribe si ya tiene la materia
                historial.calificaciones[idx].nota = promedio
            } else {
                // Agrega nueva entrada
                historial.calificaciones.push({ materiaId, nota: promedio })
            }

            await historial.save()
        }

        // Borra todas las calificaciones del semestre actual
        await Calificacion.deleteMany({})

        return res.status(200).json({ mensaje: 'Semestre cerrado. Historial actualizado y calificaciones eliminadas.' })
    } catch (error) {
        console.error('Error al cerrar el semestre:', error)
        return res.status(500).json({ mensaje: 'Error al cerrar el semestre.' })
    }
}

module.exports = { cerrarSemestre }