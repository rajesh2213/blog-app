const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const login_post = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log('Errors [LOGIN-POST]: ', errors)
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    const pwd = password

    try {
        const user = await userModel.getUserByEmail(email)
        if (!user) {
            const err = new Error('User not found')
            err.status = 401;
            return next(err)
        }
        const match = await bcrypt.compare(pwd, user.password)
        if (!match) {
            const err = new Error('Incorrect password');
            err.status = 401;
            return next(err);
        }        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const { password, ...userData } = user

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ message: 'User logged-In', accessToken, user: userData })
    } catch (err) {
        next(err)
    }
}

const register_post = async (req, res, next) => {
    const errors = validationResult(req)
    console.log('Errors [REGISTER-POST]: ', errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, username, password } = req.body
    const role = req.body.role || null
    try {
        const existingUser = await userModel.getUserByEmail(email)
        if (existingUser) {
            const err = new Error('User already exists')
            err.status = 409
            return next(err)
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.createUser(email, username, hashPassword, role)
        console.log('User Created:', user)
        res.status(201).json({ message: "Registration successful. Please log in.", user });

    } catch (err) {
        next(err)
    }
}

const logout_post = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    })
    res.status(200).json({ message: 'Logged out successfully'} )
}

const profile_get = async (req, res, next) => {
    const {userId=null} = req.params 
    try {    
        const user = await userModel.getProfile(userId)
        if (!user) {
            const err = new Error('User not found')
            err.status = 404
            return next(err)
        }
        return res.status(200).json({ user })
    } catch(err){
        next(err)
    }
}

const refreshToken_post = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' })
    }
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
        const user = await userModel.getUserById(decoded.id)
        
        if (!user) {
            return res.status(403).json({ message: 'User not found' })
        }

        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
        // Delete sensitive information
        const { password, ...userData } = user
        res.json({ accessToken, user: userData })
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid refresh token' })
        }
        next(err)
    }
}

module.exports = {
    login_post,
    logout_post,
    register_post,
    profile_get,
    refreshToken_post,
}