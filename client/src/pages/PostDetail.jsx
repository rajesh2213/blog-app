import { useParams } from "react-router-dom"
import {useEffect, useState} from 'react'
import { useAuth } from "../contexts/AuthContext";
import { getPostById } from "../services/postServices";
import Comments from '../components/Comments/Comments'

const PostDetail = () => {
    const postId = useParams()
    const auth = useAuth()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await getPostById(postId)
                if (res.ok) {
                    const data = await res.json()
                    setPost(data.post)
                }
            } catch (err) {
                console.log('[ERROR] ', err)
            } finally {
                setLoading(false)
            }
        }
        getPost()
    }, [postId])

    if(error){
        return <p>Something went wrong, try again...</p>
    }

    if(loading){
        return <p>Loading...</p>
    }

    return (
        <div>
            <div>
                <h1>{post.title}</h1>
            </div>
            <div>
                <img src={post.image} alt={`${post.image}'s Image`} />
            </div>
            <div>
                <p>{post.content}</p>
            </div>
            <div>
                <Comments />
            </div>
        </div>
    )
}

export default PostDetail