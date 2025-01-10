// imports
require('dotenv').config()
const bcrypt = require('bcrypt')
const Administrador = require('../models/administrador.model')

// Método que crea usuarios administradores predefinidos
async function crearAdministrador(){
    try{
        const superAdmin={ // Datos del superadmin
            rfc: process.env.SUPERADMIN_RFC,
            nombre: process.env.SUPERADMIN_NOMBRE,
            apellido: process.env.SUPERADMIN_APELLIDO,
            contraseña: process.env.SUPERADMIN_PASSWORD,
            rol: 'superadmin'
        }

        // Se valida que no exista
        const existe = await Administrador.findOne({rfc: superAdmin.rfc})
        if(!existe){
            // La contraseña se encripta
            const contraseñaEncriptada = await bcrypt.hash(superAdmin.contraseña, 10)
            // Se crea el superadmin
            const nuevoAdmin = new Administrador({
                rfc: superAdmin.rfc,
                nombre: superAdmin.nombre,
                apellido: superAdmin.apellido,
                contraseña: contraseñaEncriptada,
                rol: superAdmin.rol,
            })
            await nuevoAdmin.save()
            console.log(`Superadministrador ${superAdmin.nombre} ${superAdmin.apellido} creado.`);
        }else{
            console.log('El superadministrador ya existe.')
        }
    }catch(error){
        console.error('Error al crear el superadministrador', error)
    }
}

module.exports = crearAdministrador // Se exporta la función