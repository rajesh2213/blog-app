import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import styles from './PostCard.module.css'

const PostCard = ({ post }) => {
    return (
        <Link to={`/posts/${post.id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.imageSection}>
                    <img src={post.image} alt={post.title} className={styles.img} />
                    <h3 className={styles.title}>{post.title}</h3>
                </div>
                <div className={styles.textSection}>
                    <p className={styles.content}>{post.content}</p>
                    <div>
                        <p>{post.published ? 'Published' : 'Not published'}</p>
                        {post.username && (
                            <p className={styles.author}>Created By: {post.username}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.shape({
            username: PropTypes.string.isRequired
        })
    }).isRequired
}

PostCard.defaultProps = {
    post: {
        id: 0,
        title: 'Untitled Post',
        content: 'Idk what to write lol...',
        author: {
            username: 'Anonymous User'
        }
    }
}

export default PostCard