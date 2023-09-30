import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlay, BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Service from "../../Service/Service";
import ContextMenu from "../contextmenu/contextmenu";
function Song_Playlist({order, track, id_playlist, opcion,idSongModal,idSongAlbumModal}){
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [nombre_artista, setNombre_artista] = useState('');
    const [nombre_album, setNombre_album] = useState('');
    const navigate = useNavigate();
    const handleMouseEnter = () => {
        setShowMessage(true);
    };
    console.log(track)
    useEffect(() => {
        setIsLiked(track.isLiked)
    }, [])
    const toggleLike = () => {
        console.log(isLiked)
        if(isLiked==false){
            const data = {
                id_cancion: track.id_cancion,
                id_album: track.id_album,
                id_usuario: JSON.parse(localStorage.getItem('data_user')).id
            }
            Service.addFavorito(data)
            .then(response => {
                if(response.data.status){
                    toast.success('Se añadió tu canción a Favoritos!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    setIsLiked(true);
                    setTimeout(() => {
                        navigate('/user/playlists');
                    },1000)
                }else{
                    toast.error('Ocurrio un Error!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    }
            })
        }else{
            const data = {
                id_cancion: track.id_cancion,
                id_usuario: JSON.parse(localStorage.getItem('data_user')).id
            }
            Service.deleteFavorito(data)
            .then(response => {
                if(response.data.status){
                    toast.success('Se eliminó tu canción de Favoritos!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    setIsLiked(false);
                    setTimeout(() => {
                        navigate('/user/playlists');
                    },1000)
                }else{
                    toast.error('Ocurrio un Error!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    }
            })
        }
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

    const handleOptionPlaylist = () => {
        opcion()
        idSongModal(track.id_cancion)
        idSongAlbumModal(track.id_album)
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

    useEffect(() => {
        Service.getArtista(track.id_artista)
        .then(response => {
            setNombre_artista(response.data.nombres + ' ' + response.data.apellidos);
        })
        Service.getAlbum(track.id_album)
        .then(response => {
            setNombre_album(response.data.nombre);
        })
    },[])
    return (
        <div className="grid grid-cols-3 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" onContextMenu={handleContextMenu}>
            <div className="flex items-center space-x-4">
                <p>{order +1}</p>
                <img 
                    className="h-10 w-10" 
                    src={track.path_imagen} 
                    alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.nombre}</p>
                    <p>{nombre_artista}</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
            <p className="flex-grow w-12 hidden md:inline">{nombre_album}</p>
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
                    onClick={handleOptionPlaylist}
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
                <div className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative">
                    <BsPlay className="text-xl" />
                </div>
            </div>
            <ContextMenu
                isOpen={contextMenuOpen}
                xPos={contextMenuPos.x}
                yPos={contextMenuPos.y}
                onClose={handleCloseContextMenu}
                id_cancion={track.id_cancion}
                id_playlist={id_playlist}
            />

        </div>
    )
}

export default Song_Playlist;