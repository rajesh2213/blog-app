require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const passport = require('./config/passport')
const cookieParser = require('cookie-parser')

const errorHandler = require('./middlewares/errorHandler')
const isAuthenticated = require('./middlewares/authenticate');

const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')
const commentRouter = require('./routes/comments')

app.use(express.json({ limit: '20mb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(passport.initialize())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.get('/', isAuthenticated, (req, res)=>{
    res.json({
        message: 'Welcome to BLOG',
        user: req.user,
    });
})

// app.use('/', (req, res, next) => {
//     console.log('User: ', req.user)
//     next()
// })

app.use('/', userRouter, postRouter, commentRouter)

app.use(errorHandler)

app.listen(process.env.PORT, () => console.log(`Server is running on port: ${process.env.PORT} `))