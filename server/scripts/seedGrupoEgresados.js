require('dotenv').config()
const conectarBD = require('../config/db')
const Grupo = require('../models/grupo.model')

async function seedGrupoEgresados(){
    try{
        await conectarBD() // Conectar a la base de datos
        
        // Se valida que no exista el grupo
        const existe = await Grupo.findOne({nombre: 'Egresados'})
        if(existe){
            console.log('✔ El grupo Egresados ya existe.')
            return
        }
        
        // Se crea el grupo Egresados
        const grupo = new Grupo({
            nombre: 'Egresados',
            semestre: 'Egresados',
            materias: [],
        })
        await grupo.save()
        console.log('✔ Grupo Egresados creado correctamente.')
    }catch(error){
        console.error('✖ Error al crear el grupo Egresados: ', error.message)
    }
}

seedGrupoEgresados()