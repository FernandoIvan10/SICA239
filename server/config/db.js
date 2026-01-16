const mongoose = require('mongoose')

const { MONGO_URI, NODE_ENV } = process.env

if (!MONGO_URI) {
    throw new Error('MONGO_URI no está definida')
}

mongoose.set('strictQuery', true)

// Método para contectarse a la BD
const conectarBD = async()=>{
    try{
        await mongoose.connect(MONGO_URI, {
            autoIndex: NODE_ENV !== 'production',
            serverSelectionTimeoutMS: 5000,
        })
        console.log('MongoDB conectado')
    }catch(error){
        console.error('Error al conectar a MongoDB', error.message)
        process.exit(1)
    }
}

mongoose.connection.on('connected', () => {
    console.warn('Mongoose: conexión establecida')
})

mongoose.connection.on('error', () => {
    console.error('Mongoose error: ', err)
})

mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose desconectado')
})

mongoose.connection.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('MongoDB desconectado por cierre de app')
    process.exit(0)
})

module.exports = conectarBD