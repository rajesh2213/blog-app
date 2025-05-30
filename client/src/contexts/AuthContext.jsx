import { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken, logoutUser } from '../services/authServices'

const authContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)    
    
    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const data = await refreshToken()
                if (data) {
                    console.log('Successfull refresh')
                    setToken(data.accessToken)
                    setUser(data.user)
                    setIsAuthenticated(true)
                } else {
                    console.log('Failing refresh')
                    setToken(null)
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (err) {
                console.log('Auto refresh failed: ', err.message)
                setToken(null)
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }
        tryRefresh()
    }, [])
    
    const login = (token, userData) => {
        setToken(token)
        setUser(userData)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        try {
            const res = await logoutUser()
            if (res.ok) {
                setToken(null)
                setIsAuthenticated(false)
            }
        } catch (err) {
            console.error('Logout failed:', err)
            setToken(null)
        }
    }


    return (
        <authContext.Provider value={{ token, login, logout, loading, isAuthenticated, user }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext)