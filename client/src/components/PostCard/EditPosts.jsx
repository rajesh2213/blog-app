

import { useState } from 'react';
import { updatePost } from '../../services/postServices';
import { useAuth } from '../../contexts/AuthContext';
import styles from './EditPosts.module.css';

const EditPosts = ({ post, onSave }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [published, setPublished] = useState(post.published);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    const handlePostUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await updatePost(
                post.id,
                { title, content, published },
                auth
            );

            if (res.ok) {
                alert('Post updated successfully');
                onSave();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update post');
            }
        } catch (err) {
            setError('Something went wrong');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.editForm}>
            <h2>Edit Post</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handlePostUpdate}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={6}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                        />
                        Published
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
};

export default EditPosts;