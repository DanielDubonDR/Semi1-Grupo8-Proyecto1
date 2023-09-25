import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import Service from '../../Service/Service';
import Header_name from "./Header_name";
import SongsAlbum from './SongsAlbum';
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



function Album() {
    const [color, setColor] = React.useState(null);
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [nombre_artista, setNombre_artista] = useState('');
    const [path_imagen, setPath_imagen] = useState('');
    const [artista, setArtista] = useState('');
    const [canciones, setCanciones] = useState([]);
    useEffect(() => {
        setColor(shuffle(colors).pop());
        Service.getAlbum(id)
        .then(response => {
            console.log(response.data);
            setNombre(response.data.nombre);
            setPath_imagen(response.data.path_imagen);
            Service.getArtista(response.data.id_artista)
            .then(response => {
                setNombre_artista(response.data.nombres + ' ' + response.data.apellidos);
                setArtista(response.data);
            })
        })

        Service.listarCancionesAlbum(id)
        .then(response => {
            setCanciones(response.data);
        })

    }, []);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <Header_name/>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}
            >
                <img className="h-44 w-44 shadow-2xl" src={path_imagen} alt="" />
                <div>
                    <p className='font-bold'>ALBUM</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{nombre}</h1>
                    <p>{nombre_artista}</p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg">
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <SongsAlbum
                canciones={canciones}
                artist={nombre_artista}
                album={nombre}
                />
            </div>
        </div>
    )
}
export default Album;