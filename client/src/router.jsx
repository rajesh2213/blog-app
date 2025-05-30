import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import Profile from "./pages/Profile/Profile"

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/posts/:postId' element={<PostDetail/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/user/profile" element={<Profile />} />
        </Routes>
    )
}

export default AppRouter
