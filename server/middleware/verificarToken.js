const jwt = require('jsonwebtoken')

// Middleware que verifica que el token sea válido
function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) { // Debe existir el header de autorización
        return res.status(401).json({ message: 'No autenticado.' })
    }

    const [scheme, token] = authHeader.split(' ')

    if(scheme !== 'Bearer' || !token) { // El esquema debe ser Bearer y debe existir el token
        return res.status(401).json({ message: 'Formato de token inválido.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA) // Se verifica que el token sea válido
        // Agrega la información del usuario al request
        req.usuario = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' })
    }
}

module.exports = verificarToken