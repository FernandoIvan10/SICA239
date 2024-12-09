// Imports
require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGO_URI // Variable de conexión a MongoDB Atlas

// Método para contectarnos a la BD
const conectarBD = async()=>{
    try{
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }catch(error){
        console.error('Error al conectar a MongoDB', error)
        process.exit(1)
    }
}

module.exports=conectarBD // Se exporta el método conectarBD