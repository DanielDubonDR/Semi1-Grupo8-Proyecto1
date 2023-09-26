import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import UserProvider from './context/UserContext'
import './index.css'
import { router } from './router'
import PlayerProvider from './context_Player/playerContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <PlayerProvider>
      <RouterProvider router={router} className="scrollbar-hide"/>
      </PlayerProvider>
    </UserProvider>
  </React.StrictMode>,
)
