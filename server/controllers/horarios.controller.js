const Horario = require('../models/horario.model');
const cloudinary = require('../config/cloudinary');

// Función para subir el horario de un grupo
const subirHorario = async (req, res) => {
  try {
    const { grupoId } = req.body
    const id = grupoId
    if (!id) return res.status(400).json({ mensaje: 'El ID del grupo es obligatorio.' }) // Se valida que se proporcione un ID
    if (!req.file) return res.status(400).json({ mensaje: 'No se subió ninguna imagen' }) // Se valida que se suba una imagen

    const resultado = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'horarios' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result)
        }
      )
      uploadStream.end(req.file.buffer);
    })

    // Guardar en la base de datos
    const nuevoHorario = new Horario({
      grupo: id,
      imagenUrl: resultado.secure_url,
      publicId: resultado.public_id,
    })

    await nuevoHorario.save()
    return res.status(201).json({ 
      mensaje: 'Horario subido exitosamente.',
      horario: nuevoHorario
    })
  } catch (error) {
    console.error('Error al subir horario:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

// Función para listar todos los horarios
const listarHorarios = async (req, res) => {
    try{
        const horarios = await Horario.find().populate('grupo', 'nombre')
        return res.status(200).json({horarios})
    }catch (error) {
        console.error('Error al obtener los horarios: ', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para eliminar un horario (imagen de Cloudinary)
const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({ mensaje: 'El ID del horario es obligatorio.' }) // Se valida que se proporcione un ID

        // Buscar el horario en la base de datos
        const horario = await Horario.findById(id);
        if (!horario) return res.status(404).json({ mensaje: 'Horario no encontrado.' }) // Se valida que el horario exista

        await cloudinary.uploader.destroy(horario.publicId)
        await Horario.findByIdAndDelete(id)

        return res.status(200).json({ mensaje: 'Horario eliminado correctamente.' })
    } catch (error) {
        console.error('Error al eliminar el horario:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

module.exports = { subirHorario, eliminarHorario, listarHorarios }