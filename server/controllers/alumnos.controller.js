const {
    agregarAlumno,
    modificarAlumno,
    listarAlumnos,
    consultarAlumno,
    cambiarPrimerContrasena,
    cambiarContrasenaAlumno
} = require('../services/alumnos.service')
const bcrypt = require('bcrypt')

// Función para agregar un nuevo alumno
const crearAlumno = async (req, res) => {
    try {
        const payload = {
            matricula: req.body.matricula,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            contrasena: req.body.contrasena,
            grupoNombre: req.body.grupoNombre,
            materiasRecursadas: req.body.materiasRecursadas
        }

        await agregarAlumno(payload)
        return res.status(201).json({ message: 'Alumno creado' })
    } catch (error) {
        switch (error.code) {
            case 'CAMPOS_FALTANTES':
            case 'FORMATO_INVALIDO_MATERIAS_RECURSADAS':
                return res.status(400).json({ message: error.message })
            case 'GRUPO_NO_ENCONTRADO':
            case 'MATERIA_GRUPO_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            case 'MATRICULA_DUPLICADA':
                return res.status(409).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para modificar un alumno
const actualizarAlumno = async (req, res) => {
    try {
        const { id } = req.params
        const payload = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            grupoNombre: req.body.grupoNombre,
            materiasRecursadas: req.body.materiasRecursadas
        }

        const alumnoActualizado = await modificarAlumno(id, payload)

        return res.status(200).json({
            message: 'Alumno modificado',
            alumno: alumnoActualizado,
        })
    } catch (error) {
        switch(error){
            case 'ID_OBLIGATORIO':
            case 'SIN_CAMBIOS':
                return res.status(400).json({message: error.message})
            case 'ALUMNO_NO_ENCONTRADO':
            case 'GRUPO_NO_ENCONTRADO':
                return res.status(404).json({message: error.message})
            case 'CAMBIO_GRUPO_NO_PERMITIDO':
            case 'ELIMINACION_MATERIA_NO_PERMITIDA':
                return res.status(409).json({message: error.message})
            default:
                return res.status(500).json({message: 'Error interno del servidor'})

        }
    }
}

// Función para listar todos los alumnos, con opciones de filtros
const obtenerAlumnos = async (req, res) => {
    try {
        const payload = { // Filtros de búsqueda
            buscador: req.query.buscador,
            grupo: req.query.grupo,
            semestre: req.query.semestre
        }

        const alumnos = await listarAlumnos(payload)    
        return res.status(200).json(alumnos)
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// Función para obtener un alumno por ID
const obtenerAlumnoPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await consultarAlumno(id)

        return res.status(200).json(alumno)
    } catch (error) {
        switch(error){
            case 'ID_OBLIGATORIO':
                res.status(400).json({message: error.message})
            case 'ALUMNO_NO_ENCONTRADO':
                res.status(404).json({message: error.message})
            default:
                return res.status(500).json({message: 'Error interno del servidor'})
        }
    }
}

// Función para cambiar la contraseña por primera vez
const actualizarContrasenaDefaultAlumno = async (req, res) => {
    try {
        const { id } = req.params
        const payload = {
            nuevaContrasena: req.body.nuevaContrasena
        }

        await cambiarPrimerContrasena(id, payload)
        return res.status(200).json({ message: 'Contraseña actualizada' })
    } catch (error) {
        switch(error){
            case 'ID_OBLIGATORIO':
            case 'CONTRASENA_OBLIGATORIA':
            case 'CONTRASENA_INVALIDA':
            case 'CAMBIO_NO_PERMITIDO':
                return res.status(400).json({message: error.message})
            case 'ALUMNO_NO_ENCONTRADO':
                return res.status(404).json({message: error.message})
            default:
                return res.status(500).json({message: 'Error interno del servidor'})
        }
    }
}

// Función para cambiar la contraseña
const actualizarContrasena = async (req, res) =>{
    try{
        const {id} = req.params
        const payload = {
            contrasenaAntigua: req.body.contrasenaAntigua,
            contrasenaNueva: req.body.contrasenaNueva
        }

        await cambiarContrasenaAlumno(id, payload)
        return res.status(200).json({ message: 'Contraseña cambiada' })
    }catch(error){
        switch (error.code) {
            case 'ID_OBLIGATORIO':
            case 'CONTRASENA_OBLIGATORIA':
            case 'CONTRASENA_INVALIDA':
            case 'CAMBIO_NO_PERMITIDO':
            case 'CONTRASENA_INCORRECTA':
                return res.status(400).json({ message: error.message })
            case 'ALUMNO_NO_ENCONTRADO':
                return res.status(404).json({ message: error.message })
            default:
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para reiniciar la contraseña (Que la contraseña sea su Matrícula)
const reiniciarContrasena = async (req, res) => {
    try{
        const {id} = req.params
        
        const alumno = await Alumno.findById(id)
        if(!alumno){ // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        alumno.contrasena = await bcrypt.hash(alumno.matricula, 10)
        alumno.requiereCambioContrasena = true
        alumno.save()
        
        return res.status(200).json({message: 'La contraseña ahora es la matrícula del usuario.'})
    }catch(error){
        console.error('Error al reiniciar la contraseña: ', error)
        res.status(500).json({message: 'Error interno del servidor.'})
    }
}

// Función para cambiar el estado (activo) de un alumno
const cambiarEstado = async (req, res) => {
    try{
        const {id} = req.params

        const alumno = await Alumno.findById(id)
        if (!alumno) { // Valida que el alumno exista
            return res.status(404).json({ message: 'Alumno no encontrado.' })
        }

        alumno.activo = !alumno.activo
        await alumno.save()

        return res.status(200).json({ message: 'Estado cambiado correctamente.' })
    }catch(error){
        console.error('Error al cambiar el estado del alumno: ', error)
        res.status(500).json({message: 'Error interno del servidor.'})
    }
}

module.exports = {
    crearAlumno, 
    actualizarAlumno, 
    obtenerAlumnos, 
    obtenerAlumnoPorID, 
    actualizarContrasenaDefaultAlumno, 
    actualizarContrasena,
    reiniciarContrasena,
    cambiarEstado
} // Se exporta el controlador 