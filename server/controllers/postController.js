const { validationResult } = require('express-validator')
const postModel = require('../models/postModel')

const postsAll_get = async (req, res, next) => {
    const { offset = 0, limit = 25 } = req.query;
    let { p = null, q = null } = req.query;

    const searchParams = (!q || q === 'null' || q === 'undefined' || q.trim() === '')
        ? null
        : q.trim();
    const published = (!p || p === 'null' || p === 'undefined' || p.trim() === '' || p === 'false' || p === null)
        ? null 
        : p = String(p).toLowerCase() === 'true'
    
    try {
        const posts = await postModel.getFilteredPosts(published, offset, limit, searchParams)
        return res.status(200).json({ 
            posts,
            isEmpty: !posts || posts.length === 0
        })

    } catch (err) {
        next(err)
    }
}

const postById_get = async (req, res, next) => {
    const { postId } = req.params
    try {
        const post = await postModel.getPostById(postId)
        if (!post || post.length === 0) {
            const err = new Error('Post not found')
            err.status = 400
            return next(err)
        }
        return res.status(200).json({ post })
    } catch (err) {
        next(err)
    }
}

const createPost_post = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    if (!req.file) {
        return res.status(400).json({ errors: [{ msg: 'Cover image is required' }] });
    }
    const { title, content } = req.body
    const published = req.body.published === 'true'
    const imageUrl = req.file ? req.file.path : null

    try {
        const post = await postModel.createPost(title, content, published, req.user.id, imageUrl);
        console.log('Post Created:', post)
        return res.status(201).json({ message: 'Post created successfully', post })
    } catch (err) {
        next(err)
    }
}

const updatePost_put = async (req, res, next) => {
    const { postId } = req.params
    const { title, content, published } = req.body
    try {
        const updatedPost = await postModel.updatePost(postId, title, content, published)
        console.log('Post Updated:', updatedPost)
        res.status(200).json({ message: 'Post updated successfully', updatedPost })
    } catch (err) {
        next(err)
    }
}

const deletePost_delete = async (req, res, next) => {
    const { postId } = req.params
    try {
        const deletedPost = await postModel.deletePost(postId)
        console.log('Post deleted: ', deletedPost)
        res.status(200).json({ message: 'Post deleted successfully', deletedPost })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    postsAll_get,
    postById_get,
    createPost_post,
    updatePost_put,
    deletePost_delete
}