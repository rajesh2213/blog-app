import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LimitProvider } from './contexts/LimitContext.jsx'
import { PostsProvider } from './contexts/PostsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <LimitProvider>
            <App />
          </LimitProvider>
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
