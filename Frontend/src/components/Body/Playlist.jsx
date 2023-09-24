import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import Service from '../../Service/Service';
import { useUserContext } from '../../context/UserContext';
import Header_name from "./Header_name";
import Songs_Playlist from './Songs_Playlist';
const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-yellow-500",
    "from-red-500",
    "from-pink-500",
    "from-purple",
    "from-lightPurple",
    "from-gray-500",
];



function Playlist() {
    const [color, setColor] = React.useState(null);
    const {logueado, setLogueado} = useUserContext();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [canciones, setCanciones] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        setColor(shuffle(colors).pop());
        if(!logueado){
            navigate('/login');
        }
        const user_data = JSON.parse(sessionStorage.getItem('data_user'));
        Service.getDataUser(user_data.id)
        .then(response => {
            setNombre(response.data.nombres);
        })
    }, [logueado]);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <Header_name/>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}>
                <img className="h-44 w-44 shadow-2xl" src="https://i.pinimg.com/236x/bc/3e/3d/bc3e3de9ca839288c7779965afb5c17c.jpg" alt="" />
                <div>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Cumbiones para programar mientras lloras</h1>
                    <p className='font-bold'>PLAYLIST</p>
                    <p>{`Creado por: ${nombre}`}</p>
                    <p>{`Descripción: ${descripcion==''?'Ninguna': descripcion}`}</p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg">
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <Songs_Playlist/>
            </div>
        </div>
    )
}
export default Playlist;