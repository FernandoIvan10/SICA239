// Imports
const jwt = require('jsonwebtoken')

// Middleware que verifica que el token sea válido
function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1] // Se busca el token en el encabezado
    if (!token) { // Se valida que el token exista
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA) // Se verifica que sea válido
        req.usuario = decoded // Se guarda la información
        req.usuarioId = decoded.id
        next()
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' })
    }
}

// Se exporta el middleware
module.exports = verificarToken