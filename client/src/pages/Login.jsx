import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { loginUser } from '../services/authServices'
import {useAuth} from '../contexts/AuthContext'

const Login = () => {
    const [errors, setErrors] = useState([])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const auth = useAuth()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        try {            
            const res = await loginUser(email, password, auth)
            const data = await res.json()
            if (res.ok) {
                const token = data.accessToken
                auth.login(token, data.user)
                alert('Login Successful')
                setRedirect(true)
            } else {
                if(data.errors && Array.isArray(data.errors)){
                    setErrors(data.errors.map(err => err.msg))
                }else{
                    setErrors(prev => [...prev, data.message || 'Login failed'])
                }
            }
        } catch (err) {
            setErrors(prev => [...prev, 'Something went wrong'])
            console.log(err)
        }
    }

    if(redirect) return <Navigate to="/" />

    return (
        <div>
            <h2>Login</h2>
            {errors.length !== 0 && errors.map((err, index) => (
                <p key={index}>{err}</p>
            ))
            }
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login