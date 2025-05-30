const { Router } = require('express')
const postRouter = Router()
const postCtrl = require('../controllers/postController')
const { body } = require('express-validator')
const isAuthenticated = require('../middlewares/authenticate')
const commonHandler = require('../middlewares/commonHandler')
const upload = require('../config/multer')


postRouter.get('/posts', postCtrl.postsAll_get)
postRouter.get('/posts/:postId', postCtrl.postById_get)

postRouter.post('/posts', isAuthenticated,
    upload.single('cover'), [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be less than 50 characters'),
    body('content').trim().notEmpty().withMessage('Content is required'),
], postCtrl.createPost_post)

postRouter.put('/posts/:postId', isAuthenticated, [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be less than 50 characters'),
    body('content').trim().notEmpty().withMessage('Content is required')
], postCtrl.updatePost_put)

postRouter.delete('/posts/:postId', isAuthenticated, commonHandler.isAdmin, postCtrl.deletePost_delete)


module.exports = postRouter