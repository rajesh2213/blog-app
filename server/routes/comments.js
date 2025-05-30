const { Router } = require('express')
const commentRouter = Router()
const commentCtrl = require('../controllers/commentController')
const { body } = require('express-validator')
const isAuthenticated = require('../middlewares/authenticate')
const commonHandler = require('../middlewares/commonHandler')

commentRouter.get('/posts/:postId/comments', commentCtrl.comments_get)

commentRouter.post('/posts/:postId/comments', isAuthenticated, [
    body('content').trim().notEmpty().withMessage('Content is required')
], commentCtrl.comment_post)

commentRouter.delete('/comments/:commentId', isAuthenticated, commonHandler.isAdmin, commentCtrl.comment_delete)

module.exports = commentRouter