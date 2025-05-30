import { useState } from 'react'
import { registerUser } from '../services/authServices'
import { Navigate } from 'react-router-dom'

const Register = () => {
    const [redirect, setRedirect] = useState(false)
    const [errors, setErrors] = useState([])
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const formObject = Object.fromEntries(formData.entries())
        formObject.role = form.isAdmin.checked ? 'admin' : 'user'

        try {
            const res = await registerUser(formObject)
            const data = await res.json()
            if (res.ok) {
                alert(`${data.user.username} created successfully`)
                setRedirect(true)
            } else {
                setErrors(data.message || data.errors)
            }
        } catch (err) {
            setErrors(err.message || 'Something went wrong, try again...')
            console.log(err)
        }
    }

    if (redirect) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            <h2>Register User:</h2>
            {errors && errors.length > 0 && Array.isArray(errors) ? (errors.map((error, idx) => (
                <p key={idx}>{error.msg}</p>
            ))) : (
                <p>{errors}</p>
            )}
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" name="email" id="email" required />
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" required />
                <input type="checkbox" id="isAdmin" />
                <label htmlFor="isAdmin">Register as admin</label>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" />
                <label htmlFor="confirmPassword">Re-Type Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" />

                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register