import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import { getCommentsByPostID } from '../../services/postServices';

export default function Comments() {
    const { isAuthenticated } = useAuth()
    const postId = useParams()
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)  // Add this to trigger refreshes
      const handleCommentAdded = () => {
        setRefreshKey(prev => prev + 1)  // This will trigger a refresh
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await getCommentsByPostID(postId)
                if (res.ok) {
                    const data = await res.json()
                    const commentMap = new Map()
                    
                    data.comments.forEach(comment => {
                        comment.children = []
                        commentMap.set(comment.id, comment)
                    })
                    
                    const rootComments = []
                    data.comments.forEach(comment => {
                        if (comment.parentId) {
                            const parent = commentMap.get(comment.parentId)
                            if (parent) {
                                parent.children.push(comment)
                            }
                        } else {
                            rootComments.push(comment)
                        }
                    })
                    setComments(rootComments)
                }   
            } catch (err) {
                console.log('[ERROR] ', err)
            } finally {
                setLoading(false)
            }
        }
        getComments()
    }, [postId, refreshKey])

    if (loading) {
        return <p>Loading comments...</p>
    }

    if (comments.length === 0) {
        return (
            <div>
                <h2>Comments</h2>
                <p>No comments yet. Be the first to comment!</p>
                <CommentForm onSuccess={handleCommentAdded} />
            </div>
        )
    } return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>           
             <div className="mb-6">
                <CommentForm onSuccess={handleCommentAdded} />
            </div>
            <div className="space-y-4">
                {comments && comments.length > 0 && comments.map((comment) => (
                    <CommentThread key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}