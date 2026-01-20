import { jwtDecode } from 'jwt-decode'
import { 
    createContext,
    useEffect,
    useMemo,
    useState
} from 'react'

export const AuthContext = createContext(null)

// Proveedor de autenticación
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => { // Valida el token al cargar el componente
        const token = localStorage.getItem('token')

        if(!token){ // No hay token
            setUsuario(null)
            setCargando(false)
            return
        }

        try{
            const tokenDecodificado = jwtDecode(token)

            if(tokenDecodificado.exp * 1000 < Date.now()){ // Token expirado
                localStorage.removeItem('token')
                setUsuario(null)
                return
            } else{ // Token válido
                setUsuario({
                    id: tokenDecodificado.id,
                    nombre: tokenDecodificado.nombre,
                    rol: tokenDecodificado.rol,
                    requiereCambioContrasena: tokenDecodificado.requiereCambioContrasena
                })
            }
        }catch(error){
            console.error('Token inválido:', error)
            localStorage.removeItem('token')
            setUsuario(null)
        }finally{
            setCargando(false)
        }
    }, [])

    const login = (token) => { // Guarda el token y la información del usuario
        localStorage.setItem('token', token)
        const tokenDecodificado = jwtDecode(token)
        setUsuario({
            id: tokenDecodificado.id,
            nombre: tokenDecodificado.nombre,
            rol: tokenDecodificado.rol,
            requiereCambioContrasena: tokenDecodificado.requiereCambioContrasena
        })
    }
    const logout = () => { // Elimina el token y la información del usuario
        localStorage.removeItem('token')
        setUsuario(null)
    }

    const value = useMemo(() => ({ // Valores y funciones disponibles en el contexto
        usuario,
        estaAutenticado: !!usuario,
        login,
        logout,
        cargando
    }), [usuario, cargando])

    // Renderiza el proveedor de contexto
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}