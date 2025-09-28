// imports
const Grupo = require('../models/grupo.model')

// Método que crea el superadministrado si no existe
async function crearGrupoEgresados(){
    try{
        // Se valida que no exista el grupo
        const existe = await Grupo.findOne({nombre: 'Egresados'})
        if(!existe){
            // Se crea el grupo
            const nuevoGrupo = new Grupo({
                nombre: 'Egresados',
                semestre: 'Egresados',
                materias: [],
            })
            await nuevoGrupo.save()
            console.log('Grupo Egresados creado.');
        }else{
            console.log('El grupo Egresados ya existe.')
        }
    }catch(error){
        console.error('Error al crear el grupo Egresados: ', error)
    }
}

module.exports = crearGrupoEgresados // Se exporta la función