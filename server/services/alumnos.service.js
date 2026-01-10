const Alumno = require('../models/alumno.model')

// Función para agregar un nuevo alumno
async function agregarAlumno(data) {
    const { 
        matricula,
        nombre,
        apellido,
        contrasena,
        grupoNombre,
        materiasRecursadas
    } = data

    if(!matricula || !nombre || !apellido || !contrasena || !grupoNombre) {
        const error = new Error('Faltan campos obligatorios')
        error.code = 'CAMPOS_FALTANTES'
        throw error
    }

    const existe = await Alumno.findOne({ matricula })
    if(existe) {
        const error = new Error('Matrícula duplicada')
        error.code = 'MATRICULA_DUPLICADA'
        throw error
    }

    const grupoExiste = await Grupo.findOne({ nombre: grupoNombre })
    if(!grupoExiste) {
        const error = new Error('Grupo no encontrado')
        error.code = 'GRUPO_NO_ENCONTRADO'
        throw error
    }

    // Las materias recursadas deben ser un arreglo de objetos con materia y grupo
    if (materiasRecursadas && !Array.isArray(materiasRecursadas)) {
        const error = new Error('Las materias recursadas deben ser un arreglo')
        error.code = 'FORMATO_INVALIDO_MATERIAS_RECURSADAS'
        throw error
    }
    if (materiasRecursadas && materiasRecursadas.some(m => !m.materia || !m.grupo)) {
        const error = new Error('Cada materia recursada debe tener materia y grupo')
        error.code = 'FORMATO_INVALIDO_MATERIAS_RECURSADAS'
        throw error
    }
    if(materiasRecursadas){ // Las materias y grupos deben existir
        for (const item of materiasRecursadas) {
            const materiaValida = await Materia.findById(item.materia)
            const grupoValido = await Grupo.findById(item.grupo)
            if (!materiaValida || !grupoValido) {
                const error = new Error('No se encontró la materia o grupo a recursar')
                error.code = 'MATERIA_GRUPO_NO_ENCONTRADO'
                throw error
            }
        }
    }

    const hash = await bcrypt.hash(contrasena, 10)

    return await Alumno.create({
        ...data,
        contrasena: hash
    })
}

// Función para modificar un alumno
async function modificarAlumno(id, data) {
    if(!id) { // El ID es obligatorio
        const error = new Error('ID de alumno es obligatorio')
        error.code = 'ID_OBLIGATORIO'
        throw error
    }

    const alumno = await Alumno.findById(id)
    if(!alumno) { // El alumno debe existir
        const error = new Error('Alumno no encontrado')
        error.code = 'ALUMNO_NO_ENCONTRADO'
        throw error
    }

    const {nombre, apellido, grupoNombre, materiasRecursadas} = data

    if(
        !nombre
        && !apellido
        && !grupoNombre
        && !materiasRecursadas
    ) { // Debe haber al menos un campo para actualizar
        const error = new Error('No se proporcionaron campos para actualizar')
        error.code = 'SIN_CAMBIOS'
        throw error
    }

    // Actualiza los campos proporcionados
    const actualizaciones = {}
    if (nombre) actualizaciones.nombre = nombre
    if (apellido) actualizaciones.apellido = apellido
    if (grupoNombre) {
        const nuevoGrupo = await Grupo.findOne({ nombre: grupoNombre })
        if (!nuevoGrupo) { // El nuevo grupo debe existir
            const error = new Error('Grupo no encontrado')
            error.code = 'GRUPO_NO_ENCONTRADO'
            throw error
        }
        if (alumno.grupoId.toString() !== nuevoGrupo._id.toString()) {
            const tieneCalificaciones = await Calificacion.exists({
                alumnoId: alumno._id,
                grupoId: alumno.grupoId
            })
            if (tieneCalificaciones) { // No se puede cambiar de grupo si hay calificaciones registradas
                const error = new Error('No se puede cambiar de grupo porque el alumno tiene calificaciones registradas')
                error.code = 'CAMBIO_GRUPO_NO_PERMITIDO'
                throw error
            }
            actualizaciones.grupoId = nuevoGrupo._id
        }
    }
    if (materiasRecursadas) {
            // Se detectan cuáles materias recursadas han cambiado
            const actuales = alumno.materiasRecursadas.map(mr =>
                `${mr.materia.toString()}-${mr.grupo.toString()}`
            )
            const nuevas = materiasRecursadas.map(mr =>
                `${mr.materia}-${mr.grupo}`
            )
            const eliminadas = actuales.filter(mr => !nuevas.includes(mr))
            for (const mr of eliminadas) {
                const [materiaId, grupoId] = mr.split('-')
                const tieneCalificaciones = await Calificacion.exists({
                    alumnoId: alumno._id,
                    grupoId,
                    materiaId
                })
                if (tieneCalificaciones) { // No se puede eliminar una materia recursada si hay calificaciones registradas
                    const error = new Error('No se puede eliminar la materia recursada porque el alumno tiene calificaciones registradas')
                    error.code = 'ELIMINACION_MATERIA_NO_PERMITIDA'
                    throw error
                }
            }
            actualizaciones.materiasRecursadas = materiasRecursadas
        }
    
    // Se actualiza el alumno
    return await Alumno.findByIdAndUpdate(id, actualizaciones, { new: true })
}

module.exports = {
    agregarAlumno,
    modificarAlumno
}