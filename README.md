# Sistema de Consulta de Calificaciones - CBTa 239

Sistema diseñado para facilitar la consulta de calificaciones de los alumnos del Centro de Bachillerato Tecnológico Agropecuario n.º 239 (CBTa 239). Permite a los estudiantes acceder a sus calificaciones de forma segura y eficiente.

## Características principales

- **Autenticación segura**: Acceso protegido mediante credenciales para garantizar la privacidad de los datos.
- **Gestión de usuarios**: Control de administradores y alumnos.
- **Consulta de calificaciones**: Visualización clara y organizada de las calificaciones.
- **Interfaz responsiva**: Diseñada para adaptarse a diferentes dispositivos.

## Tecnologías utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Base de datos**: MongoDB

## Requisitos previos

Para desplegar este sistema, asegúrate de tener instalados los siguientes componentes:

- Node.js (versión 16 o superior)
- MongoDB

## Despliegue en producción

1. Clona este repositorio:

   ```bash
   git clone https://github.com/FernandoIvan10/SICA239.git
   cd SICA239
   ```

2. Instala las dependencias necesarias para el backend:

   ```bash
   cd server
   npm install
   ```

3. Configura las variables de entorno. Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

   ```env
   MONGO_URI=<tu-URI-de-MongoDB>
   CLAVE_SECRETA=<una-clave-secreta>
   ```

4. Genera los archivos estáticos del frontend:

   ```bash
   cd ../client
   npm install
   npm run build
   ```

5. Inicia el servidor backend (esto también servirá los archivos del frontend):

   ```bash
   cd ../server
   npm start
   ```

6. Accede al sistema desde tu navegador en `http://localhost:3000`.

## Nota importante: Configuración inicial

En la **primera vez que se enciende el servidor**, el sistema solicitará en la consola los datos del usuario superadministrador. Este proceso asegura que los datos del administrador principal sean configurados de manera segura.

Por favor, sigue las instrucciones que aparecerán en la consola para completar este paso. Una vez configurado, este superadministrador tendrá control total sobre el sistema.

## Licencia

Este código está destinado exclusivamente para su uso en el sistema de consulta de calificaciones del Centro de Bachillerato Tecnológico Agropecuario n.º 239 (CBTa 239). No se permite su uso, distribución ni modificación fuera de este contexto sin el permiso explícito del autor.

## Contacto

Para más información o dudas, contacta al autor del proyecto.