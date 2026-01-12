const { subirHorario } = require("../services/horarios.service")

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
const listarHorarios = async (req, res) => {
    try{
        const horarios = await Horario.find().populate('grupo', 'nombre')
        return res.status(200).json({horarios})
    }catch (error) {
        console.error('Error al obtener los horarios: ', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para eliminar un horario (imagen de Cloudinary)
const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({ message: 'El ID del horario es obligatorio.' }) // Se valida que se proporcione un ID

        // Buscar el horario en la base de datos
        const horario = await Horario.findById(id);
        if (!horario) return res.status(404).json({ message: 'Horario no encontrado.' }) // Se valida que el horario exista
        await cloudinary.uploader.destroy(horario.publicId)
        await Horario.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Horario eliminado correctamente.' })
    } catch (error) {
        console.error('Error al eliminar el horario:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para obtener los horarios de un alumno
const obtenerHorariosPorID = async (req, res) => {
  try{
    const {id} = req.params

    const alumno = await Alumno.findById(id)
    .populate('grupoId')
    .populate('materiasRecursadas.grupo')

    if(!alumno){ // Valida que el alumno exista
      return res.status(404).json({message: "Alumno no encontrado"})
    }
    
    if (!alumno.activo) { // Verifica que el alumno esté activo
      return res.status(403).json({ message: "No existe un horario asignado" })
    }

    const grupos = new Map()

    grupos.set(alumno.grupoId._id.toString(), alumno.grupoId.nombre)

    alumno.materiasRecursadas.forEach(({grupo}) => {
      if(grupo){
        grupos.set(grupo._id.toString(), grupo.nombre)
      }
    })

    const gruposIds = [...grupos.keys()]

    const horarios = await Horario.find({grupo: { $in: gruposIds}})

    const respuesta = horarios.map(horario => ({
      grupo: grupos.get(horario.grupo.toString()) || 'Grupo desconocido',
      imagenUrl: horario.imagenUrl
    }))

    return res.status(200).json(respuesta)
  }catch(error){
    console.error("Error al obtener los horarios:", error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { crearHorario, eliminarHorario, listarHorarios, obtenerHorariosPorID }