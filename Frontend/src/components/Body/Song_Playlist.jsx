import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlusCircle } from "react-icons/bs";
import ContextMenu from "../contextmenu/contextmenu";
function Song_Playlist({order, track}){
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
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
    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuOpen(true);
        setContextMenuPos({ x: e.clientX, y: e.clientY });
    }
    
    const handleCloseContextMenu = () => {
    setContextMenuOpen(false);
    }

    useEffect(() => {
        // Agregar un manejador de eventos para cerrar el menú al hacer clic en cualquier parte fuera de él
        const handleOutsideClick = (e) => {
            if (contextMenuOpen && !e.target.closest('.context-menu')) {
                setContextMenuOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        // Limpia el manejador de eventos cuando el componente se desmonta
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [contextMenuOpen]);
    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" onContextMenu={handleContextMenu}>
            <div className="flex items-center space-x-4">
                <p>{order +1}</p>
                <img 
                    className="h-10 w-10" 
                    src={track.img} 
                    alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.name}</p>
                    <p>{track.artist}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="w-20 hidden md:inline">{track.album}</p>

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

                <p>{track.duration}</p>
            </div>
            <ContextMenu
                isOpen={contextMenuOpen}
                xPos={contextMenuPos.x}
                yPos={contextMenuPos.y}
                onClose={handleCloseContextMenu}
            />
        </div>
    )
}

export default Song_Playlist;