import {Link, useNavigate} from'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Header() {
    const { isAuthenticated, logout, user } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    // console.log('Rending header with auth: ', isAuthenticated)

    return (
        <header>
            <Link to='/'>
                BlogAppLOL
            </Link>
            <nav>
                { isAuthenticated ? (
                    <>
                        <Link to='/create-post'>Create Post</Link>
                        <Link to='/user/profile'>{user && Object.keys(user).length > 0 ? user.username : 'Profile'}</Link>
                        <button onClick={handleLogout}>
                            LogOut
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )

                }

            </nav>

        </header>
    )
}