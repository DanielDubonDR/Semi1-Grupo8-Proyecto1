import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlusCircle } from "react-icons/bs";
import PlayPause from "./PlayPause";


const SongCard = ({song, isPlaying, activeSong, i}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);


    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const handlePauseClick = () => {

    }

    const handlePlayClick = () => {
    }

    const handleMouseEnter = () => {
    setShowMessage(true);
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

    return(
        <div className="flex flex-col w-[250px] p-4 bg-white bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
            <div className="relative w-full h-56 group">
                <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.name? 'flex bg-black bg-opacity-70': 'hidden'}`}>
                    <PlayPause
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        song={song}
                        handlePause={handlePauseClick}
                        handlePlay={handlePlayClick}
                    />
                </div>
                <img src={song?.img} alt="song_img" />
            </div>
            <div className="mt-4 flex flex-col">
                <p className="font-semibold text-lg text-white truncate">
                    {song?.name}
                </p>
                <p className="text-sm truncate text-gray-300 mt-1">
                    {song?.artist}
                </p>
                <div className="flex mt-2">
                <div
                    className="w-10 h-10 rounded-full text-white hover:text-white flex items-center justify-center mt-2 mr-3"
                    onClick={toggleLike}
                    onMouseEnter={handleMouseEnterFavorite}
                    onMouseLeave={handleMouseLeaveFavorite}
                >
                    {isLiked ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
                </div>
                <div
                className="w-10 h-10 rounded-full text-white hover:text-white flex items-center justify-center mt-2 mr-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                <BsPlusCircle className="text-xl"/>
                </div>
                {/* Mensaje temporal */}
                {showMessage && (
                    <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-30 left-0 mt-12 ml-2">
                    Agregar a la lista
                    </div>
                )}
                {showMessage1 && (
                    <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-30 left-0 mt-12 ml-2">
                    Añadir a favoritos
                    </div>
                )}
                {showMessage2 && (
                    <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-30 left-0 mt-12 ml-2">
                    Quitar de favoritos
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default SongCard;