import { createBrowserRouter } from 'react-router-dom'
import Home from '../components/Body/Home'
import Profile from '../components/Profile/Profile'
import Profile_Edit from '../components/Profile/Profile_Edit'
import Sidebar from '../components/Sidebar/Sidebar'
import LayoutPrivate from '../layout/LayoutPrivate'
import Login from '../pages/Login/Login'
import NotFound from '../pages/NotFound'
import Registro from '../pages/Registro/Registro'
import Reproductor from '../components/Rep/Reproductor'
import SearchBar from '../components/Rep/SearchBar'


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
                    }
                ]
            },
        ]
    }
])