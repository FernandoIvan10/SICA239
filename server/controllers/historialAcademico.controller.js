const { guardarHistorialAcademico } = require("../services/historialAcademico.service")

// Función para cerrar el semestre y guardar los promedios en el historial académico
const cerrarSemestre = async (req, res) => {
    try {
        await guardarHistorialAcademico()
        return res.status(200).json({ message: 'Semestre cerrado. Historial actualizado y calificaciones eliminadas' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno del servidor' })
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

module.exports = { 
    cerrarSemestre,
    obtenerHistorialAcademicoPorID
}