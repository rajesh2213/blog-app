import { useAuth } from '../../contexts/AuthContext'
import { Link, useParams } from 'react-router-dom'
import { addCommentToPost } from '../../services/postServices'
import styles from './CommentForm.module.css'

export default function CommentForm({ parentId, onSuccess }) {    
    const auth = useAuth();
    const { postId } = useParams();
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const commentData = {
            content: formData.get('content'),
            postId: postId,
            parentId: parentId || undefined
        };        try {
            const res = await addCommentToPost(postId, commentData, auth);
            if (res.ok) {
                const data = await res.json();
                form.reset();
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (err) {
            console.log('Error adding comment: ', err);
            alert('Something went wrong while adding your comment. Please try again.');
        }
    };
    
    return (
        <form onSubmit={handleCommentSubmit} className={styles.form}>
            <textarea 
                name="content" 
                id="content" 
                className={styles.textarea}
                placeholder="Add your comment..." 
                required
            />
            {auth.isAuthenticated ? (
                <button type="submit" className={styles.submitButton}>
                    Add Comment
                </button>
            ) : (
                <p className={styles.loginMessage}>
                    Please <Link to="/login" className={styles.loginLink}>login</Link> to comment.
                </p>
            )}
        </form>
    )
}