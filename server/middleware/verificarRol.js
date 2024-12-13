// Middleware que verifica los permisos del Rol
function verificarRol(permisosPermitidos) {
    return (req, res, next) => {
        const rol = req.usuario.rol
        if (!permisosPermitidos.includes(rol)) { // Verifica que el rol tenga permisos
            return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta ruta.' })
        }
        next()
    }
}

module.exports = verificarRol