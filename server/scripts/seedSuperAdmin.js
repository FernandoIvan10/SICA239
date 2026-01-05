require('dotenv').config()
const bcrypt = require('bcrypt')
const readline = require('readline')
const conectarBD = require('../config/db')
const Administrador = require('../models/administrador.model')

// Interfaz para interactuar con la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Helper para preguntar
const preguntar = (pregunta) => 
    new Promise((resolve) => rl.question(pregunta, resolve));

async function seedSuperAdmin() {
    try {
        await conectarBD() // Conectar a la base de datos

        // Verificar si el superadministrador ya existe
        const existe = await Administrador.findOne({ rol: 'superadmin' });
        if (existe) {
            console.log('✔ El superadministrador ya existe.');
            return
        }

        console.log('=== Creación de superadministrador inicial ===');

        // Recabar datos del superadministrador
        const rfc = await preguntar('RFC: ');
        const nombre = await preguntar('Nombre: ');
        const apellido = await preguntar('Apellido: ');
        const contrasena = await preguntar('Contraseña: ');

        if (!rfc || !nombre || !apellido || !contrasena) {
            throw new Error('Todos los campos son obligatorios.');
            return
        }

        const hashContrasena = await bcrypt.hash(contrasena, 10);

        const admin = new Administrador({
            rfc,
            nombre,
            apellido,
            contrasena: hashContrasena,
            rol: 'superadmin',
            requiereCambioContrasena: false
        });

        await admin.save();

        console.log(`✔ Superadministrador ${nombre} ${apellido} creado correctamente.`);
    } catch (error) {
        console.error('✖ Error al crear el superadministrador:', error.message);
    }finally {
        rl.close();
    }

}

seedSuperAdmin();