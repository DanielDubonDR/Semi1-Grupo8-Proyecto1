import React from 'react'
import Login from './components/Login/Login'
import Sidebar from './components/Sidebar/Sidebar'
import SearchBar from './components/Rep/SearchBar'
import  Top5_Albumes from './components/TOP5_Albumes/Top5_Albumes'
import CRUD_album from './components/Admin/CRUD_album'
import CRUD_cancion from './components/Admin/CRUD_cancion'
import CRUD_artistas from './components/Admin/CRUD_artista'
import 'react-toastify/dist/ReactToastify.css';
import Playlist from './components/Body/Playlist'

function App() {
  return (

    
    <div className='bg-black h-screen overflow-hidden'>  
    
    

      {/*<main className='flex'>

          <Login />
          <Sidebar/>
          <SearchBar />
          <Playlist/>
          <Album/>
          <SearchBar />
          <Top5_Albumes />
          <Top5_Canciones />
          <Top3_artistas />
        
      </main>*/}
    </div>
  )
}

export default App
