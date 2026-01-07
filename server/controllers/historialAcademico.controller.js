const Calificacion = require('../models/calificacion.model')
const Historial = require('../models/historialAcademico.model')
const Materia = require('../models/materia.model')

// Función para cerrar el semestre y guardar los promedios en el historial académico
const cerrarSemestre = async (req, res) => {
    try {
        const calificaciones = await Calificacion.find()

        for (const cal of calificaciones) {
            const { alumnoId, materiaId, promedio } = cal

            if (promedio == null) continue // Ignorar si no hay promedio

            const materia = await Materia.findById(materiaId).lean()
            if (!materia) continue

            // Buscar o crear historial del alumno
            let historial = await Historial.findOne({ alumnoId })
            if (!historial) {
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
        }

        // Borra todas las calificaciones del semestre actual
        await Calificacion.deleteMany({})

        return res.status(200).json({ message: 'Semestre cerrado. Historial actualizado y calificaciones eliminadas.' })
    } catch (error) {
        console.error('Error al cerrar el semestre:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para obtener el historial académico de un alumno específico
const obtenerHistorialAcademicoPorID = async (req, res) => {
    try{
        const {id} = req.params

        const historial = await Historial.find({alumnoId: id}).populate("calificaciones.materiaId")

        if(!historial || historial.length===0){ // Valida que existan calificaciones en el historial
            return res.status(404).json({message: "Calificaciones no encontradas"})
        }

        return res.status(200).json(historial)
    }catch(error){
        console.error("Error al obtener las calificaciones: ", error)
        return res.status(500).json({message: "Error interno del servidor."})
    }
}

module.exports = { cerrarSemestre, obtenerHistorialAcademicoPorID }