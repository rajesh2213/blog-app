import {useState} from 'react'
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";

export default function CreatePost () {
    const [errors, setErrors] = useState([])

    return (
        <div>
            <h1>Add New Post</h1>
            {errors && errors.length !== 0 && errors.map((error, idx) => (
                <p key={idx}>{error}</p>
            )) }
            <CreatePostForm setErrors={setErrors}/>
        </div>
    )
}