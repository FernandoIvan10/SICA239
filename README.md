# Sistema de Consulta de Calificaciones - CBTa 239

## Indice

- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Diseño y Arquitectura](#diseño-y-arquitectura)
- [Decisiones técnicas clave](#decisiones-técnicas-clave)
   - [Layered Architecture](#layered-architecture)
   - [Autorización centralizada mediante RBAC](#autorización-centralizada-mediante-rbac)
   - [Separación entre presentación y comunicación con la API](#separación-entre-presentación-y-comunicación-con-la-api)
   - [Estado global de autenticación](#estado-global-de-autenticación)
- [Instalación y configuración](#instalación-y-configuración)
- [Despliegue](#despliegue)
   - [Configuración inicial](#configuración-inicial)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Descripción
SICA239 surge como una propuesta para permitir a los alumnos del CBTa 239 consultar sus calificaciones e historial académico en tiempo real a través de una plataforma web, de esta forma, los alumnos no dependen de terceros o de procesos difíciles para conocer su situación académica.
De forma complementaria, el sistema también permite consultar horarios actualizados, eliminando la necesidad de depender de listados físicos o información fragmentada.
Para que esta herramienta fuera viable fue necesario incorporar un módulo administrativo que permiera la gestión de calificaciones, grupos y horarios. A partir de esta necesidad surgió la implementación de distintos niveles de administración (superadministrador, editor y lector), permitiendo delegar responsabilidades con control de permisos.

![Demo](./client/src/assets/img/demo.gif)

## Características principales

- **Autenticación segura**: Acceso protegido mediante credenciales para garantizar la privacidad de los datos.
- **Gestión de usuarios**: Control de administradores y alumnos.
- **Consulta de calificaciones**: Visualización clara y organizada de las calificaciones.
- **Interfaz responsiva**: Diseñada para adaptarse a diferentes dispositivos.

## Stack tecnológico

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Base de datos**: MongoDB
- **Servicios externos**: Cloudinary

## Diseño y arquitectura
### Backend
- Arquitectura cliente-servidor desacoplada
- Layered Architecture
- API REST estructurada por dominios funcionales
- Middleware para autenticación, autorización y validaciones
- Autenticación stateless basada en JWT
- Persistencia en MongoDB/Mongoose
### Frontend
- Arquitectura basada en componentes reutilizables
- Gestión de autenticación centralizado
- Rutas protegidas basado en roles
- Capa de servicio para consumo de APIs

## Decisiones técnicas clave
### Layered Architecture
**Problema:** <br>
A medida que el sistema creció en funcionalidades, surgieron distintas responsabilidades: manejo de peticiones HTTP, reglas académicas, validaciones, control de permisos por rol, y persistencia de datos. **Distintas responsabilidades terminaban mezclándose** lo que complicaba el seguimiento de la lógica del backend, **dificultando el mantenimiento e incorporación de nuevas funcionalidades**. <br>
**Solución:** <br>
**Se adoptó una arquitectura por capas (Layered Architecture)** para separar claramente las responsabilidades de cada componente del backend: <br>
- Controllers → gestionan la comunicación HTTP. <br>
- Services → implementan las reglas de negocio y procesos del dominio. <br>
- Models → gestionan la persistencia de datos. <br>
- Middleware → gestiona procesos comunes como autenticación, autorización y validaciones. <br>

### Autorización centralizada mediante RBAC
**Problema:** <br>
El sistema maneja **distintos tipos de usuarios con capacidades diferentes sobre los mismos recursos**. Por ejemplo, mientras un alumno únicamente puede consultar su información académica, un administrador lector puede consultar toda la información académica, y un super administrador puede modificarla.
Implementar estas validaciones directamente dentro de cada endpoint del backend **provoca duplicación de lógica, riesgo de inconsistencias entre funcionalidades y dificulta el mantenimiento**. <br>
**Solución:** <br>
**Se implementó un modelo de control de acceso basado en roles (RBAC) mediante un middleware**. Cada ruta define qué roles pueden acceder a ella y la validación se realiza de forma centralizada antes de ejecutar la lógica correspondiente. Definiendo las reglas de acceso en un único lugar y haciendo que cambios en la estructura de permisos o roles sean más sencillos de realizar.

### Separación entre presentación y comunicación con la API
**Problema:** <br>
El sistema realiza operaciones sobre múltiples recursos y consume más de 30 endpoints desde el frontend. **Integrar las llamadas HTTP dentro de los componentes React genera vistas complejas** con múltiples responsabilidades lo cuál dificulta el mantenimiento de cada componente.
**Solución** <br>
**Se centralizó la comunicación con el backend mediante módulos de acceso a la API**. Los componentes consumen estos servicios sin conocer los endpoints utilizados ni los detalles de la comunicación, delegando la responsabilidad a otra capa del sistema. De esta manera, los componentes sólo se enfocan en la presentación e interacción con el usuario, reduciendo la complejidad del sistema.

### Estado global de autenticación
**Problema:** <br>
**Múltiples componentes React necesitan conocer si existe una sesión activa y acceder a información del usuario autenticado**. Gestionar este estado en cada vista duplica lógica y puede generar inconsistencias. <br>
**Solución:** <br>
**Se implementó un proveedor global de autenticación** encargado de validar la sesión al iniciar la aplicación, exponer los datos del usuario autenticado y centralizar las operaciones relacionadas como login, logout y expiración del token, evitando duplicación de lógica y creando una una fuente de información de sesión para el frontend.

## Instalación y configuración
**Requisitos previos:** <br>

Para desplegar este sistema, asegúrate de tener instalados los siguientes componentes:

- Node.js (versión 16 o superior)
- MongoDB
- Cuenta en Cloudinary

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

## Despliegue
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

9. Accede al sistema desde tu navegador en `http://localhost:4173/`.

### Configuración inicial

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
