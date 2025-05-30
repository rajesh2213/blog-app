import { useAuth } from '../contexts/AuthContext';
import authFetch from '../utils/authFetch'

const API = import.meta.env.VITE_API_URL

export const loginUser = async (email, password, auth) => {
    const res = await authFetch(`${API}/user/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }, auth)
    return res
}

export const refreshToken = async () => {
    const res = await fetch(`${API}/user/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!res.ok) throw new Error('Refresh failed');
    return res.json()
}

export const logoutUser = async () => {
    const res = await fetch(`${API}/user/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    return res
}

export const registerUser = async (formData) => {
    const res = await fetch(`${API}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    return res
}

export const getProfile = async (userId, auth) => {
    const res = await authFetch(`${API}/user/profile/${userId}`, {
        method: 'GET'
    }, auth)
    return res
}