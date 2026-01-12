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

module.exports = { 
    cerrarSemestre
}