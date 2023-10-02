import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlusCircle } from "react-icons/bs";
import { toast } from 'react-toastify';
import Service from "../../Service/Service";
import { usePlayer } from "../../context_Player/playerContext";
import convertirFechaParaSQL from "../../utils/utils";
import PlayPause from "./PlayPause";

const SongCard = ({song, isPlaying, activeSong, opcion,idSongModal,idSongAlbumModal, i}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [nameArtista, setNameArtista] = useState('');
    const [isMouseOver, setIsMouseOver] = useState(false);
    const { cancionActual, setCancionActual, canc, setCanc, reproduciendose, setReproduciendose } = usePlayer();

    useEffect(() => {
        Service.getArtista(song.id_artista)
        .then(response => {
            setNameArtista(response.data.nombres + ' ' + response.data.apellidos);
        })
        setIsLiked(song.isLiked)
    }, [])
    console.log(isLiked)
    const toggleLike = () => {
        if(isLiked==false){
            const data = {
                id_cancion: song.id_cancion,
                id_album: song.id_album,
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
                id_cancion: song.id_cancion,
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
    const handleOptionPlaylist = () => {
        opcion()
        idSongModal(song.id_cancion)
        idSongAlbumModal(song.id_album)
    }
    const handleSetSong = async (cancion) => {
        try {
        setCancionActual(cancion);
        setCanc([cancion])
        const hoy = new Date();
          let values = {
            id_cancion: cancion.id_cancion,
            id_album: cancion.id_album,
            id_usuario: JSON.parse(localStorage.getItem('data_user')).id,
            fecha: convertirFechaParaSQL(hoy)
          }
          console.log(values);
          let res = await Service.postReproduccion(values);
          console.log(res.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setReproduciendose(true);
      };
      
    return(
        <div className="flex flex-col w-[250px] p-4 bg-white bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
            <div className="relative w-full h-56 group" onClick={()=> handleSetSong(song)}>
            <div
                className={`relative group`}
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                >
                {isMouseOver && (
                    <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 flex`}>
                    <PlayPause
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        song={song}
                        handlePause={handlePauseClick}
                        handlePlay={handlePlayClick}
                    />
                    </div>
                )}
                <img src={song?.path_imagen} alt="song_img" />
            </div>
                
            </div>
            <div className="mt-4 flex flex-col">
                <p className="font-semibold text-lg text-white truncate">
                    {song?.nombre}
                </p>
                <p className="text-sm truncate text-gray-300 mt-1">
                    {nameArtista}
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
                onClick={handleOptionPlaylist}
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