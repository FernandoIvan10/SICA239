// imports
const bcrypt = require('bcrypt')
const readline = require('readline')
const Administrador = require('../models/administrador.model')

// Interfaz para interactuar con la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Método que recaba los datos del nuevo superadmin
const preguntarDatos = () =>{
    return new Promise((resolve, reject) => {
        rl.question('Ingrese el RFC del superadministrador: ', (rfc) => {
            rl.question('Ingrese el nombre del superadministrador: ', (nombre) => {
                rl.question('Ingrese el apellido del superadministrador: ', (apellido) => {
                    rl.question('Ingrese la contraseña del superadministrador: ', (contrasena) => {
                        resolve({rfc, nombre, apellido, contrasena})
                        rl.close()
                    })
                })
            })
        })
    })
}

// Método que crea el superadministrado si no existe
async function crearAdministrador(){
    try{
        // Se valida que no exista un superadministrador
        const existe = await Administrador.findOne({rol: 'superadmin'})
        if(!existe){
            console.log('¡Bienvenido! Ingrese los datos del usuario superadministrador. Este paso sólo se realiza la primera vez que se enciende el servidor')
            const {rfc, nombre, apellido, contrasena} = await preguntarDatos() // Se piden los datos del superadministrador
            // La contraseña se encripta
            const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
            // Se crea el superadmin
            const nuevoAdmin = new Administrador({
                rfc,
                nombre,
                apellido,
                contrasena: contrasenaEncriptada,
                rol: 'superadmin',
                requiereCambioContrasena: false
            })
            await nuevoAdmin.save()
            console.log(`Superadministrador ${nuevoAdmin.nombre} ${nuevoAdmin.apellido} creado.`);
        }else{
            console.log('El superadministrador ya existe.')
        }
    }catch(error){
        console.error('Error al crear el superadministrador', error)
    }
}

module.exports = crearAdministrador // Se exporta la función