// Middleware que verifica los permisos del Rol
function verificarRol(rolesPermitidos = []) {
    if(!Array.isArray(rolesPermitidos)) {
        throw new Error('verificarRol debe recibir un arreglo de roles permitidos')
    }

    return (req, res, next) => {
        if(!req.usuario || !req.usuario.rol) {
            return res.status(401).json({ message: 'No autenticado' })
        }

        const rol = req.usuario.rol
        if (!rolesPermitidos.includes(rol)) { // Verifica que el rol tenga permisos
            return res.status(403).json({ message: 'Acceso denegado' })
        }
        next()
    }
}

module.exports = verificarRol