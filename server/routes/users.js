const { Router } = require('express');
const userRouter = Router();
const userCtrl = require('../controllers/userController');
const { body } = require('express-validator');
const isAuthenticated = require('../middlewares/authenticate');
const { decode } = require('jsonwebtoken');

userRouter.post('/user/login', [
    body('email').trim().notEmpty().withMessage('Please enter an email')
        .isEmail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().withMessage('Please enter a password')
], userCtrl.login_post)

userRouter.post('/user/register', (req, res, next) => {
    console.log(req.body)
    next()
},[
    body('email').trim().notEmpty().withMessage('Please enter an email')
        .isEmail().withMessage('Please enter a valid email'),
    body('username').trim().notEmpty().withMessage('Please enter a username'),
    body('password').trim().notEmpty().withMessage('Please enter a password')
        .custom((value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
            if (!passwordRegex.test(value)) {
                throw new Error('Password criterias not met. Please make sure your password meets the mentioned criterias')
            }
            return true
        }),
    body('confirmPassword').trim().notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true
        })
], userCtrl.register_post)

userRouter.post('/user/logout', userCtrl.logout_post)

userRouter.get('/user/profile/:userId', isAuthenticated, userCtrl.profile_get)

userRouter.post('/user/refresh', userCtrl.refreshToken_post)


module.exports = userRouter