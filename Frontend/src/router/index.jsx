import { createBrowserRouter } from 'react-router-dom'
import Favoritos from '../components/Body/Favoritos'
import Home from '../components/Body/Home'
import Profile from '../components/Profile/Profile'
import Profile_Edit from '../components/Profile/Profile_Edit'
import SearchBar from '../components/Rep/SearchBar'
import Sidebar from '../components/Sidebar/Sidebar'
import Top3_Artistas from '../components/TOP3/Top3_artistas'
import Top5_Albumes from '../components/TOP5_Albumes/Top5_albumes'
import Top5_Canciones from '../components/TOP5_canciones/Top5_canciones'
import LayoutPrivate from '../layout/LayoutPrivate'
import Login from '../pages/Login/Login'
import NotFound from '../pages/NotFound'
import Registro from '../pages/Registro/Registro'
import CRUD_cancion from '../components/Admin/CRUD_cancion'
import CRUD_album from '../components/Admin/CRUD_album'
import CRUD_artista from '../components/Admin/CRUD_artista'

import Reproductor from '../components/Rep/Reproductor'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
        errorElement: <NotFound />
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <NotFound />
    },
    {
        path: '/registro',
        element: <Registro />,
        errorElement: <NotFound />
    },
    {
        path:'/user',
        element: <LayoutPrivate />,
        errorElement: <NotFound />,
        children: [
            {   

                element: <Sidebar />,
                children: [
                    {
                        path:'home',
                        element: <Home />,
                    },
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                    {
                        path:'edit_profile',
                        element: <Profile_Edit />,
                    },
                    {
                        path: 'search',
                        element: <SearchBar />,
                    },
                    {
                        path:'favoritos',
                        element: <Favoritos />,
                    },
                    {
                        path: 'top5_canciones',
                        element: <CRUD_cancion />
                       // element: <Top5_Canciones />
                    },
                    {
                        path: 'top5_albumes',
                        //element: <Top5_Albumes />
                        element: <CRUD_album />
                    },
                    {
                        path: 'top3_artistas',
                        //element: <Top3_Artistas />
                        element: <CRUD_artista />
                    }
                ]
            },
        ]
    },
])