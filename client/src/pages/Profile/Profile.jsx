import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { getProfile } from '../../services/authServices'
import LazyRenderedPostCard from '../../components/PostCard/LazyRenderedPostCard'
import PostCard from '../../components/PostCard/PostCard'
import Expandable from '../../components/Expandable/Expandable'
import CommentHistory from './CommentHistory'
import EditPosts from '../../components/PostCard/EditPosts'
import styles from './Profile.module.css'

const Profile = () => {
    const auth = useAuth()
    const { loading, user } = auth
    const [userData, setUserData] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [error, setError] = useState(null)
    const [selectedPost, setSelectedPost] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)

    const loadUserData = async () => {
        if (!user) return;
        try {
            const res = await getProfile(user.id, auth)
            if (res.ok) {
                const data = await res.json()
                setUserData(data.user)
                setError(null)
            } else {
                setError('Error fetching userData')
            }
        } catch (err) {
            console.log(err)
            setError(err)
        } finally {
            setLoadingUser(false)
        }
    }


    useEffect(() => {
        loadUserData()
    }, [user?.id, auth])

    if (error) {
        return <p>Internal Server Error...</p>
    }

    if (loading || loadingUser) {
        return <p>loading...</p>
    }

    if (!user) {
        return (
            <p>Please <Link to='/login'>login</Link> to access your profile</p>
        )
    }

    return (
        <div className={styles.container}>
            <h1>Adios, {user.username}!</h1>
            <div className={styles.userInfo}>
                <h2 className={styles.heading}>User Information</h2>
                <div style={{ display: 'table' }}>
                    <div className={styles.row} style={{ display: 'table-row' }}>
                        <strong className={styles.label} style={{ display: 'table-cell', padding: '8px' }}>Username:</strong>
                        <span className={styles.value} style={{ display: 'table-cell', padding: '8px' }}>{userData?.username || user.username}</span>
                    </div>
                    <div style={{ display: 'table-row' }}>
                        <strong className={styles.label} style={{ display: 'table-cell', padding: '8px' }}>Email:</strong>
                        <span className={styles.value} style={{ display: 'table-cell', padding: '8px' }}>{userData?.email || user.email}</span>
                    </div>
                    <div style={{ display: 'table-row' }}>
                        <strong className={styles.label} style={{ display: 'table-cell', padding: '8px' }}>Role:</strong>
                        <span className={styles.value} style={{ display: 'table-cell', padding: '8px' }}>{userData?.role || user.role}</span>
                    </div>
                    <div style={{ display: 'table-row' }}>
                        <strong className={styles.label} style={{ display: 'table-cell', padding: '8px' }}>Joined:</strong>
                        <span className={styles.value} style={{ display: 'table-cell', padding: '8px' }}>
                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <h2>Activity</h2>
                <Expandable
                    expandableContainer='Posts'>
                    {userData && userData.posts && userData.posts.length > 0 ? (
                        userData.posts.map(post => (
                            <div key={post.id} className={styles.postContainer}>
                                <button className={styles.editBtn} onClick={() => {
                                    setSelectedPost(post);
                                    setShowEditModal(true);
                                }}>
                                    Edit
                                </button>
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <>
                            <p>You have not posted anything yet...</p>
                            <p>Click <Link to="/create-post">here</Link> to create a new post</p>
                        </>
                    )}

                </Expandable>
                <Expandable
                    expandableContainer='Comments'>
                    {userData && userData.comments && userData.comments.length > 0 ? (
                        userData.comments.map(comment => (
                            <CommentHistory key={comment.id} comment={comment} />
                        ))
                    ) : (
                        <div>
                            <p>You have not commented on anything yet...</p>
                        </div>)}
                </Expandable>
            </div>
            {showEditModal && selectedPost && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedPost(null);
                            }}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                        <EditPosts
                            post={selectedPost}
                            onSave={() => {
                                setShowEditModal(false);
                                setSelectedPost(null);
                                loadUserData();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile