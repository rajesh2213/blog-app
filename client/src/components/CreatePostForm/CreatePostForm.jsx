import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createPost } from '../../services/postServices'
import {Navigate} from 'react-router-dom'

export default function CreatePostForm({ setErrors }) {
    const auth = useAuth()
    const [redirect, setRedirect] = useState(false)

    const handleFormSubmission = async (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        try {
            const res = await createPost(formData, auth)
            const data = await res.json()
            if (res.ok) {
                alert('Post added')
                setRedirect(true)
            } else {
                setErrors([data.errors[0].msg || data.message || 'Failed to create post'])
                return
            }
            form.reset()
            setErrors(null)
        } catch (err) {
            console.log('Error submitting post: ', err)
            setErrors(['Something went wrong'])
        }
    }
    if(redirect) return <Navigate to="/" />
    return (
        <form onSubmit={handleFormSubmission} encType="multipart/form-data">
            <input type="text" name="title" id="title" placeholder="Enter title here" required />
            <label htmlFor="cover">Upload cover Image:</label>
            <input type="file" name="cover" id="cover" required />
            <textarea name="content" id="content" placeholder="Content goes here..." required></textarea>
            <button>Add Post</button>
        </form>
    )
}