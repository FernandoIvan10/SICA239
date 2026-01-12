const Horario = require('../models/horario.model')
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const cloudinary = require('../config/cloudinary')

// Función para subir el horario de un grupo
async function subirHorario(data){
    const {id, file} = data

    if(!id) { // El ID es obligatorio
        const error = new Error('ID de grupo es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }
    
    const grupo = await Grupo.findById(id)
    if(!grupo){ // El grupo debe existir
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    if (!file) { // La imagen es obligatoria
        const error = new Error('Imagen es obligatoria')
        error.code = 'IMAGEN_OBLIGATORIA'
        throw error
    }
    
    // La imagen se sube a cloudinary
    const resultado = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'horarios' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result)
        }
      )
      uploadStream.end(file.buffer);
    })

    // Guardar la url cloudinary en la base de datos
    const nuevoHorario = new Horario({
      grupo: id,
      imagenUrl: resultado.secure_url,
      publicId: resultado.public_id,
    })

    await nuevoHorario.save()
}

async function listarHorarios(){
    await Horario.find()
        .populate('grupo', 'nombre') // Se obtiene también el nombre del grupo
}

module.exports = {
    subirHorario,
    listarHorarios
}