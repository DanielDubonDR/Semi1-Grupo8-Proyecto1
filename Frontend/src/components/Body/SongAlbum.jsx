import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlusCircle } from "react-icons/bs";
import Service from "../../Service/Service";
function Song_Album({order, track, artist, name_album}){
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [duracion, setDuracion] = useState('');
    useEffect(() => {
        Service.getCancion(track.id_cancion)
        .then(response => {
            setDuracion(response.data.duracion);
        })

        
    }, [])
    const handleMouseEnter = () => {
        setShowMessage(true);
    };
    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleMouseLeave = () => {
    setShowMessage(false);
    };
    const handleMouseEnterFavorite = () => {
        if (isLiked) {
            setShowMessage2(true); // Mostrar "Quitar de favoritos"
        } else {
            setShowMessage1(true); // Mostrar "Añadir a favoritos"
        }
    };

    const handleMouseLeaveFavorite = () => {
        setShowMessage1(false);
        setShowMessage2(false);
    };
    return (
        <div className="grid grid-cols-3 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4 ">
                <p>{order +1}</p>
                <img 
                    className="h-10 w-10" 
                    src={track.path_imagen} 
                    alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.songName}</p>
                    <p>{artist}</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
            <p className="flex-grow w-12 hidden md:inline">{name_album}</p>
            </div>
            <div className="flex items-center justify-between">

                <div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                    onClick={toggleLike}
                    onMouseEnter={handleMouseEnterFavorite}
                    onMouseLeave={handleMouseLeaveFavorite}
                >
                    {isLiked ? <AiFillHeart className="text-xl text-lightPurple" /> : <AiOutlineHeart className="text-xl" />}
                    
                    {showMessage1 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2"> 
                            Añadir a favoritos
                        </div>
                    )}

                    {showMessage2 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2">
                            Quitar de favoritos
                        </div>
                    )}
                </div>
                <div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                >
                    <BsPlusCircle className="text-xl" />
                    {/*isLiked ? <AiFillHeart className="text-xl text-lightPurple" /> : <AiOutlineHeart className="text-xl" />*/}
                    
                    {/*showMessage3 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2"> 
                            Añadir a una Playlist
                        </div>
                    )*/}
                </div>

                <p>{duracion}</p>
            </div>
        </div>
    )
}

export default Song_Album;