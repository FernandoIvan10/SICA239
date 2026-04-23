# Sistema de Consulta de Calificaciones - CBTa 239

Sistema diseñado para facilitar la consulta de calificaciones de los alumnos del Centro de Bachillerato Tecnológico Agropecuario n.º 239 (CBTa 239).

## Características principales

- **Autenticación segura**: Acceso protegido mediante credenciales para garantizar la privacidad de los datos.
- **Gestión de usuarios**: Control de administradores y alumnos.
- **Consulta de calificaciones**: Visualización clara y organizada de las calificaciones.
- **Interfaz responsiva**: Diseñada para adaptarse a diferentes dispositivos.

## Tecnologías utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Base de datos**: MongoDB
- **Servicios externos**: Cloudinary

## Requisitos previos

Para desplegar este sistema, asegúrate de tener instalados los siguientes componentes:

- Node.js (versión 16 o superior)
- MongoDB
- Cuenta en Cloudinary

## Despliegue en producción

1. Clona este repositorio:

   ```bash
   git clone https://github.com/FernandoIvan10/SICA239.git
   cd SICA239
   ```

2. Instala las dependencias necesarias para el frontend:

   ```bash
   cd client
   npm install
   ```

3. Configura las variables de entorno del frontend. Crea un archivo `.env.production` en el directorio `client` con el siguiente contenido:

   > **VITE_API_URL** — URL del servidor backend  

   Ejemplo de archivo `.env.production`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Genera los archivos estáticos del frontend con el siguiente comando:

   ```bash
   npm run build
   ```

5. Instala las dependencias necesarias para el backend:

   ```bash
   cd ../server
   npm install
   ```

6. Configura las variables de entorno. Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

   > **MONGO_URI** — dirección de conexión a tu base de datos MongoDB.  
   > **CLAVE_SECRETA** — clave de seguridad creada por el administrador para cifrar los tokens de inicio de sesión.  
   > **CLOUDINARY_CLOUD_NAME** — nombre de tu cuenta de Cloudinary.  
   > **CLOUDINARY_API_KEY** — clave pública de tu cuenta de Cloudinary.  
   > **CLOUDINARY_API_SECRET** — clave privada de tu cuenta de Cloudinary.   
   > **PORT** — Puerto del servidor backend.

   Ejemplo de archivo `.env`:

   ```env
   MONGO_URI=<tu-URI-de-MongoDB>
   CLAVE_SECRETA=<tu-clave-secreta>
   CLOUDINARY_CLOUD_NAME=<tu-cloud-name>
   CLOUDINARY_API_KEY=<tu-api-key>
   CLOUDINARY_API_SECRET=<tu-api-secret>
   PORT=<tu-puerto-backend>
   ```

7. Inicia el servidor frontend:

   ```bash
   cd ../client
   npm run preview
   ```

8. En otra terminal, inicia el servidor backend:

   ```bash
   cd server
   npm run start
   ```

6. Accede al sistema desde tu navegador en `http://localhost:4173/`.

## Nota importante: Configuración inicial

Antes de **encender el servidor por primera vez**, deberás ejecutar los scripts para crear el usuario superadministrador y el grupo de egresados.
Esto se logra ejecutando los siguientes comandos dentro de la carpeta `server`:

   ```bash
   npm run seed:egresados
   npm run seed:admin
   ```

Por favor, sigue las instrucciones que aparecerán en la consola para registrar al superadministrador. Una vez configurado, este superadministrador tendrá control total sobre el sistema.

## Licencia

Este código está destinado exclusivamente para su uso en el sistema de consulta de calificaciones del Centro de Bachillerato Tecnológico Agropecuario n.º 239 (CBTa 239). No se permite su uso, distribución ni modificación fuera de este contexto sin el permiso explícito del autor.

## Contacto

Para más información o dudas, contacta al autor del proyecto.
