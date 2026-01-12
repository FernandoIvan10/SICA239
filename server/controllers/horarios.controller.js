const {
  subirHorario,
  listarHorarios,
  quitarHorario
} = require("../services/horarios.service")

// Función para subir el horario de un grupo
const crearHorario = async (req, res) => {
  try {
    const payload = {
      id : req.body.grupoId,
      file : req.file
    }

    await subirHorario(payload)
    return res.status(201).json({ message: 'Horario guardado' })
  } catch (error) {
    switch(error.code){
      case 'ID_OBLIGATORIO':
      case 'IMAGEN_OBLIGATORIA':
        return res.status(400).json({message: error.message})

      case 'GRUPO_NO_ENCONTRADO':
        return res.status(404).json({message: error.message})

      default:
        return res.status(500).json({message: 'Error interno del servidor'})
    }
  }
}

// Función para listar todos los horarios
const obtenerHorarios = async (req, res) => {
  try{
    const horarios = await listarHorarios()
    return res.status(200).json({horarios})
  }catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// Función para eliminar un horario
const eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params

    await quitarHorario(id)
    return res.status(200).json({ message: 'Horario eliminado' })
  } catch (error) {
    switch(error.code){
      case 'ID_OBLIGATORIO':
        return res.status(400).json({message: error.message})

      case 'HORARIO_NO_ENCONTRADO':
        return res.status(404).json({message: error.message})

      default:
        return res.status(500).json({message: 'Error interno del servidor'})
    }
  }
}

module.exports = { 
  crearHorario,
  eliminarHorario,
  obtenerHorarios
}