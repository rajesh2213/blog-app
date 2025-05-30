import './App.css'
import AppRouter from './router.jsx'
import Header from './components/Header/Header.jsx'
import {useAuth} from './contexts/AuthContext.jsx'

function App() {
  const auth = useAuth()
  if(auth.loading){
    return <p>Loading...</p>
  }
  return (
    <>
      <Header />
      <AppRouter />
    </>
  )
}

export default App
