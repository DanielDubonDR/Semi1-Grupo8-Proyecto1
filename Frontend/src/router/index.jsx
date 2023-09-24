import { createBrowserRouter } from 'react-router-dom'
import CRUD_album from '../components/Admin/CRUD_album'
import CRUD_artista from '../components/Admin/CRUD_artista'
import CRUD_cancion from '../components/Admin/CRUD_cancion'
import ArtistDetails from '../components/Body/ArtistDetails'
import CrearPlaylist from '../components/Body/CrearPlaylist'
import EditarPlaylist from '../components/Body/EditarPlaylist'
import Favoritos from '../components/Body/Favoritos'
import Historial from '../components/Body/Historial'
import Home from '../components/Body/Home'
import MyPlaylists from '../components/Body/MyPlaylists'
import Playlist from '../components/Body/Playlist'
import Profile from '../components/Profile/Profile'
import Profile_Edit from '../components/Profile/Profile_Edit'
import SearchBar from '../components/Rep/SearchBar'
import Sidebar from '../components/Sidebar/Sidebar'
import Sidebar_admin from '../components/Sidebar/Sidebar_admin'
import Top3_artistas from '../components/TOP3/Top3_artistas'
import Top5_Albumes from '../components/TOP5_Albumes/Top5_albumes'
import Top5_Canciones from '../components/TOP5_canciones/Top5_canciones'
import LayoutPrivate from '../layout/LayoutPrivate'
import Login from '../pages/Login/Login'
import NotFound from '../pages/NotFound'
import Registro from '../pages/Registro/Registro'
const user = JSON.parse(sessionStorage.getItem('data_user'));

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
                element: user !== null ?(user.rol === 0 ? <Sidebar />: <Sidebar_admin />): <Login/>,
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
                        element: <Top5_Canciones />
                    },
                    {
                        path: 'top5_albumes',
                        element: <Top5_Albumes />
                    },
                    {
                        path: 'top3_artistas',
                        element: <Top3_artistas/>
                    },
                    {
                        path: 'crud_artista',
                        element: <CRUD_artista />
                    },
                    {
                        path: 'crud_album',
                        element: <CRUD_album />
                    },
                    {
                        path: 'crud_cancion',
                        element: <CRUD_cancion />
                    },
                    {
                        path:'artista/:id',
                        element: <ArtistDetails />
                    },
                    {
                        path:'playlists',
                        element: <MyPlaylists />
                    },
                    {
                        path:'historial',
                        element: <Historial />
                    },
                    {
                        path: 'playlist/:id',
                        element: <Playlist />
                    },
                    {
                        path: 'playlist/crear',
                        element: <CrearPlaylist />
                    },
                    {
                        path: 'playlist/editar/:id',
                        element: <EditarPlaylist/>
                    }
                ]
            },
        ]
    },
])