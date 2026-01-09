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

module.exports = {
    agregarAlumno
}