import { useState } from 'react';
import CommentForm from './CommentForm';
import styles from './CommentThread.module.css';

export default function CommentThread({ comment, depth = 0 }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0)

    const commentRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }
    const maxDepth = 3; return (
        <div className={styles.threadContainer} style={{ marginLeft: `${depth * 20}px` }}>
            <div className={styles.commentContainer}>
                <div className={styles.metadata}>
                    <span>{comment.author?.username || 'Anonymous'}</span>
                    <span className={styles.metadataSeparator}>•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
                {depth < maxDepth && (
                    <button
                        className={styles.replyButton}
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        {showReplyForm ? 'Cancel Reply' : 'Reply'}
                    </button>
                )}
            </div>             {showReplyForm && (
                <div className={styles.replyForm}>
                    <CommentForm
                        parentId={comment.id}
                        onSuccess={() => {
                            setShowReplyForm(false);
                            commentRefresh;
                        }}
                    />
                </div>
            )}

            {comment.children && comment.children.length > 0 && (
                <div className={styles.childComments}>
                    {comment.children.map(childComment => (
                        <CommentThread
                            key={childComment.id}
                            comment={childComment}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
