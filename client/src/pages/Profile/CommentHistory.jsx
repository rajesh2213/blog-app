import {Link} from 'react-router-dom'

export default function CommentHistory ({comment}) {
    return (
        <Link to={`/posts/${comment.post.id}`}>
            <div><span style={{fontWeight: 'bold'}}>Comment: </span>{comment.content}</div>
            <div><span style={{fontWeight: 'bold'}}>Date: </span>{comment.createdAt}</div>
            <div><span style={{fontWeight: 'bold'}}>Post: </span> {comment.post.title}</div>
        </Link>
    )
}