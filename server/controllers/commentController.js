const commentModel = require('../models/commentModel');
const { validationResult } = require('express-validator')


const comments_get = async (req, res, next) => {
    const postId = req.params.postId;
    try{
        const comments = await commentModel.getCommentsByPostID(postId)
        if(!comments || comments.length === 0){
            const err = new Error('No comments found for this post');
            err.status = 404;
            return next(err);
        }
        return res.status(200).json({ message: `Comments fethed successfully for postID: ${postId}`, comments})
    }catch(err){
        next(err)
    }
}

const comment_post = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    const postId = req.params.postId
    const { content, parentId } = req.body
    try{
        const comment = await commentModel.createComment(req.user.id, postId, parentId, content)
        console.log('Comment created: ', comment)
        return res.status(201).json({ message: `Comment created successfully for postID: ${postId}`, comment})
    }catch(err){ 
        next(err)
    }
}

const comment_delete = async (req, res, next) => {
    const { commentId } = req.params
    try{
        const deletedComment = await commentModel.deleteComment(commentId)
        console.log('Comment deleted: ', deletedComment)
        return res.status(200).json({ message: `Comment deleted successfully for commentID: ${commentId}`})
    }catch(err){
        next(err)
    }
}

module.exports = {
    comments_get,
    comment_post,
    comment_delete
}