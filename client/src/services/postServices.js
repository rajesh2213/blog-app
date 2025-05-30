import authFetch from '../utils/authFetch'
const API = import.meta.env.VITE_API_URL

export const getPosts = async ({offset = 0, limit = 25, query = null, published = null } = {}) => {
    // console.log(`Offset: ${offset} , Limit: ${limit}, Query: ${query}, published: ${published}`)
    const res = await fetch(`${API}/posts?offset=${offset}&limit=${limit}&q=${query}&p=${published}`)
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch posts')
    }
    return data
}

export const createPost = async (formData, auth) => {
    const res = await authFetch(`${API}/posts`, {
        method: 'POST',
        body: formData
    }, auth)
    return res
}

export const getPostById =  async (postId, auth) => {
    const res = await fetch(`${API}/posts/${postId.postId}`, {
        method: 'GET'
    })
    return res
}

export const updatePost = async (postId, updateData, auth) => {
    const res = await authFetch(`${API}/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    }, auth);
    return res;
};

export const getCommentsByPostID = async (postId) => {
    const res = await fetch(`${API}/posts/${postId.postId}/comments`)
    return res
}

export const addCommentToPost = async (postId, formData, auth) => {
    const res = await authFetch(`${API}/posts/${postId}/comments`,  {
        method: 'POST',
        body: JSON.stringify(formData)
    }, auth)
    return res
}